package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"munira_crm/internal/domain"
)

// VendorUsecase mengimplementasikan business logic terkait vendor
type vendorUsecase struct {
	vendorRepo domain.VendorRepository
	httpClient *http.Client
}

// NewVendorUsecase adalah constructor
func NewVendorUsecase(repo domain.VendorRepository) domain.VendorUsecase {
	return &vendorUsecase{
		vendorRepo: repo,
		httpClient: &http.Client{Timeout: 10 * time.Second}, // Selalu berikan timeout!
	}
}

// FetchAllVendorPackages mengambil ketersediaan paket umrah dari 3 vendor secara Concurrent
func (u *vendorUsecase) FetchAllVendorPackages(ctx context.Context) ([]domain.VendorPackageResponse, error) {
	// 1. Ambil list API Vendor yang aktif dari PostgreSQL 
	vendors, err := u.vendorRepo.GetActiveVendors(ctx)
	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	var mu sync.Mutex // Untuk menghindari race condition saat append ke slice
	var allPackages []domain.VendorPackageResponse

	// Channel untuk mengumpulkan error jika ada yang gagal, tapi ini opsional 
	// Di sini kita pilih "Fire and Collect", kumpulkan yang berhasil saja.

	// 2. Tembak API masing-masing Vendor menggunakan Goroutines
	for _, v := range vendors {
		wg.Add(1)
		go func(vendor domain.Vendor) {
			defer wg.Done()

			// Panggil API External
			packages, fetchErr := u.fetchFromExternalVendor(ctx, vendor)
			if fetchErr != nil {
				// Cukup log error-nya, jangan matikan goroutine lain
				fmt.Printf("[Error] Gagal konek ke vendor %s: %v\n", vendor.Name, fetchErr)
				return
			}

			// Aman untuk Append menggunakan Mutex
			mu.Lock()
			allPackages = append(allPackages, packages...)
			mu.Unlock()
		}(v)
	}

	// 3. Tunggu semua panggilan dari vendorA, vendorB, vendorC selesai
	wg.Wait()

	return allPackages, nil
}

// fungsi pembantu untuk menembak API vendor
func (u *vendorUsecase) fetchFromExternalVendor(ctx context.Context, v domain.Vendor) ([]domain.VendorPackageResponse, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", v.APIURL+"/api/packages", nil)
	if err != nil {
		return nil, err
	}
	
	req.Header.Set("Authorization", "Bearer "+v.APIKey)

	resp, err := u.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("vendor API error: status %d", resp.StatusCode)
	}

	var data []domain.VendorPackageResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return data, nil
}
