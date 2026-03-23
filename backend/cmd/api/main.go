package main

import (
	"context"
	"log"
	"os"
	"time"

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

	// CORS Middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Melayani folder "dashboard" HTML lama sebagai dashboard utama
	// Pada go run, working directory di-sesuaikan
	dashboardPath := "../../dashboard"
	if _, err := os.Stat("/dashboard"); err == nil {
		dashboardPath = "/dashboard"
	} else if _, err := os.Stat("dashboard"); err == nil {
		dashboardPath = "./dashboard"
	} else if _, err := os.Stat("../dashboard"); err == nil {
		dashboardPath = "../dashboard"
	}

	router.Static("/Imron23", dashboardPath)
	router.Static("/dashboard", dashboardPath)

	// Melayani root file seperti index.html yang lama (jika ada) atau lp
	rootPath := "../../public-lp/"
	if _, err := os.Stat("/public-lp"); err == nil {
		rootPath = "/public-lp/"
	} else if _, err := os.Stat("public-lp"); err == nil {
		rootPath = "./public-lp/"
	} else if _, err := os.Stat("../public-lp"); err == nil {
		rootPath = "../public-lp/"
	}

	router.StaticFile("/", rootPath+"lp-2-long/index.html")
	router.StaticFile("/logo.png", rootPath+"logo.png")
	
	router.Static("/assets", rootPath+"assets")
	router.Static("/shared", rootPath+"shared")
	router.Static("/jualan-lp", rootPath+"jualan-lp")
	router.Static("/lp-2-long", rootPath+"lp-2-long")
	router.Static("/lp-bakti-anak", rootPath+"lp-bakti-anak")
	router.Static("/lp-itikaf-premium", rootPath+"lp-itikaf-premium")
	router.Static("/liburan-26-lf", rootPath+"liburan-26-lf")
	router.Static("/liburan-26-sf", rootPath+"liburan-26-sf")
	router.Static("/lp-liburan", rootPath+"lp-liburan")
	router.Static("/lp-spiritual-journey", rootPath+"lp-spiritual-journey")

	api := router.Group("/api")
	{
		timeoutContext := time.Duration(2) * time.Second

		// Repositories
		vendorRepo := postgres.NewVendorRepository(dbPool)
		leadRepo := postgres.NewLeadRepository(dbPool)
		formRepo := postgres.NewFormRepository(dbPool)
		adminRepo := postgres.NewAdminRepository(dbPool)
		programRepo := postgres.NewProgramRepository(dbPool)
		settingRepo := postgres.NewSettingRepository(dbPool)
		pageSettingRepo := postgres.NewPageSettingRepository(dbPool)

		// Usecases
		vendorUsecase := usecase.NewVendorUsecase(vendorRepo)
		leadUsecase := usecase.NewLeadUsecase(leadRepo)
		formUsecase := usecase.NewFormUsecase(formRepo, timeoutContext)
		adminUsecase := usecase.NewAdminUsecase(adminRepo)
		programUsecase := usecase.NewProgramUsecase(programRepo)
		trashUsecase := usecase.NewTrashUsecase(dbPool)
		settingUsecase := usecase.NewSettingUsecase(settingRepo)
		pageSettingUsecase := usecase.NewPageSettingUsecase(pageSettingRepo)
		aiUsecase := usecase.NewAIUsecase()

		// Handlers - semua di-wire sekarang
		delivery.NewVendorHandler(api, vendorUsecase)
		delivery.NewLeadHandler(api, leadUsecase)
		delivery.NewFormHandler(api, formUsecase)
		delivery.NewProgramHandler(api, programUsecase)
		delivery.NewTrashHandler(api, trashUsecase)
		delivery.NewTeamHandler(api, adminUsecase)
		delivery.NewSettingHandler(api, settingUsecase)
		delivery.NewPageSettingHandler(api, pageSettingUsecase)
		delivery.NewWilayahHandler(api)
		delivery.NewAIHandler(api, aiUsecase, leadUsecase)
		delivery.NewMetaTrackingHandler(api) // Meta CAPI proxy

		// Gunakan AdminHandler untuk melayani endpoint Auth karena frontend menembak ke /api/auth
		// Dan endpoint ini mencakup login admin dan impersonate yang persis sama dengan request dashboard HTML
		authGroup := api.Group("/auth")
		delivery.NewAdminHandler(authGroup, adminUsecase)
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
