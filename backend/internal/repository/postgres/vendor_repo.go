package postgres

import (
	"context"

	"munira_crm_backend/internal/domain"

	"github.com/jackc/pgx/v5/pgxpool"
)

type vendorRepository struct {
	db *pgxpool.Pool
}

func NewVendorRepository(db *pgxpool.Pool) domain.VendorRepository {
	return &vendorRepository{db: db}
}

func (r *vendorRepository) GetActiveVendors(ctx context.Context) ([]domain.Vendor, error) {
	query := `SELECT id, name, api_url, api_key, status, created_at, updated_at FROM vendors WHERE status = 'ACTIVE'`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var vendors []domain.Vendor
	for rows.Next() {
		var v domain.Vendor
		if err := rows.Scan(&v.ID, &v.Name, &v.APIURL, &v.APIKey, &v.Status, &v.CreatedAt, &v.UpdatedAt); err != nil {
			return nil, err
		}
		vendors = append(vendors, v)
	}

	return vendors, nil
}
