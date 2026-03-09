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
	query := `INSERT INTO forms (id, name, is_active, success_message, success_redirect_url, rotator_mode, fields, wa_rotator, created_at, updated_at) 
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	now := time.Now()
	form.CreatedAt = now
	form.UpdatedAt = now

	fieldsJSON := form.Fields
	if len(fieldsJSON) == 0 {
		fieldsJSON = []byte("[]")
	}
	waRotatorJSON := form.WARotator
	if len(waRotatorJSON) == 0 {
		waRotatorJSON = []byte("[]")
	}

	_, err := r.db.Exec(ctx, query, form.ID, form.Name, form.IsActive, form.SuccessMessage, form.SuccessRedirectURL, form.RotatorMode, fieldsJSON, waRotatorJSON, form.CreatedAt, form.UpdatedAt)
	return err
}

func (r *formRepository) Update(ctx context.Context, form *domain.Form) error {
	query := `UPDATE forms SET name=$1, is_active=$2, success_message=$3, success_redirect_url=$4, rotator_mode=$5, fields=$6, wa_rotator=$7, updated_at=$8 WHERE id=$9`

	fieldsJSON := form.Fields
	if len(fieldsJSON) == 0 {
		fieldsJSON = []byte("[]")
	}
	waRotatorJSON := form.WARotator
	if len(waRotatorJSON) == 0 {
		waRotatorJSON = []byte("[]")
	}

	_, err := r.db.Exec(ctx, query, form.Name, form.IsActive, form.SuccessMessage, form.SuccessRedirectURL, form.RotatorMode, fieldsJSON, waRotatorJSON, time.Now(), form.ID)
	return err
}

func (r *formRepository) GetByID(ctx context.Context, id string) (*domain.Form, error) {
	query := `SELECT id, name, is_active, success_message, success_redirect_url, rotator_mode, fields, wa_rotator, created_at, updated_at FROM forms WHERE id = $1`
	row := r.db.QueryRow(ctx, query, id)

	var f domain.Form
	err := row.Scan(&f.ID, &f.Name, &f.IsActive, &f.SuccessMessage, &f.SuccessRedirectURL, &f.RotatorMode, &f.Fields, &f.WARotator, &f.CreatedAt, &f.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &f, nil
}

func (r *formRepository) FetchAll(ctx context.Context) ([]domain.Form, error) {
	query := `SELECT id, name, is_active, success_message, success_redirect_url, rotator_mode, fields, wa_rotator, created_at, updated_at FROM forms ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var forms []domain.Form
	for rows.Next() {
		var f domain.Form
		if err := rows.Scan(&f.ID, &f.Name, &f.IsActive, &f.SuccessMessage, &f.SuccessRedirectURL, &f.RotatorMode, &f.Fields, &f.WARotator, &f.CreatedAt, &f.UpdatedAt); err != nil {
			return nil, err
		}
		forms = append(forms, f)
	}
	return forms, nil
}

func (r *formRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM forms WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}
