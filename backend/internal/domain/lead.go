package domain

import (
	"context"
	"time"
)

type StatusHistory struct {
	Status        string    `json:"status"`
	ChangedBy     string    `json:"changed_by"`
	ChangedByName string    `json:"changed_by_name"`
	Catatan       string    `json:"catatan"`
	ChangedAt     time.Time `json:"changed_at"`
}

type Lead struct {
	ID               string                 `json:"id"`
	UserID           string                 `json:"user_id"`
	NamaLengkap      string                 `json:"nama_lengkap"`
	WhatsappNum      string                 `json:"whatsapp_num"`
	Domisili         string                 `json:"domisili"`
	YangBerangkat    string                 `json:"yang_berangkat"`
	JamaahUsiaDetail interface{}            `json:"jamaah_usia_detail"`
	PaketPilihan     string                 `json:"paket_pilihan"`
	KesiapanPaspor   string                 `json:"kesiapan_paspor"`
	PengalamanUmrah  string                 `json:"pengalaman_umrah"`
	FasilitasUtama   string                 `json:"fasilitas_utama"`
	UTMSource        string                 `json:"utm_source"`
	UTMMedium        string                 `json:"utm_medium"`
	UTMCampaign      string                 `json:"utm_campaign"`
	LandingPage      string                 `json:"landing_page"`
	FormSource       string                 `json:"form_source"`
	StatusFollowUp   string                 `json:"status_followup"`
	Catatan          string                 `json:"catatan"`
	Revenue          int64                  `json:"revenue"`
	ProgramID        string                 `json:"program_id"`
	LastContact      *time.Time             `json:"last_contact"`
	RencanaUmrah     string                 `json:"rencana_umrah"`
	AssignedTo       string                 `json:"assigned_to"`
	AssignedToName   string                 `json:"assigned_to_name"`
	StatusHistory    []StatusHistory        `json:"status_history"`
	IsDeleted        bool                   `json:"is_deleted"`
	DeletedAt        *time.Time             `json:"deleted_at"`
	Preferences      map[string]interface{} `json:"preferences"`
	CreatedAt        time.Time              `json:"created_at"`
	UpdatedAt        time.Time              `json:"updated_at"`
}

type LeadStats struct {
	TotalLeads     int                      `json:"totalLeads"`
	TodaysLeads    int                      `json:"todaysLeads"`
	TotalClosing   int                      `json:"totalClosing"`
	ConversionRate string                   `json:"conversionRate"`
	ChartData      []map[string]interface{} `json:"chartData"`
}

type LeadRepository interface {
	GetLeads(ctx context.Context, status, search, assignedTo string, limit, offset int) ([]Lead, int, error)
	GetLeadByID(ctx context.Context, id string) (*Lead, error)
	CreateLead(ctx context.Context, lead *Lead) error
	UpdateLead(ctx context.Context, lead *Lead) error
	DeleteLead(ctx context.Context, id string) error
	GetStats(ctx context.Context) (*LeadStats, error)
}

type LeadUsecase interface {
	FetchLeads(ctx context.Context, status, search, assignedTo string, limit, offset int) ([]Lead, int, error)
	GetLeadByID(ctx context.Context, id string) (*Lead, error)
	FetchLeadHistory(ctx context.Context, id string) ([]StatusHistory, error)
	AddLead(ctx context.Context, lead *Lead) error
	AddManualLead(ctx context.Context, lead *Lead, creatorUsername, creatorName string) error
	UpdateLead(ctx context.Context, id string, updates map[string]interface{}, updaterUsername, updaterName string) error
	DeleteLead(ctx context.Context, id string) error
	GetStatsOverview(ctx context.Context) (*LeadStats, error)
}
