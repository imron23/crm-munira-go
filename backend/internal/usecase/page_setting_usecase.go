package usecase

import (
	"context"
	"munira_crm_backend/internal/domain"
)

type pageSettingUsecase struct {
	repo domain.PageSettingRepository
}

func NewPageSettingUsecase(repo domain.PageSettingRepository) domain.PageSettingUsecase {
	return &pageSettingUsecase{repo: repo}
}

func (u *pageSettingUsecase) FetchAll(ctx context.Context) ([]domain.PageSetting, error) {
	return u.repo.GetAll(ctx)
}

func (u *pageSettingUsecase) GetConfig(ctx context.Context, folder string) (*domain.PageSetting, error) {
	return u.repo.GetByFolder(ctx, folder)
}

func (u *pageSettingUsecase) SaveConfig(ctx context.Context, p *domain.PageSetting) error {
	existing, err := u.repo.GetByFolder(ctx, p.Folder)
	if err == nil && existing != nil {
		// update
		return u.repo.Update(ctx, existing.ID, p)
	}
	// create
	return u.repo.Create(ctx, p)
}
