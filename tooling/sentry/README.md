# Step 1

Create dockeradmin ssh user

# Step 2

Create docker-machine

```sh
docker-machine create -d generic \
  --engine-storage-driver overlay2 \
  --generic-ip-address <ip> \
  --generic-ssh-key $HOME/.ssh/docker_ww_sentry_rsa \
  --generic-ssh-user dockeradmin \
  ww-sentry
```

# Step 3

Using `ww-sentry` docker-machine, follow [sentry onpremise tutorial](https://github.com/getsentry/onpremise)
