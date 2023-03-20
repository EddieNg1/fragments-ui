FROM node:18.14-alpine@sha256:fdbd2737cb94e25cae3db9fc5d7dc073c9675dad34239bfb3948c499a6908c19 AS dependencies

LABEL maintainer="Eddie Ng <eng42@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy our package.json/package-lock.json into /app/
COPY --chown=node:node package*.json /app/

# Install node dependencies defined in package.json and package-lock.json
RUN npm ci

##############################################################

FROM node:18.14-alpine@sha256:fdbd2737cb94e25cae3db9fc5d7dc073c9675dad34239bfb3948c499a6908c19 AS builder

WORKDIR /app
# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app

COPY --chown=node:node ./src ./src
# Copy source code into the image
COPY --chown=node:node . .

USER node

# Build the site to build/
CMD npm run build

##############################################################

FROM nginx:stable-alpine@sha256:2366ede62d2e26a20f7ce7d0294694fe52b166107fd346894e4658dfb5273f9c AS deploy

# Put our build/ into /usr/share/nginx/html/ and host static files
COPY --chown=node:node --from=builder /app/dist/ /usr/share/nginx/html/

USER node

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:80 || exit 1