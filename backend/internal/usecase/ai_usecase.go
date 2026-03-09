package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"munira_crm_backend/internal/domain"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

type aiUsecase struct {
	openAIClient   *openai.Client
	bypePlusClient *openai.Client
	geminiClient   *openai.Client
}

func NewAIUsecase() domain.AIUsecase {
	var openAI, bypePlus, gemini *openai.Client

	// 1. OpenAI Setup
	openAIKey := os.Getenv("OPENAI_API_KEY")
	if openAIKey != "" {
		openAI = openai.NewClient(openAIKey)
	}

	// 2. Bype Plus / Doubao Setup (OpenAI Compatible)
	bypePlusKey := os.Getenv("BYPEPLUS_API_KEY")
	bypePlusBaseURL := os.Getenv("BYPEPLUS_BASE_URL")
	if bypePlusKey != "" {
		config := openai.DefaultConfig(bypePlusKey)
		if bypePlusBaseURL != "" {
			config.BaseURL = bypePlusBaseURL
		}
		bypePlus = openai.NewClientWithConfig(config)
	}

	// 3. Gemini Setup (Google AI Studio OpenAI Endpoint)
	geminiKey := os.Getenv("GEMINI_API_KEY")
	if geminiKey != "" {
		config := openai.DefaultConfig(geminiKey)
		// Base URL OpenAI Compatibility untuk Gemini
		config.BaseURL = "https://generativelanguage.googleapis.com/v1beta/openai/"
		gemini = openai.NewClientWithConfig(config)
	}

	return &aiUsecase{
		openAIClient:   openAI,
		bypePlusClient: bypePlus,
		geminiClient:   gemini,
	}
}

func (u *aiUsecase) GenerateConciergeMessages(ctx context.Context, lead *domain.Lead) (*domain.ConciergeResponse, error) {
	prefs := lead.Preferences
	if prefs == nil {
		prefs = make(map[string]interface{})
	}

	histories := make([]string, 0)
	for _, h := range lead.StatusHistory {
		histories = append(histories, fmt.Sprintf("%s (%s)", h.Catatan, h.ChangedAt.Format("02/01/2006")))
	}

	usiaStr := ""
	if lead.JamaahUsiaDetail != nil {
		if usiaMap, ok := lead.JamaahUsiaDetail.([]interface{}); ok && len(usiaMap) > 0 {
			if first, ok2 := usiaMap[0].(map[string]interface{}); ok2 {
				if usia, ok3 := first["usia"]; ok3 {
					usiaStr = fmt.Sprintf("%v", usia)
				}
			}
		}
	}

	payload := map[string]interface{}{
		"lead_info": map[string]interface{}{
			"nama":              lead.NamaLengkap,
			"usia":              usiaStr,
			"domisili":          lead.Domisili,
			"rencana_berangkat": lead.RencanaUmrah,
			"jumlah_peserta":    lead.YangBerangkat,
			"status_paspor":     lead.KesiapanPaspor,
			"harapan_utama":     lead.FasilitasUtama,
		},
		"preferences":   prefs,
		"history_log":   histories,
		"current_stage": lead.StatusFollowUp,
	}

	payloadBytes, _ := json.MarshalIndent(payload, "", "  ")

	systemMsg := `ROLE: Senior Concierge Umrah & Haji (Segment Premium 35-60jt)
Anda adalah pakar pendamping ibadah yang sangat santun, empatik, dan berorientasi pada layanan "Full Service".

TUGAS UTAMA:
Buatkan 3 opsi pesan WhatsApp follow-up (Spiritual, Informatif, Urgensi) berdasarkan data profil dan log history jamaah.

LOGIKA PEMETAAN PREFERENSI (CHECKLIST):
Jika data berikut bernilai 'true', wajib masuk ke dalam narasi pesan:
- pref_small_group: "Alhamdulillah, Bapak/Ibu akan bergabung dalam grup eksklusif kami yang dibatasi maksimal 25 orang saja agar suasana lebih tenang dan bus terasa sangat lega."
- pref_audio_guide: "Demi menjaga kekhusyukan sesuai Sunnah, kami menyediakan Audio Receiver (headset) agar bimbingan doa Ustadz terdengar sangat jernih di telinga Bapak/Ibu."
- pref_handling_bagasi: "Bapak/Ibu cukup fokus beribadah, karena tim handling kami yang akan mengurus seluruh bagasi hingga sampai di depan kamar hotel."
- pref_manasik_privat: "Kami menjamin persiapan ilmu yang matang melalui manasik eksklusif agar Bapak/Ibu benar-benar mantap saat di Tanah Suci."
- pref_dokumentasi: "Momen berharga Bapak/Ibu akan diabadikan secara profesional oleh tim kami, sehingga Bapak/Ibu bisa fokus sepenuhnya pada ibadah."

ATURAN PERSONALISASI:
- Sapaan: < 35th (Mas/Mbak), 35-55th (Bapak/Ibu), > 55th (Bapak/Ibu + Doa Kesehatan).
- Integrasikan 'Harapan Utama' jamaah secara natural dalam kalimat.

KEMBALIKAN DALAM FORMAT JSON SEPERTI INI SAJA (TANPA MARKDOWN):
{
	"toneA": "Isi pesan spiritual",
	"toneB": "Isi pesan solutif/informatif",
	"toneC": "Isi pesan urgensi",
	"meta": { "sapaan": "Bapak Ahmad", "stage": "follow_up" }
}`

	resp, err := u.attemptGenerate(ctx, systemMsg, payloadBytes, lead)
	if err != nil {
		// Mock response if API failed or no API Key is available
		return &domain.ConciergeResponse{
			ToneA: fmt.Sprintf("Assalamu’alaikum Bapak/Ibu %s,\n\nSaya tim Munira World. [MOCK SPIRITUAL]\nMemperhatikan harapan Bapak/Ibu: %s", lead.NamaLengkap, lead.FasilitasUtama),
			ToneB: fmt.Sprintf("Assalamu’alaikum Bapak/Ibu %s,\n\n[MOCK INFORMATIF]\nBerikut detail fasilitas:\n%s", lead.NamaLengkap, string(payloadBytes)),
			ToneC: fmt.Sprintf("Assalamu’alaikum Bapak/Ibu %s,\n\n[MOCK URGENSI]\nKuota terbatas, pastikan segera mendaftar.", lead.NamaLengkap),
			Meta:  map[string]interface{}{"sapaan": lead.NamaLengkap, "stage": lead.StatusFollowUp, "keluarga": lead.YangBerangkat},
		}, nil
	}

	return resp, nil
}

func (u *aiUsecase) attemptGenerate(ctx context.Context, systemMsg string, payloadBytes []byte, lead *domain.Lead) (*domain.ConciergeResponse, error) {
	var errs []error

	// 1. Coba OpenAI Utama
	if u.openAIClient != nil {
		log.Println("[AI Client] Mencoba menggunakan OpenAI (GPT-4o) ...")
		resp, err := u.callLLM(ctx, u.openAIClient, openai.GPT4o, systemMsg, payloadBytes)
		if err == nil {
			return resp, nil
		}
		log.Printf("[AI Client] OpenAI Gagal: %v", err)
		errs = append(errs, fmt.Errorf("OpenAI: %v", err))
	} else {
		log.Println("[AI Client] OpenAI API Key tidak tersedia. Melewati...")
	}

	// 2. Fallback: Bype Plus (Doubao/Ark)
	if u.bypePlusClient != nil {
		log.Println("[AI Client] Mencoba menggunakan Bype Plus (Fallback 1) ...")
		model := os.Getenv("BYPEPLUS_MODEL")
		if model == "" {
			model = "ep-202404..." // Ganti dengan Model Enpoint yang valid di BypePlus jika kosong
		}
		resp, err := u.callLLM(ctx, u.bypePlusClient, model, systemMsg, payloadBytes)
		if err == nil {
			return resp, nil
		}
		log.Printf("[AI Client] Bype Plus Gagal: %v", err)
		errs = append(errs, fmt.Errorf("Bype Plus: %v", err))
	} else {
		log.Println("[AI Client] BYPEPLUS API Key tidak tersedia. Melewati...")
	}

	// 3. Fallback: Gemini
	if u.geminiClient != nil {
		log.Println("[AI Client] Mencoba menggunakan Gemini (Fallback 2) ...")
		resp, err := u.callLLM(ctx, u.geminiClient, "gemini-2.0-flash", systemMsg, payloadBytes) // Menggunakan model terbaru
		if err == nil {
			return resp, nil
		}
		log.Printf("[AI Client] Gemini Gagal: %v", err)
		errs = append(errs, fmt.Errorf("Gemini: %v", err))
	} else {
		log.Println("[AI Client] GEMINI API Key tidak tersedia.")
	}

	if len(errs) > 0 {
		return nil, fmt.Errorf("semua AI engine gagal dikontak: %v", errs)
	}

	return nil, fmt.Errorf("tidak ada AI client yang dikonfigurasi (OPENAI/BYPEPLUS/GEMINI)")
}

func (u *aiUsecase) callLLM(ctx context.Context, client *openai.Client, modelName, systemMsg string, payloadBytes []byte) (*domain.ConciergeResponse, error) {
	req := openai.ChatCompletionRequest{
		Model: modelName,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: systemMsg,
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: string(payloadBytes),
			},
		},
		Temperature: 0.7,
	}

	resp, err := client.CreateChatCompletion(ctx, req)
	if err != nil {
		return nil, err
	}

	// Parsing the Response JSON (removing accidental markdown backticks if returned)
	content := resp.Choices[0].Message.Content

	// Pre-process in case model responds with ```json ... ```
	if len(content) > 7 && content[:7] == "```json" {
		content = content[7 : len(content)-3]
	}

	var res domain.ConciergeResponse
	err = json.Unmarshal([]byte(content), &res)
	if err != nil {
		res.ToneA = content
	}

	return &res, nil
}
