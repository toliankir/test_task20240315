import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client/core";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getApiUrl } from "./get-apiurl";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

export const getGraphqlClient = (token?: string) => {
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${getApiUrl("graphql", {
        protocol: "ws"
      })}`,
      retryAttempts: 50,
    })
  );

  const httpLink = new HttpLink({
    uri: `${getApiUrl("graphql")}`,
    headers: token
    ? { "Authorization": `Bearer ${token}` }
    : undefined,
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      )
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}
