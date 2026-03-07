package postgres

import (
	"context"
	"munira_crm_backend/internal/domain"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type programRepo struct {
	db *pgxpool.Pool
}

func NewProgramRepository(db *pgxpool.Pool) domain.ProgramRepository {
	return &programRepo{db: db}
}

func (r *programRepo) GetPrograms(ctx context.Context, includeDeleted bool) ([]domain.Program, error) {
	q := `SELECT id, nama_program, poster_url, deskripsi, landing_url, departure_dates, sort_order, is_active, packages, is_deleted, deleted_at, is_restored, created_at, updated_at 
		  FROM programs WHERE is_deleted = $1 ORDER BY sort_order ASC, created_at DESC`
	rows, err := r.db.Query(ctx, q, includeDeleted)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var programs []domain.Program
	for rows.Next() {
		var p domain.Program
		if err := rows.Scan(&p.ID, &p.NamaProgram, &p.PosterURL, &p.Deskripsi, &p.LandingURL, &p.DepartureDates, &p.SortOrder, &p.IsActive, &p.Packages, &p.IsDeleted, &p.DeletedAt, &p.IsRestored, &p.CreatedAt, &p.UpdatedAt); err == nil {
			programs = append(programs, p)
		}
	}
	return programs, nil
}

func (r *programRepo) GetProgramByID(ctx context.Context, id string) (*domain.Program, error) {
	q := `SELECT id, nama_program, poster_url, deskripsi, landing_url, departure_dates, sort_order, is_active, packages, is_deleted, deleted_at, is_restored, created_at, updated_at 
		  FROM programs WHERE id = $1`
	var p domain.Program
	err := r.db.QueryRow(ctx, q, id).Scan(&p.ID, &p.NamaProgram, &p.PosterURL, &p.Deskripsi, &p.LandingURL, &p.DepartureDates, &p.SortOrder, &p.IsActive, &p.Packages, &p.IsDeleted, &p.DeletedAt, &p.IsRestored, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *programRepo) CreateProgram(ctx context.Context, p *domain.Program) error {
	q := `INSERT INTO programs (nama_program, poster_url, deskripsi, landing_url, departure_dates, sort_order, is_active, packages)
		  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	return r.db.QueryRow(ctx, q, p.NamaProgram, p.PosterURL, p.Deskripsi, p.LandingURL, p.DepartureDates, p.SortOrder, p.IsActive, p.Packages).Scan(&p.ID)
}

func (r *programRepo) UpdateProgram(ctx context.Context, id string, p *domain.Program) error {
	q := `UPDATE programs SET nama_program=$1, poster_url=$2, deskripsi=$3, landing_url=$4, departure_dates=$5, sort_order=$6, is_active=$7, packages=$8, updated_at=$9 WHERE id=$10`
	_, err := r.db.Exec(ctx, q, p.NamaProgram, p.PosterURL, p.Deskripsi, p.LandingURL, p.DepartureDates, p.SortOrder, p.IsActive, p.Packages, time.Now(), id)
	return err
}

func (r *programRepo) DeleteProgram(ctx context.Context, id string) error {
	q := `UPDATE programs SET is_deleted=true, deleted_at=$1 WHERE id=$2`
	_, err := r.db.Exec(ctx, q, time.Now(), id)
	return err
}

func (r *programRepo) RestoreProgram(ctx context.Context, id string) error {
	q := `UPDATE programs SET is_deleted=false, is_restored=true, deleted_at=NULL WHERE id=$1`
	_, err := r.db.Exec(ctx, q, id)
	return err
}

func (r *programRepo) HardDeleteProgram(ctx context.Context, id string) error {
	q := `DELETE FROM programs WHERE id=$1`
	_, err := r.db.Exec(ctx, q, id)
	return err
}
