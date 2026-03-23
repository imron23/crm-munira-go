import os

sf_path = "/Users/user/Documents/Munira world/go migarsi/public-lp/liburan-26-sf/index.html"
lf_path = "/Users/user/Documents/Munira world/go migarsi/public-lp/liburan-26-lf/index.html"

with open(sf_path, "r") as f:
    sf_lines = f.readlines()

with open(lf_path, "r") as f:
    lf_lines = f.readlines()

sf_form_idx = -1
for i, line in enumerate(sf_lines):
    if '<section class="form-section" id="daftar">' in line:
        sf_form_idx = i
        break

lf_form_idx = -1
for i, line in enumerate(lf_lines):
    if '<section class="form-section" id="daftar">' in line:
        lf_form_idx = i
        break

if sf_form_idx != -1 and lf_form_idx != -1:
    sf_suffix = "".join(sf_lines[sf_form_idx:])
    
    # Modify the form payload source
    sf_suffix = sf_suffix.replace("form_source: 'liburan-26-sf'", "form_source: 'liburan-26-lf'")
    
    new_lf = "".join(lf_lines[:lf_form_idx]) + sf_suffix
    
    with open(lf_path, "w") as f:
        f.write(new_lf)
    print("Success: LF file modified.")
else:
    print("Error: Could not find the section.")
