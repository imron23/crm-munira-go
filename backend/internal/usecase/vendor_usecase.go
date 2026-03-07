package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"

	"munira_crm_backend/internal/domain"
)

type vendorUsecase struct {
	vendorRepo domain.VendorRepository
	httpClient *http.Client
}

func NewVendorUsecase(repo domain.VendorRepository) domain.VendorUsecase {
	return &vendorUsecase{
		vendorRepo: repo,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

func (u *vendorUsecase) FetchAllVendorPackages(ctx context.Context) ([]domain.VendorPackageResponse, error) {
	vendors, err := u.vendorRepo.GetActiveVendors(ctx)
	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	var mu sync.Mutex
	var allPackages []domain.VendorPackageResponse

	for _, v := range vendors {
		wg.Add(1)
		go func(vendor domain.Vendor) {
			defer wg.Done()

			packages, fetchErr := u.fetchFromExternalVendor(ctx, vendor)
			if fetchErr != nil {
				fmt.Printf("[Error] Failed connecting to vendor %s: %v\n", vendor.Name, fetchErr)
				return
			}

			mu.Lock()
			allPackages = append(allPackages, packages...)
			mu.Unlock()
		}(v)
	}

	wg.Wait()
	return allPackages, nil
}

func (u *vendorUsecase) fetchFromExternalVendor(ctx context.Context, v domain.Vendor) ([]domain.VendorPackageResponse, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", v.APIURL+"/api/packages", nil)
	if err != nil {
		return nil, err
	}

	if v.APIKey != "" {
		req.Header.Set("Authorization", "Bearer "+v.APIKey)
	}

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
