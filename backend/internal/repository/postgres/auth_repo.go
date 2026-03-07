package postgres

import (
	"context"
	"munira_crm_backend/internal/domain"

	"github.com/jackc/pgx/v5/pgxpool"
)

type authRepository struct {
	db *pgxpool.Pool
}

func NewAuthRepository(db *pgxpool.Pool) domain.AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) GetByUsername(ctx context.Context, username string) (*domain.Admin, error) {
	query := `SELECT id, username, password, role, created_at FROM admins WHERE username = $1`
	var admin domain.Admin
	err := r.db.QueryRow(ctx, query, username).Scan(
		&admin.ID, &admin.Username, &admin.Password, &admin.Role, &admin.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &admin, nil
}
