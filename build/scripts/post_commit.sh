#!/usr/bin/env bash

# see https://stackoverflow.com/questions/48766328/git-pre-commit-hook-behavior-with-intellij-idea/48790009#48790009
echo "Running post-commit hook"

git add packages/backend/package.json
git add packages/caddy/package.json
git add packages/clients/package.json
git add packages/commons/package.json
git add packages/db/package.json
git add packages/landing/package.json
git add packages/minio/package.json
git add packages/mongo-to-postgres/package.json
git add packages/web/package.json
git add packages/workers/package.json
git add package.json


gitdir="$(git rev-parse --git-dir)"
hook="$gitdir/hooks/post-commit"

# disable post-commit hook temporarily
[ -x $hook ] && chmod -x $hook

git commit --amend --no-verify -C HEAD

# enable it again
chmod +x $hook
