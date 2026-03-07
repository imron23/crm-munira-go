import re

# Read the long lp
with open('lp-2-long/index.html', 'r', encoding='utf-8') as f:
    long_content = f.read()

# Read the short lp
with open('lp-liburan-short/index.html', 'r', encoding='utf-8') as f:
    short_content = f.read()

# Extract the short form section from short lp.
# It starts at <section class="form-section form-short"... or similar. Let's find exactly.
# Wait, let's just find the <section class="shortform-section" id="daftar"> ... </section>
short_form_match = re.search(r'(<!-- SHORT FORM SECTION -->\s*<section class="shortform-section" id="daftar">[\s\S]*?</section>)', short_content)

if not short_form_match:
    print("Could not find short form section!")
else:
    print("Short form section found.")

# Now replace the long form section in long_content.
# The long form section is probably <section class="form-section" id="daftar"> ... </section>
# Wait, we need to find how it's defined in lp-2-long/index.html
long_form_match = re.search(r'(<!-- FORM SECTION -->\s*<section class="form-section" id="daftar">[\s\S]*?</section>)', long_content)

if not long_form_match:
    print("Could not find long form section!")
else:
    print("Long form section found.")

# We also need to get the specific CSS styles from the short LP, but wait, last time I put them in the head.
# Let's extract the <style> tag from the short LP head that contains "Short Form Overrides"
style_match = re.search(r'(<style>\s*/\* ── Short Form Overrides ── \* /[\s\S]*?</style>)', short_content)

if not style_match:
    # try picking the whole style tag that is just short form overrides
    style_match = re.search(r'(<style>\s*/\*\s*──\s*Short Form Overrides\s*──\s*\*/[\s\S]*?</style>)', short_content)

if style_match:
    print("Style found.")
else:
    print("Style not found.")
