package domain

import (
	"context"
	"time"
)

type PageSetting struct {
	ID               string    `json:"id"`
	Folder           string    `json:"folder"`
	ImageURL         string    `json:"image_url"`
	Description      string    `json:"description"`
	LinkedFormID     *string   `json:"linked_form_id,omitempty"`
	LinkedProgramIDs string    `json:"linked_program_ids"` // JSON array
	IsDefault        bool      `json:"is_default"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type PageSettingRepository interface {
	GetAll(ctx context.Context) ([]PageSetting, error)
	GetByFolder(ctx context.Context, folder string) (*PageSetting, error)
	Create(ctx context.Context, p *PageSetting) error
	Update(ctx context.Context, id string, p *PageSetting) error
	Delete(ctx context.Context, id string) error
}

type PageSettingUsecase interface {
	FetchAll(ctx context.Context) ([]PageSetting, error)
	GetConfig(ctx context.Context, folder string) (*PageSetting, error)
	SaveConfig(ctx context.Context, p *PageSetting) error
}
