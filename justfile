set dotenv-load
set export

# Serve the site for dev usage
ui-serve:
    bun run dev

# Build the site for production
ui-build:
    bun run build

# Use prettier & biome to format the code
ui-format:
    bun run prettier && bun run format

# convert all the images to webp
ui-webp:
    bun run webp

# install deps
i:
    bun i

# check for outdated deps
ui-outdated:
    bun outdated

# check for dependency updates
ui-check:
    bun run taze

# upgrade deps
ui-upgrade:
    bun run taze latest -u && just ui-clean-npm-i

# clear node_modules, bun lock file and reinstall deps
ui-clean-npm-i:
    rm -rf node_modules && rm -rf bun.lockb && bun i

# Login to ECR
login:
    aws --profile default configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    aws --profile default configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    aws ecr get-login-password --region $DOCKER_REPO_REGION | docker login --username AWS --password-stdin $DOCKER_REPO

# Build
build:
    docker build --platform linux/amd64 -t docs.rocketpool.net:latest . -f .deploy/dockerfile

# Login and deploy to ECR
login-and-deploy:
    aws --profile default configure set aws_access_key_id $AWS_ACCESS_KEY_ID
    aws --profile default configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
    aws ecr get-login-password --region $DOCKER_REPO_REGION | docker login --username AWS --password-stdin $DOCKER_REPO
    docker build --platform linux/amd64 -t docs.rocketpool.net:latest . -f .deploy/dockerfile
    docker tag docs.rocketpool.net:latest $DOCKER_REPO/docs.rocketpool.net:latest
    docker push $DOCKER_REPO/docs.rocketpool.net:latest

# Build and deploy to ECR
deploy:
    docker build --platform linux/amd64 -t docs.rocketpool.net:latest . -f .deploy/dockerfile
    docker tag docs.rocketpool.net:latest $DOCKER_REPO/docs.rocketpool.net:latest
    docker push $DOCKER_REPO/docs.rocketpool.net:latest

tag-push:
    docker tag docs.rocketpool.net:latest $DOCKER_REPO/docs.rocketpool.net:latest
    docker push $DOCKER_REPO/docs.rocketpool.net:latest

rmi:
    docker rmi $DOCKER_REPO/docs.rocketpool.net:latest
