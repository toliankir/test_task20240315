if [ ! -z "${API_URL}" ]; then
   echo "Update API_URL_PLACEHOLDER to ${API_URL}"
   sed -i "s~API_URL_PLACEHOLDER~${API_URL}~g" /usr/share/nginx/html/index.html
fi

nginx -g "daemon off;"
