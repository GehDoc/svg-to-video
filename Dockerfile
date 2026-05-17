# Base image with system dependencies
FROM node:24-slim AS base
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production \
    HOME=/tmp/chrome-home

RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates ffmpeg libxss1 fontconfig \
    fonts-freefont-ttf fonts-liberation fonts-noto-color-emoji \
    fonts-noto-cjk fonts-noto-cjk-extra fonts-ipafont-gothic fonts-wqy-zenhei \
    --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -f -v

WORKDIR /app
RUN mkdir -p /tmp/chrome-home && chmod 777 /tmp/chrome-home \
    && mkdir -p /app/data && chmod 777 /app/data

# Stage: Tester (includes devDependencies)
FROM base AS tester
COPY package*.json ./
RUN npm install --ignore-scripts
COPY . .
USER node
ENTRYPOINT ["npx", "tsx", "src/index.ts"]

# Stage: Production (lean, omits devDependencies)
FROM base AS prod
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts
COPY . .
USER node
ENTRYPOINT ["npx", "tsx", "src/index.ts"]
