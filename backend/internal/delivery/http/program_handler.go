package http

import (
	"context"
	"munira_crm_backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProgramHandler struct {
	usecase domain.ProgramUsecase
}

func NewProgramHandler(router *gin.RouterGroup, usecase domain.ProgramUsecase) {
	handler := &ProgramHandler{usecase: usecase}

	progRouter := router.Group("/programs")
	{
		progRouter.GET("", handler.GetPrograms)
		progRouter.POST("", handler.CreateProgram)
		progRouter.PUT("/:id", handler.UpdateProgram)
		progRouter.DELETE("/:id", handler.DeleteProgram) // soft delete
	}
}

func (h *ProgramHandler) GetPrograms(c *gin.Context) {
	progs, err := h.usecase.FetchPrograms(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"programs": progs})
}

func (h *ProgramHandler) CreateProgram(c *gin.Context) {
	var p domain.Program
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.usecase.CreateProgram(context.Background(), &p); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Program created", "program": p})
}

func (h *ProgramHandler) UpdateProgram(c *gin.Context) {
	id := c.Param("id")
	var p domain.Program
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.usecase.UpdateProgram(context.Background(), id, &p); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Program updated"})
}

func (h *ProgramHandler) DeleteProgram(c *gin.Context) {
	id := c.Param("id")
	if err := h.usecase.MoveToTrash(context.Background(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Program deleted"})
}
