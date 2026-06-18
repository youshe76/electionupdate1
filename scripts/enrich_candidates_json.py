import json
import re
from pathlib import Path

BASE_DIR = Path("election.ratopati.com") / "candidate"
CANDIDATES_PATH = Path("app/public/data/candidates.json")

page_header_re = re.compile(r'<div class="page-header">(.*?)<div class="info-grid">', re.S)
party_link_re = re.compile(r'<a[^>]+href="\.\./party/[^\"]+"[^>]*>([^<]+?)</a>', re.S)
constituency_link_re = re.compile(r'<a[^>]+class="chip"[^>]*>([^<]+?)</a>', re.S)
province_re = re.compile(r'प्रदेश\s*<strong>\s*([^<]+?)\s*</strong>', re.S)
district_re = re.compile(r'जिल्ला\s*<strong>\s*([^<]+?)\s*</strong>', re.S)
manifesto_re = re.compile(r'manifesto\.html')

with CANDIDATES_PATH.open("r", encoding="utf-8-sig") as f:
    candidates = json.load(f)

updated = 0
missing_files = []

for candidate in candidates:
    slug = candidate.get("slug")
    if not slug:
        continue

    page_path = BASE_DIR / f"{slug}.html"
    if not page_path.exists():
        missing_files.append(slug)
        continue

    html = page_path.read_text(encoding="utf-8")
    header_match = page_header_re.search(html)
    party = None
    constituency = None
    if header_match:
        header_html = header_match.group(1)
        party_match = party_link_re.search(header_html)
        if party_match:
            party = party_match.group(1).strip()
        const_match = constituency_link_re.search(header_html)
        if const_match:
            constituency = const_match.group(1).strip()

    province_match = province_re.search(html)
    district_match = district_re.search(html)
    manifesto_match = manifesto_re.search(html)

    changed = False

    if constituency is not None and candidate.get("constituency") != constituency:
        candidate["constituency"] = constituency
        changed = True

    if province_match:
        province = province_match.group(1).strip()
        if candidate.get("provinces") != province:
            candidate["provinces"] = province
            changed = True

    if district_match:
        district = district_match.group(1).strip()
        if candidate.get("district") != district:
            candidate["district"] = district
            changed = True

    if manifesto_match and candidate.get("manifesto") != "/manifesto":
        candidate["manifesto"] = "/manifesto"
        changed = True

    if party is not None and candidate.get("party") != party:
        candidate["party"] = party
        changed = True

    if changed:
        updated += 1

with CANDIDATES_PATH.open("w", encoding="utf-8-sig") as f:
    json.dump(candidates, f, ensure_ascii=False, indent=2)

print(f"Updated {updated} candidate records.")
print(f"Missing files: {len(missing_files)}")
if missing_files:
    print("Missing candidate pages:", missing_files[:20])
