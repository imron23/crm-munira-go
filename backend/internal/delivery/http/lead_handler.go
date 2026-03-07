package http

import (
	"context"
	"net/http"
	"strconv"

	"munira_crm_backend/internal/domain"

	"github.com/gin-gonic/gin"
)

type LeadHandler struct {
	usecase domain.LeadUsecase
}

func NewLeadHandler(router *gin.RouterGroup, usecase domain.LeadUsecase) {
	handler := &LeadHandler{usecase: usecase}

	leadRouter := router.Group("/leads")
	{
		leadRouter.GET("", handler.GetLeads)
		leadRouter.GET("/:id", handler.GetLead)
		leadRouter.GET("/stats/overview", handler.GetStatsOverview)
		leadRouter.GET("/:id/history", handler.GetHistory)
		leadRouter.PUT("/:id", handler.UpdateLead)
		leadRouter.POST("/manual", handler.CreateManualLead)
		leadRouter.DELETE("/:id", handler.DeleteLead)
	}
}

func (h *LeadHandler) GetLead(c *gin.Context) {
	id := c.Param("id")
	lead, err := h.usecase.GetLeadByID(context.Background(), id)
	if err != nil || lead == nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Lead tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    lead,
	})
}

func (h *LeadHandler) GetLeads(c *gin.Context) {
	status := c.Query("status")
	search := c.Query("search")
	assignedTo := c.Query("assigned_to")
	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	limit, _ := strconv.Atoi(limitStr)
	if limit <= 0 {
		limit = 50
	}
	offset, _ := strconv.Atoi(offsetStr)
	if offset < 0 {
		offset = 0
	}

	leads, total, err := h.usecase.FetchLeads(context.Background(), status, search, assignedTo, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengambil data leads"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    leads,
		"pagination": map[string]interface{}{
			"total":  total,
			"limit":  limit,
			"offset": offset,
		},
	})
}

func (h *LeadHandler) GetStatsOverview(c *gin.Context) {
	stats, err := h.usecase.GetStatsOverview(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengambil statistik"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}

func (h *LeadHandler) GetHistory(c *gin.Context) {
	id := c.Param("id")
	history, err := h.usecase.FetchLeadHistory(context.Background(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Lead tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    history,
	})
}

func (h *LeadHandler) UpdateLead(c *gin.Context) {
	id := c.Param("id")

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Input tidak valid"})
		return
	}

	// Assuming an auth middleware passes these variables
	// For now, let's use a dummy or skip if missing context since we bypassed auth token passing
	updaterUsername := "admin"
	updaterName := "Admin"

	err := h.usecase.UpdateLead(context.Background(), id, updates, updaterUsername, updaterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Lead berhasil diperbarui"})
}

func (h *LeadHandler) CreateManualLead(c *gin.Context) {
	var body domain.Lead
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Input tidak valid"})
		return
	}

	creatorUsername := "admin"
	creatorName := "Admin"

	err := h.usecase.AddManualLead(context.Background(), &body, creatorUsername, creatorName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Order berhasil ditambahkan", "lead_id": body.ID})
}

func (h *LeadHandler) DeleteLead(c *gin.Context) {
	id := c.Param("id")
	err := h.usecase.DeleteLead(context.Background(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal menghapus lead"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Lead berhasil dihapus"})
}
