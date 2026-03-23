"""
Refactor: Extract inline <style> and <script> blocks from HTML files
into separate style.css and script.js files.

Targets:
  - public-lp/liburan-26-sf/index.html
  - public-lp/liburan-26-lf/index.html
  - public-lp/lp-2-long/index.html
"""

import re
import os

BASE = "/Users/user/Documents/Munira world/go migarsi/public-lp"

TARGETS = [
    "liburan-26-sf",
    "liburan-26-lf",
    "lp-2-long",
]

def extract_inline_styles(html: str) -> tuple[str, str]:
    """
    Extract all inline <style>...</style> blocks from HTML.
    Returns (cleaned_html, combined_css)
    """
    css_blocks = []
    
    def replacer(m):
        css_blocks.append(m.group(1).strip())
        return "<!-- STYLE_PLACEHOLDER -->"
    
    cleaned = re.sub(r'<style>(.*?)</style>', replacer, html, flags=re.DOTALL)
    combined_css = "\n\n/* ===================== */\n\n".join(css_blocks)
    return cleaned, combined_css


def extract_inline_scripts(html: str, exclude_pattern: str = None) -> tuple[str, str]:
    """
    Extract inline <script>...</script> blocks that:
      - do NOT have a src attribute (those are external references, keep them)
      - are NOT tiny utility scripts (pageLoader, body.loading)
    Returns (cleaned_html, combined_js)
    """
    js_blocks = []
    
    # We want to keep:
    #   - <script src="..."> (external) 
    #   - Tiny preloader inline scripts
    # We want to extract:
    #   - Any sizeable inline script (> 100 chars)
    
    def replacer(m):
        full_tag = m.group(0)
        attrs = m.group(1) or ''
        content = m.group(2).strip() if m.group(2) else ''
        
        # If it's an external script, keep it as-is
        if 'src=' in attrs:
            return full_tag
        
        # If it's a tiny/empty script (< 200 chars), keep it inline
        if len(content) < 200:
            return full_tag
        
        js_blocks.append(content)
        return "<!-- SCRIPT_PLACEHOLDER -->"
    
    cleaned = re.sub(
        r'<script(\s[^>]*)?>([^<]*(?:(?!</script>)<[^<]*)*)</script>',
        replacer,
        html,
        flags=re.DOTALL
    )
    
    combined_js = "\n\n/* ---- */\n\n".join(js_blocks)
    return cleaned, combined_js


def add_link_and_script_refs(html: str, folder_name: str) -> str:
    """
    Replace STYLE_PLACEHOLDER with <link> to style.css
    Replace SCRIPT_PLACEHOLDER with <script src="script.js">
    """
    # Insert link to local style.css right after the shared style-main.css link
    html = html.replace(
        "<!-- STYLE_PLACEHOLDER -->",
        "",  # Remove all placeholder comments
    )
    
    # Insert local stylesheet link before </head>
    local_css_link = f'    <link rel="stylesheet" href="/{folder_name}/style.css">'
    html = html.replace("</head>", f"{local_css_link}\n</head>", 1)
    
    # Remove SCRIPT_PLACEHOLDERs (replace with nothing, script.js linked at bottom)
    html = html.replace("<!-- SCRIPT_PLACEHOLDER -->", "")
    
    # Insert local script.js before </body>
    local_script = f'    <script src="/{folder_name}/script.js" defer></script>'
    # Insert before the first external script tag at end of body, or before </body>
    html = html.replace("</body>", f"{local_script}\n</body>", 1)
    
    return html


for folder in TARGETS:
    folder_path = os.path.join(BASE, folder)
    html_path = os.path.join(folder_path, "index.html")
    css_path = os.path.join(folder_path, "style.css")
    js_path = os.path.join(folder_path, "script.js")
    
    if not os.path.exists(html_path):
        print(f"[SKIP] {folder}/index.html not found")
        continue
    
    print(f"\n📁 Processing: {folder}/")
    
    with open(html_path, "r", encoding="utf-8") as f:
        original_html = f.read()
    
    # Step 1: Extract inline styles
    html, css = extract_inline_styles(original_html)
    print(f"  Extracted {len(css)} chars of CSS")
    
    # Step 2: Extract inline scripts
    html, js = extract_inline_scripts(html)
    print(f"  Extracted {len(js)} chars of JS")
    
    # Step 3: Add references to local files
    html = add_link_and_script_refs(html, folder)
    
    # Step 4: Write files
    with open(css_path, "w", encoding="utf-8") as f:
        header = f"/* ============================================================\n"
        header += f"   Munira World — {folder}/style.css\n"
        header += f"   LP-Specific styles (extends /lp-liburan/style-main.css)\n"
        header += f"   ============================================================ */\n\n"
        f.write(header + css)
    print(f"  ✅ Written: style.css ({len(css)} chars)")
    
    with open(js_path, "w", encoding="utf-8") as f:
        header = f"/* ============================================================\n"
        header += f"   Munira World — {folder}/script.js\n"
        header += f"   LP-Specific JavaScript\n"
        header += f"   ============================================================ */\n\n"
        f.write(header + js)
    print(f"  ✅ Written: script.js ({len(js)} chars)")
    
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"  ✅ Updated: index.html ({len(html)} chars)")

print("\n✅ Refactoring complete!")
