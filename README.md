# Test task setup

## Get Started

### Clone the repository
```shell
git clone --branch workspace git@github.com:toliankir/test_task20240315.git
cd test_task20240315
```

### Initialize worktree by execute following commands
```shell
git worktree add backend backend-master
git worktree add frontend frontend-master
git worktree add doc doc
git worktree add local-env local-env
```

### Open VSCode Workspace
```shell
code "test-task.code-workspace"
```

### Running
* Run local environment according to README.md
* Run backend service according to README.md
* Run frontend service according to README.md

### Running in docker
```bash
docker-compose up --build
```
* Frontend application http://127.0.0.1:3180
* Backend swagger http://127.0.0.1:3100/api-doc
* Backend bull dashboard http://127.0.0.1:3100/queues

### Add new orphan branch

```shell
NEW_BRANCH=...
git worktree add --detach "./${NEW_BRANCH}"
cd "./${NEW_BRANCH}"
git checkout --orphan "${NEW_BRANCH}"
git reset --hard
git commit --allow-empty -m "Initial Commit"
git push origin "${NEW_BRANCH}"
```
