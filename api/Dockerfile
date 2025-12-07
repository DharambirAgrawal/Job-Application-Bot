# Use official Python slim image
FROM python:3.13-slim

# Install system dependencies for Playwright/Chromium
# Install Chromium deps + fonts
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 fonts-liberation fonts-noto \
    fonts-dejavu fonts-freefont-ttf fonts-droid-fallback \
    wget curl unzip git \
    && rm -rf /var/lib/apt/lists/*


# Set work directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install Chromium deps + fonts
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 fonts-liberation fonts-noto \
    fonts-woff2 fonts-dejavu && \
    rm -rf /var/lib/apt/lists/*


# Install Playwright browsers
RUN playwright install chromium

# Copy all source code
COPY . .

# Expose Flask default port
EXPOSE 5000

# Run the app with Gunicorn
CMD ["gunicorn", "index:app", "--bind", "0.0.0.0:5000", "--workers", "1"]


# sudo apt install -y     libnss3 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2     libxkbcommon-x11-0 libxcomposite1 libxdamage1 libxrandr2     libgbm1 libpango-1.0-0 libgtk-4-1 libgraphene-1.0-0     fonts-woff2 libvpx9 libavif16 libwebpmux3     libenchant-2-2 libx264 libflite1 libgstreamer-gl1.0-0     libgstreamer-plugins-base1.0-0