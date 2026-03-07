package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"munira_crm_backend/internal/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type leadRepository struct {
	db *pgxpool.Pool
}

func NewLeadRepository(db *pgxpool.Pool) domain.LeadRepository {
	return &leadRepository{db: db}
}

func (r *leadRepository) GetLeads(ctx context.Context, status, search, assignedTo string, limit, offset int) ([]domain.Lead, int, error) {
	queryBuilder := make([]string, 0)
	args := []interface{}{}
	argIdx := 1

	queryBuilder = append(queryBuilder, "is_deleted = false")

	if status != "" && status != "All" {
		queryBuilder = append(queryBuilder, fmt.Sprintf("status_followup = $%d", argIdx))
		args = append(args, status)
		argIdx++
	}

	if assignedTo != "" {
		queryBuilder = append(queryBuilder, fmt.Sprintf("assigned_to = $%d", argIdx))
		args = append(args, assignedTo)
		argIdx++
	}

	if search != "" {
		searchPattern := "%" + search + "%"
		queryBuilder = append(queryBuilder, fmt.Sprintf("(nama_lengkap ILIKE $%d OR whatsapp_num ILIKE $%d OR user_id ILIKE $%d)", argIdx, argIdx, argIdx))
		args = append(args, searchPattern)
		argIdx++
	}

	whereClause := "WHERE " + strings.Join(queryBuilder, " AND ")

	countQuery := "SELECT count(*) FROM leads " + whereClause
	var total int
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := "SELECT id, user_id, nama_lengkap, whatsapp_num, domisili, yang_berangkat, paket_pilihan, kesiapan_paspor, fasilitas_utama, utm_source, utm_medium, utm_campaign, landing_page, form_source, status_followup, catatan, revenue, program_id, last_contact, rencana_umrah, assigned_to, assigned_to_name, status_history, created_at, updated_at FROM leads " + whereClause + fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", argIdx, argIdx+1)
	args = append(args, limit, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var leads []domain.Lead
	for rows.Next() {
		var l domain.Lead
		var historyJSON []byte
		err := rows.Scan(&l.ID, &l.UserID, &l.NamaLengkap, &l.WhatsappNum, &l.Domisili, &l.YangBerangkat, &l.PaketPilihan, &l.KesiapanPaspor, &l.FasilitasUtama, &l.UTMSource, &l.UTMMedium, &l.UTMCampaign, &l.LandingPage, &l.FormSource, &l.StatusFollowUp, &l.Catatan, &l.Revenue, &l.ProgramID, &l.LastContact, &l.RencanaUmrah, &l.AssignedTo, &l.AssignedToName, &historyJSON, &l.CreatedAt, &l.UpdatedAt)
		if err != nil {
			return nil, 0, err
		}
		json.Unmarshal(historyJSON, &l.StatusHistory)
		leads = append(leads, l)
	}

	return leads, total, nil
}

func (r *leadRepository) GetLeadByID(ctx context.Context, id string) (*domain.Lead, error) {
	query := `SELECT id, user_id, nama_lengkap, whatsapp_num, domisili, yang_berangkat, paket_pilihan, kesiapan_paspor, fasilitas_utama, utm_source, utm_medium, utm_campaign, landing_page, form_source, status_followup, catatan, revenue, program_id, last_contact, rencana_umrah, assigned_to, assigned_to_name, status_history, created_at, updated_at FROM leads WHERE id = $1 AND is_deleted = false`
	row := r.db.QueryRow(ctx, query, id)

	var l domain.Lead
	var historyJSON []byte
	err := row.Scan(&l.ID, &l.UserID, &l.NamaLengkap, &l.WhatsappNum, &l.Domisili, &l.YangBerangkat, &l.PaketPilihan, &l.KesiapanPaspor, &l.FasilitasUtama, &l.UTMSource, &l.UTMMedium, &l.UTMCampaign, &l.LandingPage, &l.FormSource, &l.StatusFollowUp, &l.Catatan, &l.Revenue, &l.ProgramID, &l.LastContact, &l.RencanaUmrah, &l.AssignedTo, &l.AssignedToName, &historyJSON, &l.CreatedAt, &l.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil // Indicate not found
		}
		return nil, err
	}
	json.Unmarshal(historyJSON, &l.StatusHistory)
	return &l, nil
}

func (r *leadRepository) CreateLead(ctx context.Context, lead *domain.Lead) error {
	historyJSON, _ := json.Marshal(lead.StatusHistory)
	query := `INSERT INTO leads (id, user_id, nama_lengkap, whatsapp_num, domisili, yang_berangkat, paket_pilihan, kesiapan_paspor, fasilitas_utama, utm_source, utm_medium, utm_campaign, landing_page, form_source, status_followup, catatan, revenue, program_id, last_contact, rencana_umrah, assigned_to, assigned_to_name, status_history, created_at, updated_at) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
ON CONFLICT (id) DO UPDATE SET
	user_id = EXCLUDED.user_id, nama_lengkap = EXCLUDED.nama_lengkap, whatsapp_num = EXCLUDED.whatsapp_num, domisili = EXCLUDED.domisili, 
	yang_berangkat = EXCLUDED.yang_berangkat, paket_pilihan = EXCLUDED.paket_pilihan, kesiapan_paspor = EXCLUDED.kesiapan_paspor, 
	fasilitas_utama = EXCLUDED.fasilitas_utama, utm_source = EXCLUDED.utm_source, utm_medium = EXCLUDED.utm_medium, utm_campaign = EXCLUDED.utm_campaign, 
	landing_page = EXCLUDED.landing_page, form_source = EXCLUDED.form_source, rencana_umrah = EXCLUDED.rencana_umrah
`
	_, err := r.db.Exec(ctx, query, lead.ID, lead.UserID, lead.NamaLengkap, lead.WhatsappNum, lead.Domisili, lead.YangBerangkat, lead.PaketPilihan, lead.KesiapanPaspor, lead.FasilitasUtama, lead.UTMSource, lead.UTMMedium, lead.UTMCampaign, lead.LandingPage, lead.FormSource, lead.StatusFollowUp, lead.Catatan, lead.Revenue, lead.ProgramID, lead.LastContact, lead.RencanaUmrah, lead.AssignedTo, lead.AssignedToName, historyJSON, lead.CreatedAt, lead.UpdatedAt)
	return err
}

func (r *leadRepository) UpdateLead(ctx context.Context, lead *domain.Lead) error {
	historyJSON, _ := json.Marshal(lead.StatusHistory)
	query := `UPDATE leads SET status_followup=$1, catatan=$2, revenue=$3, program_id=$4, last_contact=$5, paket_pilihan=$6, assigned_to=$7, assigned_to_name=$8, status_history=$9, updated_at=CURRENT_TIMESTAMP WHERE id=$10`
	_, err := r.db.Exec(ctx, query, lead.StatusFollowUp, lead.Catatan, lead.Revenue, lead.ProgramID, lead.LastContact, lead.PaketPilihan, lead.AssignedTo, lead.AssignedToName, historyJSON, lead.ID)
	return err
}

func (r *leadRepository) DeleteLead(ctx context.Context, id string) error {
	query := `UPDATE leads SET is_deleted=true, deleted_at=CURRENT_TIMESTAMP WHERE id=$1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *leadRepository) GetStats(ctx context.Context) (*domain.LeadStats, error) {
	var stats domain.LeadStats

	// Total Leads
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM leads WHERE is_deleted = false").Scan(&stats.TotalLeads)
	if err != nil {
		return nil, err
	}

	// Today's Leads
	err = r.db.QueryRow(ctx, "SELECT COUNT(*) FROM leads WHERE is_deleted = false AND DATE(created_at) = CURRENT_DATE").Scan(&stats.TodaysLeads)
	if err != nil {
		return nil, err
	}

	// Total Closing
	var closingCount int
	err = r.db.QueryRow(ctx, "SELECT COUNT(*) FROM leads WHERE is_deleted = false AND status_followup = 'Order Complete'").Scan(&closingCount)
	if err != nil {
		return nil, err
	}
	stats.TotalClosing = closingCount

	if stats.TotalLeads > 0 {
		stats.ConversionRate = fmt.Sprintf("%.1f", float64(stats.TotalClosing)/float64(stats.TotalLeads)*100)
	} else {
		stats.ConversionRate = "0"
	}

	// Chart Data (Last 7 days)
	query := `
		SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS date, COUNT(*) AS count
		FROM leads
		WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' AND is_deleted = false
		GROUP BY date
		ORDER BY date ASC
	`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats.ChartData = []map[string]interface{}{}
	for rows.Next() {
		var d string
		var c int
		if err := rows.Scan(&d, &c); err == nil {
			stats.ChartData = append(stats.ChartData, map[string]interface{}{"date": d, "count": c})
		}
	}

	return &stats, nil
}
