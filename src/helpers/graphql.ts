import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { getApiUrl } from "./get-apiurl";

export const getGraphqlClient = (token?: string) => {
  const link = new HttpLink({
    uri: `${getApiUrl()}/graphql`,
    headers: token 
    ? { "Authorization": `Bearer ${token}` }
    : undefined
  });
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}
