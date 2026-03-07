package usecase

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"munira_crm_backend/internal/domain"
)

type adminUsecase struct {
	adminRepo domain.AdminUserRepository
}

func NewAdminUsecase(repo domain.AdminUserRepository) domain.AdminUsecase {
	return &adminUsecase{
		adminRepo: repo,
	}
}

func (u *adminUsecase) Login(ctx context.Context, username, password string) (string, *domain.AdminUser, error) {
	user, err := u.adminRepo.GetByUsername(ctx, username)
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	token := generateMockJWT(user)
	return token, user, nil
}

func (u *adminUsecase) Impersonate(ctx context.Context, id string) (string, *domain.AdminUser, error) {
	user, err := u.adminRepo.GetByID(ctx, id)
	if err != nil {
		return "", nil, errors.New("user not found")
	}

	token := generateMockJWT(user)
	return token, user, nil
}

func generateMockJWT(u *domain.AdminUser) string {
	payload := map[string]interface{}{
		"id":        u.ID,
		"username":  u.Username,
		"role":      u.Role,
		"full_name": u.FullName,
	}
	payloadBytes, _ := json.Marshal(payload)
	base64Payload := base64.RawURLEncoding.EncodeToString(payloadBytes)
	return "dummy." + base64Payload + ".signature"
}

func (u *adminUsecase) Register(ctx context.Context, user *domain.AdminUser) error {
	return u.adminRepo.CreateUser(ctx, user)
}

func (u *adminUsecase) FetchAllTeam(ctx context.Context) ([]domain.AdminUser, error) {
	return u.adminRepo.GetUsers(ctx)
}

func (u *adminUsecase) UpdateMember(ctx context.Context, id string, user *domain.AdminUser) error {
	return u.adminRepo.UpdateUser(ctx, id, user)
}

func (u *adminUsecase) DeleteMember(ctx context.Context, id string) error {
	return u.adminRepo.DeleteUser(ctx, id)
}

func (u *adminUsecase) ResetPassword(ctx context.Context, id string, newPassword string) error {
	// hash pass in real life
	// err := u.adminRepo.UpdatePassword(ctx, id, hash)
	return nil
}
