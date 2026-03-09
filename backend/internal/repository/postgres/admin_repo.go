package postgres

import (
	"context"
	"munira_crm_backend/internal/domain"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type adminRepo struct {
	db *pgxpool.Pool
}

func NewAdminRepository(db *pgxpool.Pool) domain.AdminUserRepository {
	return &adminRepo{db: db}
}

func (r *adminRepo) GetByUsername(ctx context.Context, username string) (*domain.AdminUser, error) {
	q := `SELECT id, username, password_hash, role, full_name, email, phone, avatar_initial, is_active, last_login, permissions, created_at, updated_at 
		  FROM admin_users WHERE username = $1 LIMIT 1`
	var u domain.AdminUser
	err := r.db.QueryRow(ctx, q, username).Scan(
		&u.ID, &u.Username, &u.PasswordHash, &u.Role, &u.FullName, &u.Email, &u.Phone, &u.AvatarInitial, &u.IsActive, &u.LastLogin, &u.Permissions, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *adminRepo) GetByID(ctx context.Context, id string) (*domain.AdminUser, error) {
	q := `SELECT id, username, password_hash, role, full_name, email, phone, avatar_initial, is_active, last_login, permissions, created_at, updated_at 
		  FROM admin_users WHERE id = $1 LIMIT 1`
	var u domain.AdminUser
	err := r.db.QueryRow(ctx, q, id).Scan(
		&u.ID, &u.Username, &u.PasswordHash, &u.Role, &u.FullName, &u.Email, &u.Phone, &u.AvatarInitial, &u.IsActive, &u.LastLogin, &u.Permissions, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *adminRepo) CreateUser(ctx context.Context, user *domain.AdminUser) error {
	q := `INSERT INTO admin_users (username, password_hash, role, full_name, email, phone, avatar_initial, is_active, permissions)
		  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`
	return r.db.QueryRow(ctx, q, user.Username, user.PasswordHash, user.Role, user.FullName, user.Email, user.Phone, user.AvatarInitial, user.IsActive, user.Permissions).Scan(&user.ID)
}

func (r *adminRepo) GetUsers(ctx context.Context) ([]domain.AdminUser, error) {
	q := `SELECT id, username, role, full_name, email, phone, avatar_initial, is_active, last_login, permissions, created_at, updated_at 
		  FROM admin_users ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []domain.AdminUser
	for rows.Next() {
		var u domain.AdminUser
		if err := rows.Scan(&u.ID, &u.Username, &u.Role, &u.FullName, &u.Email, &u.Phone, &u.AvatarInitial, &u.IsActive, &u.LastLogin, &u.Permissions, &u.CreatedAt, &u.UpdatedAt); err == nil {
			users = append(users, u)
		}
	}
	return users, nil
}

func (r *adminRepo) UpdateUser(ctx context.Context, id string, user *domain.AdminUser) error {
	q := `UPDATE admin_users SET full_name=$1, email=$2, phone=$3, role=$4, is_active=$5, permissions=$6, updated_at=$7 WHERE id=$8`
	_, err := r.db.Exec(ctx, q, user.FullName, user.Email, user.Phone, user.Role, user.IsActive, user.Permissions, time.Now(), id)
	return err
}

func (r *adminRepo) DeleteUser(ctx context.Context, id string) error {
	q := `DELETE FROM admin_users WHERE id=$1`
	_, err := r.db.Exec(ctx, q, id)
	return err
}

func (r *adminRepo) UpdatePassword(ctx context.Context, id string, hashedPassword string) error {
	q := `UPDATE admin_users SET password_hash=$1, updated_at=$2 WHERE id=$3`
	_, err := r.db.Exec(ctx, q, hashedPassword, time.Now(), id)
	return err
}
