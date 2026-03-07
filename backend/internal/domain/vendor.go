package domain

import (
	"context"
	"time"
)

type Vendor struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	APIURL    string    `json:"api_url"`
	APIKey    string    `json:"api_key,omitempty"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type VendorPackageResponse struct {
	ID          string    `json:"id"`
	VendorID    string    `json:"vendor_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	Departure   time.Time `json:"departure"`
	Quota       int       `json:"quota"`
}

type VendorRepository interface {
	GetActiveVendors(ctx context.Context) ([]Vendor, error)
}

type VendorUsecase interface {
	FetchAllVendorPackages(ctx context.Context) ([]VendorPackageResponse, error)
}
