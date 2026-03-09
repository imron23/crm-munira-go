package domain

import (
	"context"
	"encoding/json"
	"time"
)

// Form represents the structure of a dynamic form used for landing pages
// Sesuai payload Form Builder FE: name, is_active, success_message, success_redirect_url, rotator_mode, fields, wa_rotator
type Form struct {
	ID                 string          `json:"id"`
	Name               string          `json:"name"`
	IsActive           bool            `json:"is_active"`
	SuccessMessage     string          `json:"success_message"`
	SuccessRedirectURL string          `json:"success_redirect_url"`
	RotatorMode        string          `json:"rotator_mode"`
	Fields             json.RawMessage `json:"fields"` // Array of field config, stored as JSONB in Postgres
	WARotator          json.RawMessage `json:"wa_rotator"`
	CreatedAt          time.Time       `json:"created_at"`
	UpdatedAt          time.Time       `json:"updated_at"`
}

// FormRepository Defines the contract for database access
type FormRepository interface {
	Create(ctx context.Context, form *Form) error
	Update(ctx context.Context, form *Form) error
	GetByID(ctx context.Context, id string) (*Form, error)
	FetchAll(ctx context.Context) ([]Form, error)
	Delete(ctx context.Context, id string) error
}

// FormUsecase Defines the contract for business logic
type FormUsecase interface {
	CreateForm(ctx context.Context, form *Form) error
	UpdateForm(ctx context.Context, form *Form) error
	GetFormByID(ctx context.Context, id string) (*Form, error)
	FetchAllForms(ctx context.Context) ([]Form, error)
	DeleteForm(ctx context.Context, id string) error
}
