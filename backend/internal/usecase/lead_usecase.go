package usecase

import (
	"context"
	"errors"
	"time"

	"munira_crm_backend/internal/domain"
)

type leadUsecase struct {
	repo domain.LeadRepository
}

func NewLeadUsecase(repo domain.LeadRepository) domain.LeadUsecase {
	return &leadUsecase{repo: repo}
}

func (u *leadUsecase) FetchLeads(ctx context.Context, status, search, assignedTo string, limit, offset int) ([]domain.Lead, int, error) {
	return u.repo.GetLeads(ctx, status, search, assignedTo, limit, offset)
}

func (u *leadUsecase) GetLeadByID(ctx context.Context, id string) (*domain.Lead, error) {
	return u.repo.GetLeadByID(ctx, id)
}

func (u *leadUsecase) FetchLeadHistory(ctx context.Context, id string) ([]domain.StatusHistory, error) {
	lead, err := u.repo.GetLeadByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if lead == nil {
		return nil, errors.New("Lead tidak ditemukan")
	}
	return lead.StatusHistory, nil
}

func (u *leadUsecase) AddLead(ctx context.Context, lead *domain.Lead) error {
	lead.CreatedAt = time.Now()
	lead.UpdatedAt = time.Now()

	// Add initial history
	lead.StatusHistory = append(lead.StatusHistory, domain.StatusHistory{
		Status:        "New Data",
		ChangedBy:     "system",
		ChangedByName: "Landing Page",
		Catatan:       "Lead masuk dari " + lead.LandingPage,
		ChangedAt:     time.Now(),
	})

	return u.repo.CreateLead(ctx, lead)
}

func (u *leadUsecase) AddManualLead(ctx context.Context, lead *domain.Lead, creatorUsername, creatorName string) error {
	lead.CreatedAt = time.Now()
	lead.UpdatedAt = time.Now()
	lead.AssignedTo = creatorUsername
	lead.AssignedToName = creatorName

	initStatus := lead.StatusFollowUp
	if initStatus == "" {
		initStatus = "New Data"
	}
	lead.StatusFollowUp = initStatus

	// Add initial history
	lead.StatusHistory = append(lead.StatusHistory, domain.StatusHistory{
		Status:        initStatus,
		ChangedBy:     creatorUsername,
		ChangedByName: creatorName,
		Catatan:       "Lead diinput manual oleh admin",
		ChangedAt:     time.Now(),
	})

	return u.repo.CreateLead(ctx, lead)
}

func (u *leadUsecase) UpdateLead(ctx context.Context, id string, updates map[string]interface{}, updaterUsername, updaterName string) error {
	lead, err := u.repo.GetLeadByID(ctx, id)
	if err != nil || lead == nil {
		return errors.New("Lead tidak ditemukan")
	}

	statusChanged := false
	newStatus := ""
	catatan := ""

	if s, ok := updates["status_followup"].(string); ok && s != lead.StatusFollowUp {
		newStatus = s
		lead.StatusFollowUp = s
		statusChanged = true
	}
	if c, ok := updates["catatan"].(string); ok {
		catatan = c
		lead.Catatan = c
	}
	if r, ok := updates["revenue"].(float64); ok { // JSON unmarshals to float64
		lead.Revenue = int64(r)
	}
	if pi, ok := updates["program_id"].(string); ok {
		lead.ProgramID = pi
	}
	if p, ok := updates["paket_pilihan"].(string); ok {
		lead.PaketPilihan = p
	}
	if asgn, ok := updates["assigned_to"].(string); ok {
		lead.AssignedTo = asgn
	}
	if asgnName, ok := updates["assigned_to_name"].(string); ok {
		lead.AssignedToName = asgnName
	}
	if lc, ok := updates["last_contact"].(bool); ok && lc {
		now := time.Now()
		lead.LastContact = &now
	}

	if statusChanged {
		lead.StatusHistory = append(lead.StatusHistory, domain.StatusHistory{
			Status:        newStatus,
			ChangedBy:     updaterUsername,
			ChangedByName: updaterName,
			Catatan:       catatan,
			ChangedAt:     time.Now(),
		})
	}

	return u.repo.UpdateLead(ctx, lead)
}

func (u *leadUsecase) DeleteLead(ctx context.Context, id string) error {
	return u.repo.DeleteLead(ctx, id)
}

func (u *leadUsecase) GetStatsOverview(ctx context.Context) (*domain.LeadStats, error) {
	return u.repo.GetStats(ctx)
}
