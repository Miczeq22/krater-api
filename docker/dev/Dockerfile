
ARG IMAGE=node:14.15-alpine
FROM $IMAGE as builder

WORKDIR /app

RUN apk add --no-cache bash curl git py-pip make && \
  curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh && \
  npm install node-dev -g && npm cache clean --force

FROM builder

COPY docker ./docker
COPY .npmr[c] package.json package-lock.json ./

RUN npm ci && npm cache clean --force && \
  npm dedupe && \
  rm -f .npmrc

COPY . .
RUN npm run build

COPY .env.dist ./build/.env.dist
COPY ./swagger ./swagger