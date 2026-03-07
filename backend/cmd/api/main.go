package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"munira_crm_backend/internal/config"
	delivery "munira_crm_backend/internal/delivery/http"
	"munira_crm_backend/internal/repository/postgres"
	"munira_crm_backend/internal/usecase"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	ctx := context.Background()

	dbPool, err := config.ConnectPostgres(ctx)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer dbPool.Close()

	router := gin.Default()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := router.Group("/api")
	{
		vendorRepo := postgres.NewVendorRepository(dbPool)
		vendorUsecase := usecase.NewVendorUsecase(vendorRepo)

		leadRepo := postgres.NewLeadRepository(dbPool)
		leadUsecase := usecase.NewLeadUsecase(leadRepo)

		delivery.NewVendorHandler(api, vendorUsecase)
		delivery.NewLeadHandler(api, leadUsecase)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
