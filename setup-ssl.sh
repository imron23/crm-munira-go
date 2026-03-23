#!/bin/bash

# ============================================
# Setup SSL Let's Encrypt untuk muniraworld.id
# ============================================

DOMAIN="muniraworld.id"
EMAIL="admin@muniraworld.id"  # Ganti dengan email Anda

echo "🚀 Setup SSL Let's Encrypt untuk $DOMAIN"

# 1. Buat direktori certbot
echo "📁 Membuat direktori certbot..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./certbot/logs

# 2. Buat nginx config sementara untuk ACME challenge
echo "📝 Membuat nginx config sementara..."
cat > nginx-init.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    client_max_body_size 50M;

    upstream backend {
        server backend:8080;
    }

    server {
        listen 80;
        server_name muniraworld.id www.muniraworld.id;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
EOF

# 3. Copy nginx config sementara
cp nginx-init.conf nginx.conf

# 4. Stop containers yang ada
echo "🛑 Menghentikan container yang ada..."
docker compose -f docker-compose.prod.yml down

# 5. Start nginx dengan config sementara
echo "🚀 Menjalankan nginx dengan config sementara..."
docker compose -f docker-compose.prod.yml up -d nginx backend postgres

# 6. Tunggu nginx siap
echo "⏳ Menunggu nginx siap..."
sleep 5

# 7. Generate SSL certificate
echo "🔐 Generating SSL certificate..."
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# 8. Check if certificate was generated
if [ -d "./certbot/conf/live/$DOMAIN" ]; then
    echo "✅ SSL Certificate berhasil di-generate!"
    
    # 9. Restore nginx config dengan SSL
    echo "📝 Menggunakan nginx config dengan SSL..."
    cat > nginx.conf << 'NGINX_EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile        on;
    keepalive_timeout  65;
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/xml application/json;

    # Upstream untuk backend API
    upstream backend {
        server backend:8080;
    }

    # Redirect HTTP ke HTTPS
    server {
        listen 80;
        server_name muniraworld.id www.muniraworld.id;

        # ACME challenge untuk Let's Encrypt
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect semua HTTP ke HTTPS
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # Server HTTPS
    server {
        listen 443 ssl http2;
        server_name muniraworld.id www.muniraworld.id;

        # SSL Certificates Let's Encrypt
        ssl_certificate /etc/letsencrypt/live/muniraworld.id/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/muniraworld.id/privkey.pem;

        # SSL Security Settings
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;

        # Modern SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # HSTS
        add_header Strict-Transport-Security "max-age=63072000" always;

        # Dashboard - route utama
        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # API endpoints
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static assets
        location /assets/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Error pages
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
NGINX_EOF

    # 10. Restart semua services
    echo "🔄 Restart semua services dengan SSL..."
    docker compose -f docker-compose.prod.yml down
    docker compose -f docker-compose.prod.yml up -d

    # 11. Cleanup
    rm -f nginx-init.conf

    echo ""
    echo "✅ Setup SSL berhasil!"
    echo "🌐 Aplikasi tersedia di: https://$DOMAIN"
    echo ""
    echo "📋 Catatan penting:"
    echo "   - SSL certificate akan auto-renew setiap 12 jam"
    echo "   - Pastikan DNS $DOMAIN sudah pointing ke IP server"
    echo "   - Port 80 dan 443 harus terbuka di firewall"
else
    echo "❌ Gagal generate SSL certificate"
    echo " Pastikan:"
    echo "   1. DNS $DOMAIN sudah pointing ke IP server"
    echo "   2. Port 80 terbuka di firewall"
    echo "   3. Domain dapat diakses dari internet"
    exit 1
fi