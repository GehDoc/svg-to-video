FROM node:24-slim

# 1. Setup Environment
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production \
    HOME=/tmp/chrome-home

# 2. Heavy Layer: Chromium, FFmpeg, Fonts & OS Security Patches
RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    chromium \
    ffmpeg \
    fontconfig \
    fonts-freefont-ttf \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    fonts-noto-cjk-extra \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    --no-install-recommends \
    && fc-cache -f -v \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Create a directory for Chrome's user data and set permissions for allowing non-root users to write to it.
# 4. Create a directory for output data and set permissions for allowing non-root users to write to it.
RUN mkdir -p /tmp/chrome-home && chmod 777 /tmp/chrome-home \
    && mkdir -p /app/data && chmod 777 /app/data

# 5. Build App & Production Prune
COPY package*.json tsconfig*.json ./
COPY src/ ./src/
COPY shared/ ./shared/
COPY skills/ ./skills/
COPY README.md LICENSE ./

RUN NODE_ENV=development npm install --include=dev --no-workspaces --ignore-scripts \
    && npm run build \
    && npm prune --omit=dev --no-workspaces \
    && rm -rf src shared tsconfig*.json

USER node
ENTRYPOINT ["node", "dist/src/index.js"]
