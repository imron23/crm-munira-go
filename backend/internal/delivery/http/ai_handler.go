package http

import (
	"context"
	"net/http"

	"munira_crm_backend/internal/domain"

	"github.com/gin-gonic/gin"
)

type AIHandler struct {
	aiUsecase   domain.AIUsecase
	leadUsecase domain.LeadUsecase
}

func NewAIHandler(router *gin.RouterGroup, aiUsecase domain.AIUsecase, leadUsecase domain.LeadUsecase) {
	handler := &AIHandler{aiUsecase: aiUsecase, leadUsecase: leadUsecase}

	aiRouter := router.Group("/ai")
	{
		aiRouter.POST("/concierge/:lead_id", handler.GenerateConcierge)
	}
}

func (h *AIHandler) GenerateConcierge(c *gin.Context) {
	leadID := c.Param("lead_id")

	// Get Lead Data
	lead, err := h.leadUsecase.GetLeadByID(context.Background(), leadID)
	if err != nil || lead == nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Lead tidak ditemukan"})
		return
	}

	// Generate via AI
	res, err := h.aiUsecase.GenerateConciergeMessages(context.Background(), lead)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal generate AI: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}
