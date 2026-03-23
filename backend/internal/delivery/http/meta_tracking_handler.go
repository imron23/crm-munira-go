package http

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// MetaTrackingHandler handles Meta Conversions API (CAPI) proxy
type MetaTrackingHandler struct{}

func NewMetaTrackingHandler(router *gin.RouterGroup) {
	h := &MetaTrackingHandler{}
	track := router.Group("/track")
	{
		track.POST("/meta", h.SendMetaEvent)
	}
}

// SendMetaEvent proxies lead events to Meta CAPI
// POST /api/track/meta
func (h *MetaTrackingHandler) SendMetaEvent(c *gin.Context) {
	pixelID := os.Getenv("META_PIXEL_ID")
	accessToken := os.Getenv("META_ACCESS_TOKEN")

	if pixelID == "" || accessToken == "" {
		// Gracefully skip if not configured — log and return OK so form submit is never blocked
		log.Println("[MetaCAPI] Not configured (META_PIXEL_ID or META_ACCESS_TOKEN missing). Skipping.")
		c.JSON(http.StatusOK, gin.H{"success": true, "skipped": true, "reason": "CAPI not configured"})
		return
	}

	var body map[string]interface{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid payload"})
		return
	}

	// Wrap in Meta CAPI event format
	metaPayload := map[string]interface{}{
		"data": []map[string]interface{}{body},
	}

	payloadBytes, _ := json.Marshal(metaPayload)
	url := "https://graph.facebook.com/v19.0/" + pixelID + "/events?access_token=" + accessToken

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		log.Printf("[MetaCAPI] Request build error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false})
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[MetaCAPI] Request error: %v", err)
		c.JSON(http.StatusOK, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	log.Printf("[MetaCAPI] Response %d: %s", resp.StatusCode, string(respBody))

	c.JSON(http.StatusOK, gin.H{"success": true, "meta_response": string(respBody)})
}
