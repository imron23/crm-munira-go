package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"
)

type Province struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
type Regency struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
type District struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
type Wilayah struct {
	Kecamatan string `json:"kecamatan"`
	Kota      string `json:"kota"`
	Provinsi  string `json:"provinsi"`
	Label     string `json:"label"`
}

func getJSON(url string, target interface{}) error {
	r, err := http.Get(url)
	if err != nil { return err }
	defer r.Body.Close()
	b, _ := io.ReadAll(r.Body)
	return json.Unmarshal(b, target)
}

func main() {
	var provs []Province
	if err := getJSON("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json", &provs); err != nil {
		fmt.Println("Err prov:", err)
		return
	}

	var results []Wilayah
	var mu sync.Mutex
	var wg sync.WaitGroup

	for _, p := range provs {
		p := p
		wg.Add(1)
		go func() {
			defer wg.Done()
			var kabs []Regency
			if err := getJSON("https://www.emsifa.com/api-wilayah-indonesia/api/regencies/"+p.ID+".json", &kabs); err != nil {
				return
			}
			var kwg sync.WaitGroup
			for _, k := range kabs {
				k := k
				kwg.Add(1)
				go func() {
					defer kwg.Done()
					var kecs []District
					if err := getJSON("https://www.emsifa.com/api-wilayah-indonesia/api/districts/"+k.ID+".json", &kecs); err != nil {
						return
					}
					var localRes []Wilayah
					for _, kec := range kecs {
						localRes = append(localRes, Wilayah{
							Kecamatan: kec.Name,
							Kota:      k.Name,
							Provinsi:  p.Name,
							Label:     fmt.Sprintf("%s, %s, %s", kec.Name, k.Name, p.Name),
						})
					}
					mu.Lock()
					results = append(results, localRes...)
					mu.Unlock()
				}()
			}
			kwg.Wait()
		}()
	}
	wg.Wait()

	b, _ := json.Marshal(results)
	os.WriteFile("wilayah.json", b, 0644)
	fmt.Printf("Wrote %d kecamatans\n", len(results))
}
