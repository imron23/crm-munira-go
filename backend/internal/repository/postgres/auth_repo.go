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

func (r *authRepository) GetByUsername(ctx context.Context, username string) (*domain.AdminUser, error) {
	var user domain.AdminUser
	// Using 'admins' table which has actual data
	query := `SELECT id, username, password, role, created_at FROM admins WHERE username = $1`
	err := r.db.QueryRow(ctx, query, username).Scan(&user.ID, &user.Username, &user.PasswordHash, &user.Role, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
