package domain

import (
	"context"
	"time"
)

type Setting struct {
	Key       string    `json:"key"`
	Value     string    `json:"value"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type SettingRepository interface {
	GetByKey(ctx context.Context, key string) (*Setting, error)
	Upsert(ctx context.Context, setting *Setting) error
	GetAll(ctx context.Context) ([]Setting, error)
}

type SettingUsecase interface {
	GetSetting(ctx context.Context, key string) (string, error)
	SaveSetting(ctx context.Context, key, value string) error
	GetAllSettings(ctx context.Context) (map[string]string, error)
}
