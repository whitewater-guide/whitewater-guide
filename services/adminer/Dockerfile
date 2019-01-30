FROM adminer:latest

# https://stackoverflow.com/questions/30489332/adminer-login-via-a-reverse-proxy
COPY adminer.diff .
RUN patch < adminer.diff
