### Build
```bash
docker build --file docker/Dockerfile --tag test_task_frontend20240318 .
```

### Run
```bash
docker run \
--publish 3180:80 \
--env API_URL="http://127.0.0.1:3000" \
test_task_frontend20240318
```
