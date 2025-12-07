FROM python:3.13-slim

# Install system dependencies for Playwright/Chromium
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 fonts-liberation fonts-noto \
    fonts-dejavu fonts-freefont-ttf fonts-droid-fallback \
    wget curl unzip git && \
    rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements and install Python deps
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install Playwright Chromium browser
RUN playwright install chromium

# Copy application source
COPY . .

# Expose Flask default port
EXPOSE 5000

# Run app with Gunicorn
CMD ["gunicorn", "index:app", "--bind", "0.0.0.0:5000", "--workers", "1"]
