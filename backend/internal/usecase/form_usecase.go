package usecase

import (
	"context"
	"munira_crm_backend/internal/domain"
	"time"
)

type formUsecase struct {
	formRepo       domain.FormRepository
	contextTimeout time.Duration
}

// NewFormUsecase creates a new form usecase
func NewFormUsecase(repo domain.FormRepository, timeout time.Duration) domain.FormUsecase {
	return &formUsecase{
		formRepo:       repo,
		contextTimeout: timeout,
	}
}

func (u *formUsecase) CreateForm(c context.Context, form *domain.Form) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.formRepo.Create(ctx, form)
}

func (u *formUsecase) UpdateForm(c context.Context, form *domain.Form) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.formRepo.Update(ctx, form)
}

func (u *formUsecase) GetFormByID(c context.Context, id string) (*domain.Form, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.formRepo.GetByID(ctx, id)
}

func (u *formUsecase) FetchAllForms(c context.Context) ([]domain.Form, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.formRepo.FetchAll(ctx)
}

func (u *formUsecase) DeleteForm(c context.Context, id string) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.formRepo.Delete(ctx, id)
}
