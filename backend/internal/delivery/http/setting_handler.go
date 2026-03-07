package http

import (
	"context"
	"munira_crm_backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SettingHandler struct {
	usecase domain.SettingUsecase
}

func NewSettingHandler(router *gin.RouterGroup, usecase domain.SettingUsecase) {
	handler := &SettingHandler{usecase: usecase}

	settingRouter := router.Group("/settings")
	{
		settingRouter.GET("", handler.GetAllSettings)
		settingRouter.GET("/:key", handler.GetSettingKey)
		settingRouter.POST("", handler.SaveSetting)
	}
}

func (h *SettingHandler) GetAllSettings(c *gin.Context) {
	data, err := h.usecase.GetAllSettings(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch settings"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"settings": data})
}

func (h *SettingHandler) GetSettingKey(c *gin.Context) {
	key := c.Param("key")
	val, err := h.usecase.GetSetting(context.Background(), key)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Key not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"key": key, "value": val})
}

type SaveSettingReq struct {
	Key   string `json:"key" binding:"required"`
	Value string `json:"value"`
}

func (h *SettingHandler) SaveSetting(c *gin.Context) {
	var req SaveSettingReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	if err := h.usecase.SaveSetting(context.Background(), req.Key, req.Value); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save setting"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Setting saved"})
}
