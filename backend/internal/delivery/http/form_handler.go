package http

import (
	"munira_crm_backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

// FormHandler  represent the httphandler for form
type FormHandler struct {
	FUsecase domain.FormUsecase
}

// NewFormHandler will initialize the forms/ resources endpoint
func NewFormHandler(e *gin.RouterGroup, us domain.FormUsecase) {
	handler := &FormHandler{
		FUsecase: us,
	}

	formGroup := e.Group("/forms")
	{
		formGroup.GET("", handler.FetchAll)
		formGroup.GET("/:id", handler.GetByID)
		formGroup.POST("", handler.Create)
	}
}

func (h *FormHandler) FetchAll(c *gin.Context) {
	ctx := c.Request.Context()
	forms, err := h.FUsecase.FetchAllForms(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, forms)
}

func (h *FormHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	ctx := c.Request.Context()

	form, err := h.FUsecase.GetFormByID(ctx, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Form not found"})
		return
	}
	c.JSON(http.StatusOK, form)
}

func (h *FormHandler) Create(c *gin.Context) {
	var form domain.Form
	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()
	err := h.FUsecase.CreateForm(ctx, &form)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, form)
}
