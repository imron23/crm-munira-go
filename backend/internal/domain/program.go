package domain

import (
	"context"
	"time"
)

type Program struct {
	ID             string     `json:"id"`
	NamaProgram    string     `json:"nama_program"`
	PosterURL      string     `json:"poster_url"`
	Deskripsi      string     `json:"deskripsi"`
	LandingURL     string     `json:"landing_url"`
	DepartureDates string     `json:"departure_dates"` // stored as JSON
	SortOrder      int        `json:"sort_order"`
	IsActive       bool       `json:"is_active"`
	Packages       string     `json:"packages"` // stored as JSON
	IsDeleted      bool       `json:"is_deleted"`
	DeletedAt      *time.Time `json:"deleted_at,omitempty"`
	IsRestored     bool       `json:"is_restored"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

type ProgramRepository interface {
	GetPrograms(ctx context.Context, includeDeleted bool) ([]Program, error)
	GetProgramByID(ctx context.Context, id string) (*Program, error)
	CreateProgram(ctx context.Context, p *Program) error
	UpdateProgram(ctx context.Context, id string, p *Program) error
	DeleteProgram(ctx context.Context, id string) error     // soft delete
	RestoreProgram(ctx context.Context, id string) error    // restore
	HardDeleteProgram(ctx context.Context, id string) error // true delete
}

type ProgramUsecase interface {
	FetchPrograms(ctx context.Context) ([]Program, error)
	FetchDeletedPrograms(ctx context.Context) ([]Program, error)
	CreateProgram(ctx context.Context, p *Program) error
	UpdateProgram(ctx context.Context, id string, p *Program) error
	MoveToTrash(ctx context.Context, id string) error
	RestoreFromTrash(ctx context.Context, id string) error
	DeletePermanently(ctx context.Context, id string) error
}
