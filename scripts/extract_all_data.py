import os
import json
import re
from pathlib import Path

# Paths
BASE_DIR = Path("election.ratopati.com")
DATA_DIR = Path("app/public/data")

# Encodings
ENCODING = "utf-8"

# Helpers
NEPALI_DIGITS = "०१२३४५६७८९"
def nepali_to_english_int(num_str):
    if not num_str:
        return 0
    # Clean string: keep only Nepali digits and standard digits
    cleaned = ""
    for c in num_str:
        if c in NEPALI_DIGITS:
            cleaned += str(NEPALI_DIGITS.index(c))
        elif c.isdigit():
            cleaned += c
    return int(cleaned) if cleaned else 0

def clean_html_tags(text):
    if not text:
        return ""
    # Remove HTML comments and tags
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    text = re.sub(r'<[^>]+>', '', text)
    # Decode some basic entities
    text = text.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
    return re.sub(r'\s+', ' ', text).strip()

def extract_voters(html):
    # Try parsing from ld+json or regex search in HTML
    # ld+json: {"@type":"PropertyValue","name":"जम्मा मतदाता","value":3574286}
    voters = {"total": 0, "male": 0, "female": 0, "other": 0}
    
    # Try ld+json first
    ld_matches = re.findall(r'PropertyValue","name":"([^"]+)","value":(\d+)', html)
    if ld_matches:
        for name, val in ld_matches:
            val_int = int(val)
            if "जम्मा" in name or "Total" in name:
                voters["total"] = val_int
            elif "पुरुष" in name or "Male" in name:
                voters["male"] = val_int
            elif "महिला" in name or "Female" in name:
                voters["female"] = val_int
            elif "अन्य" in name or "Other" in name:
                voters["other"] = val_int
        if voters["total"] > 0:
            return voters

    # Try stats ul regex
    # <h5>३५७४२८६<span>जम्मा मतदाता</span></h5>
    stats_matches = re.findall(r'<h5>\s*([०-९\d,\s]+)\s*<span>\s*([^<]+?)\s*</span>\s*</h5>', html)
    for val_str, name in stats_matches:
        val_int = nepali_to_english_int(val_str)
        if "जम्मा" in name:
            voters["total"] = val_int
        elif "पुरुष" in name:
            voters["male"] = val_int
        elif "महिला" in name:
            voters["female"] = val_int
        elif "अन्य" in name:
            voters["other"] = val_int
            
    return voters

# Load candidate database to enrich them with votes
candidates_db_path = DATA_DIR / "candidates.json"
if candidates_db_path.exists():
    with candidates_db_path.open("r", encoding="utf-8-sig") as f:
        candidates_db = json.load(f)
else:
    candidates_db = []

# Map of candidate slug -> candidate record for quick lookups and updates
candidate_by_slug = {c.get("slug"): c for c in candidates_db if c.get("slug")}

# -----------------------------------------------------------------------------
# 1. PROCESS PROVINCES
# -----------------------------------------------------------------------------
print("Processing Provinces...")
provinces = []
province_dir = BASE_DIR / "province"

# Map of province slug -> province name
province_slug_map = {
    "koshi-province": "कोशी प्रदेश",
    "madhesh-province": "मधेस प्रदेश",
    "bagmati-province": "बागमती प्रदेश",
    "gandaki-province": "गण्डकी प्रदेश",
    "lumbini-province": "लुम्बिनी प्रदेश",
    "karnali-province": "कर्णाली प्रदेश",
    "sudurpaschim-province": "सुदूरपश्चिम प्रदेश"
}

for file_path in province_dir.glob("*.html"):
    slug = file_path.stem
    if slug == "PROVINCE_SLUG" or slug not in province_slug_map:
        continue
        
    html = file_path.read_text(encoding=ENCODING)
    
    # Title
    title_match = re.search(r'<h3 class="page-title">\s*([^<]+?)\s*</h3>', html)
    title = title_match.group(1).strip() if title_match else province_slug_map[slug]
    
    # Description
    desc_match = re.search(r'<div class="contentarea">\s*<p>(.*?)</p>', html, re.S)
    description = clean_html_tags(desc_match.group(1)) if desc_match else ""
    
    # Voters
    voters = extract_voters(html)
    
    # Districts list from SVG map attribute
    districts = []
    dist_match = re.search(r"data-districts='([^']+)'", html)
    if dist_match:
        try:
            districts = json.loads(dist_match.group(1))
        except Exception as e:
            print(f"Error parsing districts list JSON for {slug}: {e}")
            
    provinces.append({
        "slug": slug,
        "name": title,
        "description": description,
        "voters": voters,
        "districts": districts
    })

# Write Province JSON
with (DATA_DIR / "province.json").open("w", encoding=ENCODING) as f:
    json.dump(provinces, f, ensure_ascii=False, indent=2)
print(f"Saved {len(provinces)} provinces.")

# -----------------------------------------------------------------------------
# 2. PROCESS DISTRICTS
# -----------------------------------------------------------------------------
print("Processing Districts...")
districts = []
district_dir = BASE_DIR / "district"

for file_path in district_dir.glob("*.html"):
    slug = file_path.stem
    if slug == "DISTRICT_SLUG":
        continue
        
    html = file_path.read_text(encoding=ENCODING)
    
    # Title
    title_match = re.search(r'<h3 class="page-title">\s*([^<]+?)\s*</h3>', html)
    title = clean_html_tags(title_match.group(1)) if title_match else slug.capitalize()
    
    # Province slug/name from breadcrumb or info div
    province_slug = ""
    province_name = ""
    province_match = re.search(r'<a href="\.\./province/([^"]+)">\s*([^<]+?)\s*</a>', html)
    if province_match:
        province_slug = province_match.group(1).replace(".html", "")
        province_name = clean_html_tags(province_match.group(2))
        
    # Map Image
    map_image = ""
    map_match = re.search(r'<div class="np-map">\s*<img src="([^"]+)"', html)
    if map_match:
        # Convert path: ../../npcdn.ratopati.com/election/media/... -> /assets/images/...
        map_image = map_match.group(1).replace("../../npcdn.ratopati.com", "").replace("../..", "")
        
    # Description
    desc_match = re.search(r'<div class="contentarea">\s*<p>(.*?)</p>', html, re.S)
    description = clean_html_tags(desc_match.group(1)) if desc_match else ""
    
    # Voters
    voters = extract_voters(html)
    
    # Constituencies (scan links pointing to constituencies)
    constituencies_slugs = []
    const_matches = re.findall(r'href="\.\./constituency/([^"]+)"', html)
    for match in const_matches:
        c_slug = match.replace(".html", "")
        if c_slug not in constituencies_slugs and c_slug != "CONSTITUENCY_ALIAS":
            constituencies_slugs.append(c_slug)
            
    districts.append({
        "slug": slug,
        "name": title,
        "province_slug": province_slug,
        "province_name": province_name,
        "map_image": map_image,
        "description": description,
        "voters": voters,
        "constituencies": constituencies_slugs
    })

# Write District JSON
with (DATA_DIR / "district.json").open("w", encoding=ENCODING) as f:
    json.dump(districts, f, ensure_ascii=False, indent=2)
print(f"Saved {len(districts)} districts.")

# -----------------------------------------------------------------------------
# 3. PROCESS CONSTITUENCIES & UPDATE CANDIDATE VOTES
# -----------------------------------------------------------------------------
print("Processing Constituencies...")
constituencies = []
constituency_dir = BASE_DIR / "constituency"

# For parsing candidate cards in constituency pages
# Classes can be candidate-win or just party-container col12
candidate_card_re = re.compile(
    r'<div class="party-container[^"]*(candidate-win)?[^"]*">.*?'
    r'<a href="\.\./candidate/([^"]+)\.html" class="party-logo">.*?'
    r'<span class="party-name">\s*([^<]+?)\s*</span>.*?</a>.*?'
    r'<div class="votes">\s*([०-९\d,\s]+)\s*(?:<img src="[^"]*win-tick[^"]*")?.*?</div>',
    re.S
)

for file_path in constituency_dir.glob("*.html"):
    slug = file_path.stem
    if slug in ("CONSTITUENCY_ALIAS", "CONSTITUENCY_ID"):
        continue
        
    html = file_path.read_text(encoding=ENCODING)
    
    # Title
    title_match = re.search(r'<h3 class="page-title">\s*([^<]+?)\s*</h3>', html)
    title = clean_html_tags(title_match.group(1)) if title_match else slug.replace("-", " ").title()
    
    # District and Province from info chips
    district_slug = ""
    district_name = ""
    province_slug = ""
    province_name = ""
    
    # <a href="../district/taplejung.html" class="chip"> जिला : ताप्लेजुङ </a>
    dist_match = re.search(r'<a href="\.\./district/([^"]+)"[^>]*>\s*([^<]+?)\s*</a>', html)
    if dist_match:
        district_slug = dist_match.group(1).replace(".html", "")
        district_name = clean_html_tags(dist_match.group(2)).replace("जिल्ला :", "").replace("जिला :", "").strip()
        
    prov_match = re.search(r'<a href="\.\./province/([^"]+)"[^>]*>\s*([^<]+?)\s*</a>', html)
    if prov_match:
        province_slug = prov_match.group(1).replace(".html", "")
        province_name = clean_html_tags(prov_match.group(2)).strip()
        
    # Map Image
    map_image = ""
    map_match = re.search(r'<div class="np-map">\s*<img src="([^"]+)"', html)
    if map_match:
        map_image = map_match.group(1).replace("../../npcdn.ratopati.com", "").replace("../..", "")
        
    # Voters
    voters = extract_voters(html)
    
    # Extract Candidates and Votes
    c_list = []
    # Find all party-container elements
    # Since regex can be tricky with greedy matches, let's find all chunks of <div class="party-container ...> </div>
    card_chunks = re.findall(r'<div class="party-container col12[^"]*">.*?</div>\s*</div>', html, re.S)
    
    for chunk in card_chunks:
        # Match candidate details
        win_class = "candidate-win" in chunk or "win-tick" in chunk
        slug_match = re.search(r'href="\.\./candidate/([^"]+)\.html"', chunk)
        name_match = re.search(r'<span class="party-name">\s*([^<]+?)\s*</span>', chunk)
        votes_match = re.search(r'<div class="votes">\s*([०-९\d,\s]+)\s*', chunk)
        
        if slug_match and name_match:
            c_slug = slug_match.group(1).strip()
            c_name = clean_html_tags(name_match.group(1))
            raw_votes = votes_match.group(1) if votes_match else "0"
            vote_count = nepali_to_english_int(raw_votes)
            
            c_list.append({
                "slug": c_slug,
                "name": c_name,
                "votes": vote_count,
                "is_winner": win_class
            })
            
            # Enrich candidates in the database with votes and winner status
            if c_slug in candidate_by_slug:
                candidate_by_slug[c_slug]["votes"] = vote_count
                candidate_by_slug[c_slug]["isWinner"] = win_class
                
    constituencies.append({
        "slug": slug,
        "name": title,
        "district_slug": district_slug,
        "district_name": district_name,
        "province_slug": province_slug,
        "province_name": province_name,
        "map_image": map_image,
        "voters": voters,
        "candidates": c_list
    })

# Write Constituency JSON
with (DATA_DIR / "constituency.json").open("w", encoding=ENCODING) as f:
    json.dump(constituencies, f, ensure_ascii=False, indent=2)
print(f"Saved {len(constituencies)} constituencies.")

# Write back updated candidates database
with candidates_db_path.open("w", encoding=ENCODING) as f:
    json.dump(candidates_db, f, ensure_ascii=False, indent=2)
print("Updated candidates.json with actual vote counts.")

# -----------------------------------------------------------------------------
# 4. PROCESS PARTIES
# -----------------------------------------------------------------------------
print("Processing Parties...")
parties = []
party_dir = BASE_DIR / "party"

for file_path in party_dir.glob("*.html"):
    slug = file_path.stem
    html = file_path.read_text(encoding=ENCODING)
    
    # Title
    title_match = re.search(r'<h3 class="page-title">\s*([^<]+?)\s*</h3>', html)
    title = clean_html_tags(title_match.group(1)) if title_match else slug.replace("-", " ").title()
    
    # Leader
    leader = ""
    leader_match = re.search(r'अध्यक्ष\s*:\s*([^<]+?)\s*<', html)
    if not leader_match:
        leader_match = re.search(r'अध्यक्ष/संयोजक/सञ्चालक\s*:\s*([^<]+?)\s*<', html)
    if leader_match:
        leader = clean_html_tags(leader_match.group(1)).replace("अध्यक्ष :", "").replace("संयोजक :", "").strip()
        
    # Wins
    wins = 0
    wins_match = re.search(r'<h5>\s*([०-९\d]+)\s*</h5>\s*<a href="[^"]+winners[^"]*">जित</a>', html)
    if wins_match:
        wins = nepali_to_english_int(wins_match.group(1))
        
    # Proportional Votes
    prop_votes = "0"
    prop_match = re.search(r'<h5>\s*([०-९\d,]+)\s*</h5>\s*<a href="[^"]*">समानुपातिक मत</a>', html)
    if prop_match:
        # Keep formatting with commas
        prop_votes = prop_match.group(1).strip()
        
    # Logo
    logo = ""
    logo_match = re.search(r'<div class="candidate-featured-img">\s*<img src="([^"]+)"', html)
    if logo_match:
        logo = logo_match.group(1).replace("../../npcdn.ratopati.com", "").replace("../..", "")
        
    # Description
    desc_match = re.search(r'<div class="contentarea">\s*(.*?)\s*</div>', html, re.S)
    description = clean_html_tags(desc_match.group(1)) if desc_match else ""
    
    parties.append({
        "slug": slug,
        "name": title,
        "leader": leader,
        "wins": wins,
        "proportional_votes": prop_votes,
        "logo": logo,
        "description": description
    })

# Write Party JSON
with (DATA_DIR / "party.json").open("w", encoding=ENCODING) as f:
    json.dump(parties, f, ensure_ascii=False, indent=2)
print(f"Saved {len(parties)} parties.")

# -----------------------------------------------------------------------------
# 5. PROCESS MANIFESTOS
# -----------------------------------------------------------------------------
print("Processing Manifestos...")
manifestos = []
manifesto_dir = BASE_DIR / "manifesto"

for file_path in manifesto_dir.glob("*.html"):
    m_id = file_path.stem
    html = file_path.read_text(encoding=ENCODING)
    
    # Party Title
    title_match = re.search(r'<h3 class="page-title">\s*([^<]+?)\s*</h3>', html)
    party_name = clean_html_tags(title_match.group(1)) if title_match else "Political Party"
    
    # PDF Iframe URL
    pdf_url = ""
    iframe_match = re.search(r'<iframe src="([^"]+)"', html)
    if iframe_match:
        pdf_url = iframe_match.group(1).strip()
        
    manifestos.append({
        "id": m_id,
        "party_name": party_name,
        "pdf_url": pdf_url
    })

# Write Manifesto JSON
with (DATA_DIR / "manifesto.json").open("w", encoding=ENCODING) as f:
    json.dump(manifestos, f, ensure_ascii=False, indent=2)
print(f"Saved {len(manifestos)} party manifestos.")

print("All extractions completed successfully!")
