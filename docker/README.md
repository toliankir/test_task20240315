### Build
```bash
docker build --file docker/Dockerfile --tag test_task20240315 .
```

### Run
```bash
docker run \
--publish 3100:3000 \
--network test-task-local-tier \
--env POSTGRES_CONNECTION_STRING=postgres://postgres:@postgres:5432/devdb?schema=test_task20240315 \
--env JWT_SECRET=STRONG_JWT_SECRET \
--env JWT_REFRESH_SECRET=STRONG_JWT_REFRESH_SECRET \
--env JWT_TTL_MINUTES=60 \
--env JWT_REFRESH_TTL_MINUTES=43200 \
--env RUN_MIGRATION=yes \
--env RUN_SEED=yes \
test_task20240315
```
