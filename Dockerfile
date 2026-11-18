FROM node:24-trixie-slim

# 1. Setup Environment & MCP Metadata
LABEL io.modelcontextprotocol.server.name="io.github.GehDoc/svg-to-video"

EXPOSE 8080

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    FFMPEG_SKIP_DOWNLOAD=true \
    FFMPEG_PATH=/usr/local/bin/ffmpeg \
    NODE_ENV=production \
    HOME=/tmp/chrome-home

# 2. Static FFmpeg & Media Tools
COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /ffprobe /usr/local/bin/

# 3. Chromium & International Fonts Layer
RUN apt-get update && apt-get install -y \
    chromium \
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

# 4. Create directories for Chrome's user data and output data with non-root permissions
RUN mkdir -p /tmp/chrome-home && chmod 777 /tmp/chrome-home \
    && mkdir -p /app/data && chmod 777 /app/data

# 5. Build App & Production Prune
COPY package*.json tsconfig*.json ./
COPY src/ ./src/
COPY shared/ ./shared/
COPY skills/ ./skills/
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
COPY README.md LICENSE ./

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && npm install --include=dev --no-workspaces --ignore-scripts \
    && npm run build \
    && npm prune --omit=dev --no-workspaces \
    && rm -rf src shared tsconfig*.json

USER node
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
