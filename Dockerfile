FROM node:22-alpine AS dev

# Localstack
ENV AWS_ACCESS_KEY_ID=test
ENV AWS_SECRET_ACCESS_KEY=test
ENV AWS_REGION=us-east-1

# Image labels
LABEL version="0.1"

# Environment variables
ENV PATH="/application/node_modules/.bin:${PATH}"
ENV NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"

# Certificates
COPY docker/certificate.crt /usr/local/share/ca-certificates/certificate.crt

# System setup
RUN apk add git openssh ca-certificates bash sudo make build-base libcap curl mysql-client aws-cli groff less && update-ca-certificates

# User permissions
RUN echo "node ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/node && chmod 0440 /etc/sudoers.d/node
RUN sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
RUN rm /var/cache/apk/*

# Update NPM
RUN npm -g update


# Working directory
WORKDIR /application

# Termination signal
STOPSIGNAL SIGTERM

# Initialization command
CMD npm run watch
