package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Simple Auth Middleware
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			// In Strangler Fig phase, maybe let it pass for now if no auth is enforced,
			// or enforce it right away depending on migration rules.
			// Let's assume we enforce it but mock it.
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Decode JWT/verify Token Logic here.
		if tokenString == "test-token" {
			c.Set("user_id", "123")
		} else {
			// for now let it pass to easily test during migration, but add flag
			// Uncomment for real prod
			// c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			// c.Abort()
			// return
		}

		c.Next()
	}
}
