#!/bin/bash

# ============================================
# Deployment Script untuk CRM Munira
# VPS: 43.157.202.165
# ============================================

set -e

VPS_HOST="43.157.202.165"
VPS_USER="ubuntu"
REMOTE_DIR="/opt/crm-munira"

echo "============================================"
echo "🚀 Deploying CRM Munira to $VPS_HOST"
echo "============================================"

# Cek apakah SSH bisa terkoneksi
echo "📡 Testing SSH connection..."
ssh -o ConnectTimeout=10 ${VPS_USER}@${VPS_HOST} "echo '✅ SSH connection successful'" || {
    echo "❌ Cannot connect to VPS. Please check SSH access."
    exit 1
}

# Buat direktori di VPS
echo "📁 Creating directory on VPS..."
ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ${REMOTE_DIR}"

# Sync files ke VPS (exclude yang tidak perlu)
echo "📦 Syncing files to VPS..."
rsync -avz --progress \
    --exclude '.git' \
    --exclude 'node_modules' \
    --exclude '.env' \
    --exclude '*.db' \
    --exclude '*.db-shm' \
    --exclude '*.db-wal' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '.DS_Store' \
    --exclude 'frontend/node_modules' \
    --exclude 'frontend/.next' \
    ./ ${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/

# Jalankan perintah di VPS
echo "🐳 Setting up Docker on VPS..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
cd /opt/crm-munira

# Install Docker jika belum ada
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose jika belum ada
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Stop container lama jika ada
echo "🛑 Stopping old containers..."
docker-compose -f docker-compose.prod.yml down || true

# Build dan jalankan container baru
echo "🔧 Building and starting containers..."
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Tampilkan status
echo ""
echo "============================================"
echo "✅ Deployment Complete!"
echo "============================================"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "🌐 Access your app at: http://43.157.202.165"
echo "============================================"
ENDSSH

echo ""
echo "🎉 Deployment finished successfully!"
echo "🌐 Open http://43.157.202.165 in your browser"