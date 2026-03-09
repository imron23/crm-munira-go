package domain

import "context"

type ConciergeResponse struct {
	ToneA string      `json:"toneA"`
	ToneB string      `json:"toneB"`
	ToneC string      `json:"toneC"`
	Meta  interface{} `json:"meta"`
}

type AIUsecase interface {
	GenerateConciergeMessages(ctx context.Context, lead *Lead) (*ConciergeResponse, error)
}
