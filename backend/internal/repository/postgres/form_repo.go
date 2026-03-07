package postgres

import (
	"context"
	"munira_crm_backend/internal/domain"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type formRepository struct {
	db *pgxpool.Pool
}

// NewFormRepository Creates a new postgres form repository instance
func NewFormRepository(db *pgxpool.Pool) domain.FormRepository {
	return &formRepository{db: db}
}

func (r *formRepository) Create(ctx context.Context, form *domain.Form) error {
	query := `INSERT INTO forms (id, name, fields, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, $5)`

	now := time.Now()
	form.CreatedAt = now
	form.UpdatedAt = now

	_, err := r.db.Exec(ctx, query, form.ID, form.Name, form.Fields, form.CreatedAt, form.UpdatedAt)
	return err
}

func (r *formRepository) GetByID(ctx context.Context, id string) (*domain.Form, error) {
	query := `SELECT id, name, fields, created_at, updated_at FROM forms WHERE id = $1`
	row := r.db.QueryRow(ctx, query, id)

	var f domain.Form
	err := row.Scan(&f.ID, &f.Name, &f.Fields, &f.CreatedAt, &f.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &f, nil
}

func (r *formRepository) FetchAll(ctx context.Context) ([]domain.Form, error) {
	query := `SELECT id, name, fields, created_at, updated_at FROM forms ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var forms []domain.Form
	for rows.Next() {
		var f domain.Form
		if err := rows.Scan(&f.ID, &f.Name, &f.Fields, &f.CreatedAt, &f.UpdatedAt); err != nil {
			return nil, err
		}
		forms = append(forms, f)
	}
	return forms, nil
}
