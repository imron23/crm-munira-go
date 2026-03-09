package http

import (
	"context"
	"munira_crm_backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TeamHandler struct {
	usecase domain.AdminUsecase
}

func NewTeamHandler(router *gin.RouterGroup, usecase domain.AdminUsecase) {
	handler := &TeamHandler{usecase: usecase}

	teamRouter := router.Group("/team")
	{
		teamRouter.GET("", handler.GetTeam)
		teamRouter.POST("", handler.CreateMember)
		teamRouter.PUT("/:id", handler.UpdateMember)
		teamRouter.POST("/:id/reset-password", handler.ResetPassword)
		teamRouter.DELETE("/:id", handler.DeleteMember)
	}
}

func (h *TeamHandler) GetTeam(c *gin.Context) {
	users, err := h.usecase.FetchAllTeam(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch team"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": users})
}

func (h *TeamHandler) CreateMember(c *gin.Context) {
	var user domain.AdminUser
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid body"})
		return
	}
	if err := h.usecase.Register(context.Background(), &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create user"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Member created successfully"})
}

func (h *TeamHandler) UpdateMember(c *gin.Context) {
	id := c.Param("id")
	var req domain.AdminUser
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid body"})
		return
	}

	if err := h.usecase.UpdateMember(context.Background(), id, &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Member updated"})
}

func (h *TeamHandler) ResetPassword(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		NewPassword string `json:"new_password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid body"})
		return
	}

	if err := h.usecase.ResetPassword(context.Background(), id, req.NewPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Reset failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Password reset successfully"})
}

func (h *TeamHandler) DeleteMember(c *gin.Context) {
	id := c.Param("id")
	if err := h.usecase.DeleteMember(context.Background(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Deletion failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Member deleted"})
}
