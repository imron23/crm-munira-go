package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

// ConnectPostgres connects to the PostgreSQL database using pgxpool
func ConnectPostgres(ctx context.Context) (*pgxpool.Pool, error) {
	connStr := os.Getenv("POSTGRES_URI")
	if connStr == "" {
		connStr = os.Getenv("DATABASE_URL")
	}
	if connStr == "" {
		connStr = os.Getenv("DB_URI")
	}
	log.Printf("DEBUG: POSTGRES_URI=%s", os.Getenv("POSTGRES_URI"))
	log.Printf("DEBUG: DATABASE_URL=%s", os.Getenv("DATABASE_URL"))
	log.Printf("DEBUG: DB_URI=%s", os.Getenv("DB_URI"))
	if connStr == "" {
		// default to localhost for development if not set
		connStr = "postgres://munira:munira_password@localhost:5432/munira_crm?sslmode=disable"
	}
	log.Printf("DEBUG: Using connection string (masked): host=*** database=munira_crm")

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return nil, fmt.Errorf("error parsing connection string: %w", err)
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return nil, fmt.Errorf("error pinging database: %w", err)
	}

	return pool, nil
}
