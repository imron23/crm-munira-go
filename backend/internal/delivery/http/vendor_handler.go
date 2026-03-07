package http

import (
	"net/http"

	"munira_crm_backend/internal/domain"

	"github.com/gin-gonic/gin"
)

type VendorHandler struct {
	vendorUsecase domain.VendorUsecase
}

func NewVendorHandler(router *gin.RouterGroup, vu domain.VendorUsecase) {
	handler := &VendorHandler{vendorUsecase: vu}

	vendorGroup := router.Group("/vendors")
	{
		vendorGroup.GET("/packages", handler.FetchAllPackages)
	}
}

func (h *VendorHandler) FetchAllPackages(c *gin.Context) {
	packages, err := h.vendorUsecase.FetchAllVendorPackages(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": packages})
}
