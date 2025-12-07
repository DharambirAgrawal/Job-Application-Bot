# Use official Python slim image
FROM python:3.13-slim

# Install system dependencies for Playwright/Chromium
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 wget curl unzip git \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy only the api folder
COPY api/ ./api/
WORKDIR /app/api

# Copy requirements
COPY requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install Playwright browsers
RUN playwright install chromium

# Copy all source code
COPY . .

# Expose Flask default port
EXPOSE 5000

# Run the app with Gunicorn
CMD ["gunicorn", "index:app", "--bind", "0.0.0.0:5000", "--workers", "1"]
