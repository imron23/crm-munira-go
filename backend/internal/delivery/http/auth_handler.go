package http

import (
	"munira_crm_backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	Usecase domain.AuthUsecase
}

func NewAuthHandler(r *gin.RouterGroup, u domain.AuthUsecase) {
	handler := &AuthHandler{Usecase: u}
	r.POST("/login", handler.Login)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format data tidak valid"})
		return
	}

	resp, err := h.Usecase.Login(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}
