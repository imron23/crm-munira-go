package postgres

import (
	"context"
	"munira_crm_backend/internal/domain"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type settingRepo struct {
	db *pgxpool.Pool
}

func NewSettingRepository(db *pgxpool.Pool) domain.SettingRepository {
	return &settingRepo{db: db}
}

func (r *settingRepo) GetByKey(ctx context.Context, key string) (*domain.Setting, error) {
	q := `SELECT key, value, created_at, updated_at FROM settings WHERE key = $1`
	var s domain.Setting
	err := r.db.QueryRow(ctx, q, key).Scan(&s.Key, &s.Value, &s.CreatedAt, &s.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *settingRepo) Upsert(ctx context.Context, setting *domain.Setting) error {
	q := `INSERT INTO settings (key, value) VALUES ($1, $2)
		  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = $3`
	_, err := r.db.Exec(ctx, q, setting.Key, setting.Value, time.Now())
	return err
}

func (r *settingRepo) GetAll(ctx context.Context) ([]domain.Setting, error) {
	q := `SELECT key, value, created_at, updated_at FROM settings`
	rows, err := r.db.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var settings []domain.Setting
	for rows.Next() {
		var s domain.Setting
		if err := rows.Scan(&s.Key, &s.Value, &s.CreatedAt, &s.UpdatedAt); err == nil {
			settings = append(settings, s)
		}
	}
	return settings, nil
}
