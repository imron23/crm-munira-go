package domain

import (
	"context"
	"time"
)

type Admin struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  Admin  `json:"user"`
}

type AuthRepository interface {
	GetByUsername(ctx context.Context, username string) (*Admin, error)
}

type AuthUsecase interface {
	Login(ctx context.Context, req LoginRequest) (*AuthResponse, error)
}
