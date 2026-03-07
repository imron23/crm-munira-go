package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
)

type WilayahHandler struct {
	cache  []map[string]string
	loaded bool
	mu     sync.RWMutex
}

func NewWilayahHandler(router *gin.RouterGroup) {
	handler := &WilayahHandler{
		cache:  make([]map[string]string, 0),
		loaded: false,
	}

	wRouter := router.Group("/wilayah")
	{
		wRouter.GET("/search", handler.Search)
		wRouter.GET("/status", handler.Status)
	}

	// Pseudo-async loading could trigger here
	go handler.loadDataStub()
}

func (h *WilayahHandler) loadDataStub() {
	h.mu.Lock()
	defer h.mu.Unlock()

	b, err := os.ReadFile("wilayah.json")
	if err != nil {
		fmt.Println("[wilayah] Error reading wilayah.json:", err)
		return
	}

	err = json.Unmarshal(b, &h.cache)
	if err != nil {
		fmt.Println("[wilayah] Error parsing wilayah.json:", err)
		return
	}

	h.loaded = true
	fmt.Printf("[wilayah] Loaded cache successfully: %d items\n", len(h.cache))
}

func (h *WilayahHandler) Search(c *gin.Context) {
	q := strings.ToLower(strings.TrimSpace(c.Query("q")))
	if len(q) < 3 {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []interface{}{}, "message": "Min 3 karakter"})
		return
	}

	h.mu.RLock()
	defer h.mu.RUnlock()

	if !h.loaded {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []interface{}{}, "message": "Data sedang dimuat..."})
		return
	}

	var results []map[string]string
	for _, k := range h.cache {
		if strings.Contains(strings.ToLower(k["kecamatan"]), q) || strings.Contains(strings.ToLower(k["kota"]), q) {
			results = append(results, k)
			if len(results) >= 20 {
				break
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": results})
}

func (h *WilayahHandler) Status(c *gin.Context) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	c.JSON(http.StatusOK, gin.H{"loaded": h.loaded, "total": len(h.cache)})
}
