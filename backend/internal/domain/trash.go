package domain

import (
	"context"
)

type TrashItem struct {
	ID        string `json:"id"`
	Type      string `json:"type"`  // 'leads', 'programs', 'forms'
	Label     string `json:"label"` // name of lead/program/form
	Meta      string `json:"meta"`  // additional info
	DeletedAt string `json:"deleted_at"`
}

type TrashUsecase interface {
	GetTrash(ctx context.Context) ([]TrashItem, error)
	Restore(ctx context.Context, itemType, id string) error
	HardDelete(ctx context.Context, itemType, id string) error
	EmptyTrash(ctx context.Context) error
}
