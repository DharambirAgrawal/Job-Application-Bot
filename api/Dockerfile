# ---- Base image ----
FROM python:3.13-slim

# ---- Set working directory ----
WORKDIR /app

# ---- Install system dependencies ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget unzip curl gnupg ca-certificates fonts-liberation fonts-noto fonts-dejavu \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 fontconfig locales \
    && rm -rf /var/lib/apt/lists/*

# ---- Set locale for proper text rendering ----
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

# ---- Install Calibri font manually ----
RUN mkdir -p /usr/share/fonts/truetype/msttcorefonts \
    && wget -O /tmp/calibri.zip "https://github.com/alcortesm/fonts/raw/master/ttf/calibri.zip" \
    && unzip /tmp/calibri.zip -d /usr/share/fonts/truetype/msttcorefonts \
    && fc-cache -f -v \
    && rm /tmp/calibri.zip

# ---- Copy Python requirements ----
COPY api/requirements.txt ./requirements.txt

# ---- Install Python dependencies ----
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# ---- Install Playwright and Chromium ----
RUN pip install playwright
RUN playwright install chromium

# ---- Copy app code ----
COPY api/ ./api/

# ---- Set working directory to your code folder ----
WORKDIR /app/api

# ---- Expose Flask port ----
EXPOSE 5000

# ---- Start the Flask app ----
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--workers", "2", "--threads", "4"]
