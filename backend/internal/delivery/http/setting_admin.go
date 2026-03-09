package http

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *SettingHandler) GetAdminSettings(c *gin.Context) {
	data, err := h.usecase.GetAllSettings(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to fetch settings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": data})
}

func (h *SettingHandler) UpdateAdminSettings(c *gin.Context) {
	var payload map[string]string
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid body"})
		return
	}

	// Save each key-value
	for k, v := range payload {
		h.usecase.SaveSetting(context.Background(), k, v)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Saved successfully"})
}
