package main

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	dbURL := "postgresql://munira:munira_password@localhost:5432/munira_crm"
	pool, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		fmt.Println("Err:", err)
		os.Exit(1)
	}
	defer pool.Close()

	var historyJSON []byte
	err = pool.QueryRow(context.Background(), "SELECT status_history FROM leads LIMIT 1").Scan(&historyJSON)
	if err != nil {
		fmt.Println("Query err:", err)
		return
	}
	fmt.Println("Raw JSON:", string(historyJSON))
}
