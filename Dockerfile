FROM node:20-slim

# 1. Setup Environment
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# 2. Heavy Layer: Chrome & Core Dependencies (Rarely changes)
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    ffmpeg \
    libxss1 \
    --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Font Layer: Split this out so you can edit it quickly
# This layer is cached separately. Adding a font here won't trigger step 2!
RUN apt-get update && apt-get install -y \
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

# 4. App Dependencies (Only rebuilds if package.json changes)
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# 5. Application Code (Changes most often)
COPY . .
RUN mkdir -p /app/data && chown -R node:node /app

USER node
ENTRYPOINT ["node", "src/index.js"]