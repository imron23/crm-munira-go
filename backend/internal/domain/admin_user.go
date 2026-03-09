package domain

import (
	"context"
	"time"
)

type AdminUser struct {
	ID            string     `json:"id"`
	Username      string     `json:"username"`
	PasswordHash  string     `json:"-"` // never leak password
	Role          string     `json:"role"`
	FullName      string     `json:"full_name"`
	Email         string     `json:"email"`
	Phone         string     `json:"phone"`
	AvatarInitial string     `json:"avatar_initial"`
	IsActive      bool       `json:"is_active"`
	LastLogin     *time.Time `json:"last_login,omitempty"`
	Permissions   string     `json:"permissions"` // stored as JSONB string
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

type AdminUserRepository interface {
	GetByUsername(ctx context.Context, username string) (*AdminUser, error)
	GetByID(ctx context.Context, id string) (*AdminUser, error)
	CreateUser(ctx context.Context, user *AdminUser) error
	GetUsers(ctx context.Context) ([]AdminUser, error)
	UpdateUser(ctx context.Context, id string, user *AdminUser) error
	DeleteUser(ctx context.Context, id string) error
}

type AdminUsecase interface {
	Login(ctx context.Context, username, password string) (string, *AdminUser, error)
	Impersonate(ctx context.Context, id string) (string, *AdminUser, error)
	Register(ctx context.Context, user *AdminUser) error
	FetchAllTeam(ctx context.Context) ([]AdminUser, error)
	UpdateMember(ctx context.Context, id string, user *AdminUser) error
	DeleteMember(ctx context.Context, id string) error
	ResetPassword(ctx context.Context, id string, newPassword string) error
}
