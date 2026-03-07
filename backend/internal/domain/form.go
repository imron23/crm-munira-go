package domain

import (
	"context"
	"time"
)

// Form represents the structure of a dynamic form used for landing pages
type Form struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Fields    string    `json:"fields"` // Stored as JSON string in Go, JSONB in Postgres
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// FormRepository Defines the contract for database access
type FormRepository interface {
	Create(ctx context.Context, form *Form) error
	GetByID(ctx context.Context, id string) (*Form, error)
	FetchAll(ctx context.Context) ([]Form, error)
}

// FormUsecase Defines the contract for business logic
type FormUsecase interface {
	CreateForm(ctx context.Context, form *Form) error
	GetFormByID(ctx context.Context, id string) (*Form, error)
	FetchAllForms(ctx context.Context) ([]Form, error)
}
