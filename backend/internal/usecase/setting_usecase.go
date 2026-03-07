package usecase

import (
	"context"
	"munira_crm_backend/internal/domain"
)

type settingUsecase struct {
	repo domain.SettingRepository
}

func NewSettingUsecase(repo domain.SettingRepository) domain.SettingUsecase {
	return &settingUsecase{repo: repo}
}

func (u *settingUsecase) GetSetting(ctx context.Context, key string) (string, error) {
	s, err := u.repo.GetByKey(ctx, key)
	if err != nil {
		return "", err
	}
	return s.Value, nil
}

func (u *settingUsecase) SaveSetting(ctx context.Context, key, value string) error {
	s := &domain.Setting{Key: key, Value: value}
	return u.repo.Upsert(ctx, s)
}

func (u *settingUsecase) GetAllSettings(ctx context.Context) (map[string]string, error) {
	settings, err := u.repo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	result := make(map[string]string)
	for _, s := range settings {
		result[s.Key] = s.Value
	}
	return result, nil
}
