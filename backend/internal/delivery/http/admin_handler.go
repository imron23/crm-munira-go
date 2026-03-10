package http

import (
	"context"
	"munira_crm_backend/internal/domain"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	usecase domain.AdminUsecase
}

func NewAdminHandler(router *gin.RouterGroup, usecase domain.AdminUsecase) {
	handler := &AdminHandler{usecase: usecase}

	router.POST("/login", handler.Login)
	router.POST("/impersonate/:id", handler.Impersonate)
	router.GET("/debug-env", handler.DebugEnv) // Debug endpoint
}

// DebugEnv - endpoint untuk melihat ENV variables (HAPUS DI PRODUCTION!)
func (h *AdminHandler) DebugEnv(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"ADMIN_USERNAME": os.Getenv("ADMIN_USERNAME"),
		"ADMIN_PASSWORD": os.Getenv("ADMIN_PASSWORD"),
		"JWT_SECRET":     os.Getenv("JWT_SECRET"),
		"POSTGRES_URI":   os.Getenv("POSTGRES_URI"),
		"note":           "This is for debugging only",
	})
}

func (h *AdminHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Format data tidak valid"})
		return
	}

	token, user, err := h.usecase.Login(context.Background(), req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Username atau password salah"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   token,
		"user":    user,
	})
}

func (h *AdminHandler) Impersonate(c *gin.Context) {
	id := c.Param("id")
	token, user, err := h.usecase.Impersonate(context.Background(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "User tidak ditemukan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"token":   token,
		"user":    user,
	})
}
