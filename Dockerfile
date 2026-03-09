# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY backend/go.mod backend/go.sum ./

# Force downgrade go version in go.mod strictly for container build
RUN sed -i 's/^go 1.*/go 1.22/' go.mod && go mod tidy || true

# Download all dependencies
RUN go mod download

# Copy source code
COPY backend/ .

# Force downgrade go version again
RUN sed -i 's/^go 1.*/go 1.22/' go.mod && go mod tidy || true

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o munira-api ./cmd/api

# Final stage
FROM alpine:latest

WORKDIR /app

# Install tzdata for timezone operations
RUN apk --no-cache add tzdata

# Copy binary from builder
COPY --from=builder /app/munira-api .

# Copy wilayah.json from builder
COPY --from=builder /app/wilayah.json ./wilayah.json

# Copy static files
COPY dashboard/ ./dashboard/
COPY lp-2-long/ ./lp-2-long/
COPY lp-liburan/ ./lp-liburan/
COPY lp-bakti-anak/ ./lp-bakti-anak/
COPY lp-itikaf-premium/ ./lp-itikaf-premium/
COPY lp-spiritual-journey/ ./lp-spiritual-journey/
COPY jualan-lp/ ./jualan-lp/
COPY "jualan lp/" ./jualan-lp-space/
COPY assets/ ./assets/
COPY index.html ./index.html
COPY manifest.json ./manifest.json
COPY sw.js ./sw.js

# Expose port
EXPOSE 8080

# Command to run
CMD ["./munira-api"]