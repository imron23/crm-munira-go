package http

import (
	"context"
	"munira_crm_backend/internal/domain"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
)

type PageSettingHandler struct {
	usecase domain.PageSettingUsecase
}

func NewPageSettingHandler(router *gin.RouterGroup, usecase domain.PageSettingUsecase) {
	handler := &PageSettingHandler{usecase: usecase}

	pageRouter := router.Group("/pages")
	{
		// Match the exact route signatures from NodeJS
		pageRouter.GET("", handler.GetAll)                   // /api/pages
		pageRouter.GET("/packages", handler.GetPackages)     // /api/pages/packages
		pageRouter.GET("/cover", handler.GetCover)           // /api/pages/cover
		pageRouter.GET("/default", handler.GetDefault)       // /api/pages/default
		pageRouter.GET("/:folder/config", handler.GetConfig) // /api/pages/:folder/config
		pageRouter.POST("", handler.DummyPost)               // /api/pages POST
		pageRouter.PUT("/:folder", handler.SaveConfig)       // act as upsert / update
	}
}

// Extract Page Meta parsing HTML directly
func extractPageMeta(htmlPath string) (title, image string) {
	content, err := os.ReadFile(htmlPath)
	if err != nil {
		return "", ""
	}
	htmlStr := string(content)

	tRe := regexp.MustCompile(`(?i)<title[^>]*>(.*?)</title>`)
	if match := tRe.FindStringSubmatch(htmlStr); len(match) > 1 {
		title = strings.TrimSpace(match[1])
	}

	ogRe := regexp.MustCompile(`(?i)property=["']og:image["']\s+content=["']([^"']+)["']`)
	if match := ogRe.FindStringSubmatch(htmlStr); len(match) > 1 {
		image = match[1]
	} else {
		imgRe := regexp.MustCompile(`(?i)<img[^>]+src=["']([^"']+)["']`)
		if match := imgRe.FindStringSubmatch(htmlStr); len(match) > 1 {
			image = match[1]
		}
	}
	return title, image
}

func (h *PageSettingHandler) GetAll(c *gin.Context) {
	items, err := h.usecase.FetchAll(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	settingMap := make(map[string]domain.PageSetting)
	for _, item := range items {
		settingMap[item.Folder] = item
	}

	// Resolve LP root directory
	rootDir := os.Getenv("LP_ROOT_DIR")
	if rootDir == "" {
		// Try common paths for Docker and local
		candidates := []string{"/public-lp", "../../public-lp", "../public-lp", "./public-lp"}
		for _, p := range candidates {
			if _, err := os.Stat(p); err == nil {
				rootDir = p
				break
			}
		}
		if rootDir == "" {
			rootDir = "../../public-lp"
		}
	}

	// Folders to skip (not landing pages)
	skipFolders := map[string]bool{"assets": true, "shared": true, "jualan-lp": true}

	pages := make([]map[string]interface{}, 0)

	// Root index.html
	rootIndex := filepath.Join(rootDir, "index.html")
	if _, err := os.Stat(rootIndex); err == nil {
		title, img := extractPageMeta(rootIndex)
		if title == "" {
			title = "Home — Semua Paket"
		}
		dbEntry := settingMap["root"]
		if dbEntry.ImageURL != "" {
			img = dbEntry.ImageURL
		}
		formId := ""
		if dbEntry.LinkedFormID != nil {
			formId = *dbEntry.LinkedFormID
		}
		pages = append(pages, map[string]interface{}{
			"title":              title,
			"alias":              "Homepage (Semua Paket)",
			"url":                "/",
			"status":             "Live",
			"path":               "index.html",
			"image":              img,
			"description":        dbEntry.Description,
			"folder":             "root",
			"linked_form_id":     formId,
			"linked_program_ids": []string{},
			"is_default":         dbEntry.IsDefault,
		})
	}

	// Scan all subfolders
	entries, err := os.ReadDir(rootDir)
	if err == nil {
		for _, e := range entries {
			if !e.IsDir() || skipFolders[e.Name()] {
				continue
			}
			mainIndex := filepath.Join(rootDir, e.Name(), "index.html")
			if _, err := os.Stat(mainIndex); err != nil {
				continue // skip folders without index.html
			}

			title, img := extractPageMeta(mainIndex)
			if title == "" {
				title = "Landing Page: " + e.Name()
			}

			dbEntry := settingMap[e.Name()]
			if dbEntry.ImageURL != "" {
				img = dbEntry.ImageURL
			}
			formId := ""
			if dbEntry.LinkedFormID != nil {
				formId = *dbEntry.LinkedFormID
			}

			pages = append(pages, map[string]interface{}{
				"title":              title,
				"alias":              e.Name(),
				"url":                "/" + e.Name() + "/index.html",
				"status":             "Live",
				"path":               e.Name() + "/index.html",
				"image":              img,
				"description":        dbEntry.Description,
				"folder":             e.Name(),
				"linked_form_id":     formId,
				"linked_program_ids": []string{},
				"is_default":         dbEntry.IsDefault,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "pages": pages})
}

func (h *PageSettingHandler) GetCover(c *gin.Context) {
	folder := c.Query("folder")
	if folder == "" {
		c.JSON(http.StatusOK, gin.H{"success": false, "image_url": nil, "description": nil})
		return
	}
	item, err := h.usecase.GetConfig(context.Background(), folder)
	if err != nil || item == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "image_url": nil, "description": nil})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "image_url": item.ImageURL, "description": item.Description})
}

func (h *PageSettingHandler) GetPackages(c *gin.Context) {
	rootDir := os.Getenv("LP_ROOT_DIR")
	if rootDir == "" {
		candidates := []string{"/public-lp", "../../public-lp", "../public-lp", "./public-lp"}
		for _, p := range candidates {
			if _, err := os.Stat(p); err == nil {
				rootDir = p
				break
			}
		}
		if rootDir == "" {
			rootDir = "../../public-lp"
		}
	}

	skipFolders := map[string]bool{"assets": true, "shared": true, "jualan-lp": true}

	items, _ := h.usecase.FetchAll(context.Background())
	settingMap := make(map[string]domain.PageSetting)
	for _, it := range items {
		settingMap[it.Folder] = it
	}

	var packages []map[string]interface{}
	entries, err := os.ReadDir(rootDir)
	if err == nil {
		for _, e := range entries {
			if !e.IsDir() || skipFolders[e.Name()] {
				continue
			}
			mainIndex := filepath.Join(rootDir, e.Name(), "index.html")
			if _, err := os.Stat(mainIndex); err != nil {
				continue
			}
			title, _ := extractPageMeta(mainIndex)
			if title == "" {
				title = e.Name()
			}
			dbEntry := settingMap[e.Name()]
			packages = append(packages, map[string]interface{}{
				"folder":      e.Name(),
				"title":       title,
				"url":         "/" + e.Name() + "/index.html",
				"image_url":   dbEntry.ImageURL,
				"description": dbEntry.Description,
			})
		}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "packages": packages})
}

func (h *PageSettingHandler) GetConfig(c *gin.Context) {
	folder := c.Param("folder")
	// Full emulation of LP dynamic load: Needs real Form & Programs fetched
	// Simplified here to just return the PageSettings
	item, _ := h.usecase.GetConfig(context.Background(), folder)

	if item == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "form": nil, "programs": []interface{}{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "setting": item, "form": nil, "programs": []interface{}{}}) // extend as needed
}

func (h *PageSettingHandler) GetDefault(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"success": true, "folder": "lp-liburan", "url": "/lp-liburan/index.html"})
}

func (h *PageSettingHandler) DummyPost(c *gin.Context) {
	var body struct {
		Slug string `json:"slug"`
	}
	c.ShouldBindJSON(&body)
	if body.Slug == "" {
		body.Slug = "new-page"
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "url": "/lp-custom/" + body.Slug + "/index.html", "message": "Page generation simulated"})
}

func (h *PageSettingHandler) SaveConfig(c *gin.Context) {
	folder := c.Param("folder")
	var body domain.PageSetting
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid input"})
		return
	}
	body.Folder = folder

	if err := h.usecase.SaveConfig(context.Background(), &body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Page configuration updated successfully"})
}
