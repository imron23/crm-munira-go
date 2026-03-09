# Build stage
FROM golang:1.24-alpine AS builder

# Force cache bust for new builds
ARG CACHE_BUST=1

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Force downgrade go version in go.mod strictly for container build to bypass local go1.25.4 requirements
RUN sed -i 's/^go 1.*/go 1.22/' go.mod && go mod tidy || true

# Download all dependencies
RUN go mod download

# Copy source code and json assets
COPY . .

# Explicitly remove .env file if present (use container environment variables)
RUN rm -f .env

# Force downgrade go version in go.mod strictly for container build to bypass local go1.25.4 requirements
RUN sed -i 's/^go 1.*/go 1.22/' go.mod && go mod tidy || true

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o munira-api ./cmd/api

# Final stage
FROM alpine:latest

WORKDIR /app

# Install tzdata just in case for timezone operations
RUN apk --no-cache add tzdata

# Copy binary
COPY --from=builder /app/munira-api .

# Copy json assets (do NOT copy .env - use container environment variables)
COPY --from=builder /app/wilayah.json ./wilayah.json

# Expose port
EXPOSE 8080

# Command to run
CMD ["./munira-api"]
