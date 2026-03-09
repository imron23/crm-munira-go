package http

import (
	"context"
	"crypto/rand"
	"fmt"
	"munira_crm_backend/internal/domain"
	"net/http"

	"github.com/gin-gonic/gin"
)

// FormHandler represent the httphandler for form
type FormHandler struct {
	FUsecase domain.FormUsecase
}

func genFormUUID() string {
	b := make([]byte, 16)
	rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
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
		formGroup.PUT("/:id", handler.Update)
		formGroup.DELETE("/:id", handler.Delete)
	}
}

func (h *FormHandler) FetchAll(c *gin.Context) {
	ctx := c.Request.Context()
	forms, err := h.FUsecase.FetchAllForms(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": forms})
}

func (h *FormHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	ctx := c.Request.Context()

	form, err := h.FUsecase.GetFormByID(ctx, id)
	if err != nil || form == nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Form not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": form})
}

func (h *FormHandler) Create(c *gin.Context) {
	var form domain.Form
	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Input tidak valid: " + err.Error()})
		return
	}

	if form.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Nama form wajib diisi"})
		return
	}

	if form.ID == "" {
		form.ID = genFormUUID()
	}

	ctx := c.Request.Context()
	err := h.FUsecase.CreateForm(ctx, &form)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Form berhasil dibuat", "data": form})
}

func (h *FormHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var form domain.Form
	if err := c.ShouldBindJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Input tidak valid: " + err.Error()})
		return
	}

	if form.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Nama form wajib diisi"})
		return
	}

	form.ID = id

	ctx := context.Background()
	err := h.FUsecase.UpdateForm(ctx, &form)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Form berhasil diperbarui"})
}

func (h *FormHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	ctx := c.Request.Context()

	err := h.FUsecase.DeleteForm(ctx, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Form berhasil dihapus"})
}
