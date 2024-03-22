if [ "${RUN_MIGRATION}" = "yes" ]; then
   echo "Run DB migrations"
   npx typeorm migration:run -d dist/database/datasource.js
fi

# if [ "${RUN_SEED}" = "yes" ]; then
#    echo "Run DB seeds"
#    npx node ./node_modules/typeorm-extension/bin/cli.cjs seed:run -d dist/database/datasource.js
# fi

node dist/main.js