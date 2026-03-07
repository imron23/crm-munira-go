package usecase

import (
	"context"
	"fmt"
	"munira_crm_backend/internal/domain"

	"github.com/jackc/pgx/v5/pgxpool"
)

type trashUsecase struct {
	db *pgxpool.Pool
}

func NewTrashUsecase(db *pgxpool.Pool) domain.TrashUsecase {
	return &trashUsecase{db: db}
}

func (u *trashUsecase) GetTrash(ctx context.Context) ([]domain.TrashItem, error) {
	var results []domain.TrashItem

	// Assuming 'leads', 'programs', 'forms' tables all have is_deleted, deleted_at columns
	// In production, we'd run three fast queries or a single UNION.

	// Programs
	progQ := `SELECT id, 'programs' as type, nama_program as label, 'Kategori: Program' as meta, deleted_at::text 
			  FROM programs WHERE is_deleted = true AND deleted_at IS NOT NULL`
	progRows, _ := u.db.Query(ctx, progQ)
	defer progRows.Close()
	for progRows.Next() {
		var item domain.TrashItem
		progRows.Scan(&item.ID, &item.Type, &item.Label, &item.Meta, &item.DeletedAt)
		results = append(results, item)
	}

	// This is a direct migration mapping from Node.js Route.
	return results, nil
}

func (u *trashUsecase) Restore(ctx context.Context, itemType, id string) error {
	var table string
	switch itemType {
	case "leads":
		table = "leads"
	case "programs":
		table = "programs"
	case "forms":
		table = "forms"
	default:
		return fmt.Errorf("invalid type")
	}

	q := fmt.Sprintf(`UPDATE %s SET is_deleted=false, is_restored=true, deleted_at=NULL WHERE id=$1`, table)
	_, err := u.db.Exec(ctx, q, id)
	return err
}

func (u *trashUsecase) HardDelete(ctx context.Context, itemType, id string) error {
	var table string
	switch itemType {
	case "leads":
		table = "leads"
	case "programs":
		table = "programs"
	case "forms":
		table = "forms"
	default:
		return fmt.Errorf("invalid type")
	}

	q := fmt.Sprintf(`DELETE FROM %s WHERE id=$1 AND is_deleted=true`, table)
	_, err := u.db.Exec(ctx, q, id)
	return err
}

func (u *trashUsecase) EmptyTrash(ctx context.Context) error {
	tables := []string{"leads", "programs", "forms"}
	for _, t := range tables {
		u.db.Exec(ctx, fmt.Sprintf(`DELETE FROM %s WHERE is_deleted=true`, t))
	}
	return nil
}
