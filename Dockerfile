FROM mcr.microsoft.com/playwright:v1.51.1-jammy

ENV TAGS=""
ENV SHARD="1/1"
ENV WORKERS=3
ENV BROWSER="chromium"

WORKDIR /app

COPY playwright.config.ts .env* package*.json tsconfig.json ./
COPY ./src ./src

RUN npm ci

CMD DOCKER="true" BROWSER=${BROWSER} npx playwright test --shard=${SHARD} --grep="${TAGS}" --workers=${WORKERS}
