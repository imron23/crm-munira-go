package domain

import "context"

type AuthRepository interface {
	GetByUsername(ctx context.Context, username string) (*AdminUser, error)
}

type AuthUsecase interface {
	Login(ctx context.Context, req LoginRequest) (*AuthResponse, error)
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token string     `json:"token"`
	User  *AdminUser `json:"user"`
}
