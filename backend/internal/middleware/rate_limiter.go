package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type rateLimiter struct {
	visitors map[string]*visitor
	mu       sync.Mutex
	limit    int
}

type visitor struct {
	count     int
	lastReset time.Time
}

// RateLimit creates a simple IP-based rate limiter middleware
func RateLimit(limit int, window time.Duration) gin.HandlerFunc {
	rl := &rateLimiter{
		visitors: make(map[string]*visitor),
		limit:    limit,
	}

	go func() {
		for {
			time.Sleep(window)
			rl.mu.Lock()
			for ip, v := range rl.visitors {
				if time.Since(v.lastReset) > window {
					delete(rl.visitors, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()

	return func(c *gin.Context) {
		ip := c.ClientIP()
		rl.mu.Lock()
		v, exists := rl.visitors[ip]
		if !exists {
			rl.visitors[ip] = &visitor{count: 1, lastReset: time.Now()}
			rl.mu.Unlock()
			c.Next()
			return
		}

		if time.Since(v.lastReset) > window {
			v.count = 1
			v.lastReset = time.Now()
		} else {
			v.count++
		}

		if v.count > rl.limit {
			rl.mu.Unlock()
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"message": "Terlalu banyak permintaan, coba lagi nanti.",
			})
			return
		}

		rl.mu.Unlock()
		c.Next()
	}
}
