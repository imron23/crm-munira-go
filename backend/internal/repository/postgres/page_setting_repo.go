package postgres

import (
	"context"
	"munira_crm_backend/internal/domain"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type pageSettingRepo struct {
	db *pgxpool.Pool
}

func NewPageSettingRepository(db *pgxpool.Pool) domain.PageSettingRepository {
	return &pageSettingRepo{db: db}
}

func (r *pageSettingRepo) GetAll(ctx context.Context) ([]domain.PageSetting, error) {
	q := `SELECT id, folder, image_url, description, linked_form_id, linked_program_ids, is_default, created_at, updated_at FROM page_settings`
	rows, err := r.db.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []domain.PageSetting
	for rows.Next() {
		var i domain.PageSetting
		if err := rows.Scan(&i.ID, &i.Folder, &i.ImageURL, &i.Description, &i.LinkedFormID, &i.LinkedProgramIDs, &i.IsDefault, &i.CreatedAt, &i.UpdatedAt); err == nil {
			items = append(items, i)
		}
	}
	return items, nil
}

func (r *pageSettingRepo) GetByFolder(ctx context.Context, folder string) (*domain.PageSetting, error) {
	q := `SELECT id, folder, image_url, description, linked_form_id, linked_program_ids, is_default, created_at, updated_at FROM page_settings WHERE folder = $1 LIMIT 1`
	var i domain.PageSetting
	err := r.db.QueryRow(ctx, q, folder).Scan(&i.ID, &i.Folder, &i.ImageURL, &i.Description, &i.LinkedFormID, &i.LinkedProgramIDs, &i.IsDefault, &i.CreatedAt, &i.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &i, nil
}

func (r *pageSettingRepo) Create(ctx context.Context, p *domain.PageSetting) error {
	q := `INSERT INTO page_settings (folder, image_url, description, linked_form_id, linked_program_ids, is_default)
		  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	return r.db.QueryRow(ctx, q, p.Folder, p.ImageURL, p.Description, p.LinkedFormID, p.LinkedProgramIDs, p.IsDefault).Scan(&p.ID)
}

func (r *pageSettingRepo) Update(ctx context.Context, id string, p *domain.PageSetting) error {
	q := `UPDATE page_settings SET image_url=$1, description=$2, linked_form_id=$3, linked_program_ids=$4, is_default=$5, updated_at=$6 WHERE id=$7`
	_, err := r.db.Exec(ctx, q, p.ImageURL, p.Description, p.LinkedFormID, p.LinkedProgramIDs, p.IsDefault, time.Now(), id)
	return err
}

func (r *pageSettingRepo) Delete(ctx context.Context, id string) error {
	q := `DELETE FROM page_settings WHERE id=$1`
	_, err := r.db.Exec(ctx, q, id)
	return err
}
