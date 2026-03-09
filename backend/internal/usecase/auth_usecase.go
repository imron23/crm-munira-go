package usecase

import (
	"context"
	"errors"
	"munira_crm_backend/internal/domain"
)

type authUsecase struct {
	repo domain.AuthRepository
}

func NewAuthUsecase(repo domain.AuthRepository) domain.AuthUsecase {
	return &authUsecase{repo: repo}
}

func (u *authUsecase) Login(ctx context.Context, req domain.LoginRequest) (*domain.AuthResponse, error) {
	user, err := u.repo.GetByUsername(ctx, req.Username)
	if err != nil {
		return nil, errors.New("username tidak ditemukan")
	}

	// Simple password check for now
	if user.PasswordHash != req.Password {
		return nil, errors.New("password salah")
	}

	return &domain.AuthResponse{
		Token: "munira_secret_token_123",
		User:  user,
	}, nil
}
