package usecase

import (
	"context"
	"munira_crm_backend/internal/domain"
)

type programUsecase struct {
	repo domain.ProgramRepository
}

func NewProgramUsecase(repo domain.ProgramRepository) domain.ProgramUsecase {
	return &programUsecase{repo: repo}
}

func (u *programUsecase) FetchPrograms(ctx context.Context) ([]domain.Program, error) {
	return u.repo.GetPrograms(ctx, false) // un-deleted
}

func (u *programUsecase) FetchDeletedPrograms(ctx context.Context) ([]domain.Program, error) {
	return u.repo.GetPrograms(ctx, true) // deleted
}

func (u *programUsecase) CreateProgram(ctx context.Context, p *domain.Program) error {
	return u.repo.CreateProgram(ctx, p)
}

func (u *programUsecase) UpdateProgram(ctx context.Context, id string, p *domain.Program) error {
	return u.repo.UpdateProgram(ctx, id, p)
}

func (u *programUsecase) MoveToTrash(ctx context.Context, id string) error {
	return u.repo.DeleteProgram(ctx, id)
}

func (u *programUsecase) RestoreFromTrash(ctx context.Context, id string) error {
	return u.repo.RestoreProgram(ctx, id)
}

func (u *programUsecase) DeletePermanently(ctx context.Context, id string) error {
	return u.repo.HardDeleteProgram(ctx, id)
}
