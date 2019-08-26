# Build and Deployment Environments

## `docker/`

Contains the Docker image definitions for the CI/CD build process.

## `deployment/`

Contains the Kubernetes resource definitions for deployment, as well as certain dynamic environment variables for backend.

## `scripts/`

Contains various scripts used for configuring the CI/CD pipeline stages.

## `tests/`

Contains the build and test processes for the CI/CD pipeline.

## `variables/`

Contains the environment variable files for the frontend namespaces.

These variables are passed in from via Docker env variables from `project_root/.environments/variables/_` via `project_root/docker-compose.yml` to `project_root/WebApp/Dockerfile` - ensure that the variables are configured in all three files! To configure a private variable for the frontend, follow the same process, but include the variable in GitLab instead of the relevant `project_root/.environments/variables/_` file.