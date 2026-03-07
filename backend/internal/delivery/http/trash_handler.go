package http

import (
	"context"
	"munira_crm_backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TrashHandler struct {
	usecase domain.TrashUsecase
}

func NewTrashHandler(router *gin.RouterGroup, usecase domain.TrashUsecase) {
	handler := &TrashHandler{usecase: usecase}

	trashRouter := router.Group("/trash")
	{
		trashRouter.GET("", handler.GetTrash)
		trashRouter.POST("/restore/:type/:id", handler.Restore)
		trashRouter.DELETE("/hard-delete/:type/:id", handler.HardDelete)
		trashRouter.POST("/empty", handler.EmptyTrash)
	}
}

func (h *TrashHandler) GetTrash(c *gin.Context) {
	items, err := h.usecase.GetTrash(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch recycle bin value"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
}

func (h *TrashHandler) Restore(c *gin.Context) {
	t := c.Param("type")
	id := c.Param("id")

	if err := h.usecase.Restore(context.Background(), t, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Restore failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data berhasil dipulihkan"})
}

func (h *TrashHandler) HardDelete(c *gin.Context) {
	t := c.Param("type")
	id := c.Param("id")

	if err := h.usecase.HardDelete(context.Background(), t, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Hard delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data berhasil dihapus permanen"})
}

func (h *TrashHandler) EmptyTrash(c *gin.Context) {
	if err := h.usecase.EmptyTrash(context.Background()); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Trash error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Recycle bin berhasil dikosongkan"})
}
