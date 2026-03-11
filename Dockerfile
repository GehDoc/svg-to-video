FROM node:20-slim

# 1. Setup Environment
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# 2. Install Chrome and Dependencies in a single layer to reduce footprint
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    ffmpeg \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    # Install Chrome with full GPG verification
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Handle dependencies as root first
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts

# 4. Finalizing security: Permissions and non-root user
COPY . .
# Ensure the node user owns the app files and the data directory
RUN mkdir -p /app/data && chown -R node:node /app

# Switch to the non-privileged user provided by the Node image
USER node

ENTRYPOINT ["node", "index.js"]