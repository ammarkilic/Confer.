import os
import re
import json
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

# Setup target list pages
TARGETS = [
    {
        "name": "Stanford University - Sociology Past (Local Colloquia)",
        "domain": "sociology.stanford.edu",
        "url": "https://sociology.stanford.edu/news-events/past-events"
    },
    {
        "name": "Earth System Governance Conference 2026 (International Conference)",
        "domain": "earthsystemgovernance.org",
        "url": "https://www.earthsystemgovernance.org/2026-bath/"
    }
]

API_KEY = os.getenv("GEMINI_API_KEY")

def fetch_html(url):
    """Safely fetch HTML with headers to avoid being blocked."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            return response.text
        else:
            print(f"[-] Failed to fetch {url}: Status code {response.status_code}")
            return None
    except Exception as e:
        print(f"[-] Error fetching {url}: {e}")
        return None

def extract_main_text(html):
    """Cleans up raw HTML, returns parsed text with metadata."""
    soup = BeautifulSoup(html, "html.parser")
    
    # Remove useless elements
    for el in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        el.decompose()
        
    title = soup.title.string.strip() if soup.title else "Untitled Directory"
    
    # Extract text
    text = soup.get_text("\n")
        
    # Clean whitespace
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    clean_text = "\n".join(chunk for chunk in chunks if chunk)
    
    return title, clean_text[:8000] # Limit to 8000 chars to fit directory content

def call_gemini_extraction(url, title, content_text):
    """Uses Gemini 2.5 Flash to identify, verify and extract multiple conference/event details from directory text."""
    if not API_KEY:
        print("[-] Gemini API Key is missing. Skipping API call.")
        return []

    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"
    
    prompt = f"""
Analyze the calendar event listing page from a prestigious academic institution's website.
URL: {url}
Page Title: {title}

Page Content:
\"\"\"
{content_text}
\"\"\"

Tasks:
1. Identify academic events listed on this page.
2. For each event, perform strict curation to decide whether it is worth traveling to internationally (e.g. from Istanbul to Stanford/Oxford) or if it is just a local/internal event.
   Use the following rules to filter:
   
   * CRITICAL REJECTION RULES (REJECT / DO NOT EXTRACT):
     - Skip departmental colloquia (colloquium series) and weekly/monthly seminars (e.g. "Sociology Colloquium Series", "Economic Sociology Seminar"). These are typically 1-2 hour internal presentations for local faculty/students and do not justify international travel.
     - Skip guest lectures (single-speaker talks, guest talks) by a visiting professor.
     - Skip lightning talks, PhD presentations, and student project showcases.
     - Skip minor administrative meetings, career fairs, or undergraduate club events.
     
   * CRITICAL ACCEPTANCE RULES (ACCEPT / EXTRACT):
     - Accept major conferences, world congresses, symposia, or annual meetings that run for multiple days and bring in a large international audience.
     - Accept specialized academic workshops that invite paper/abstract submissions (Call for Papers / CFP) from the general public.
     - Accept summer schools, winter schools, or doctoral schools that have an application process, admission requirements, and ideally travel support/grants.
     - The event must have a formal registration or submission pathway for external academics.

3. For each accepted event, extract details matching the requested JSON schema.
- For date/deadline, use YYYY-MM-DD format (if only year/month is known or not specified, use empty or "Tarih belirlenmedi").
- Create a short slugified ID (e.g. 'inas-2026') based on the event title.
- Set `type` to 'konferans', 'atölye', or 'yaz-okulu'.
- Include tags in both Turkish (tags) and English (tagsEn).
- Provide details object containing:
  - summary: both tr and en leads and body texts.
  - dates: timeline of important dates.
  - fees: tr and en fees lists, and footnote.
  - grants: financial aid/travel support (if mentioned, otherwise empty).
  - conditions: rules, submission limitations.

Output the final result as a JSON object containing a list of events:
{{
  "events": [
    {{
      "id": "slugified-id-2026",
      "type": "konferans" | "atölye" | "yaz-okulu",
      "title": "string",
      "organizer": "string",
      "domain": "string",
      "link": "string",
      "location": "string",
      "locationEn": "string",
      "region": "string",
      "regionEn": "string",
      "tagsEn": ["string"],
      "tags": ["string"],
      "date": "YYYY-MM-DD",
      "deadline": "YYYY-MM-DD",
      "grants": boolean,
      "details": {{
        "type": "custom",
        "summary": {{
          "tr": {{ "lead": "string", "text": "string" }},
          "en": {{ "lead": "string", "text": "string" }}
        }},
        "dates": [
          {{ "date": "YYYY-MM-DD", "tr": {{ "title": "string", "desc": "string" }}, "en": {{ "title": "string", "desc": "string" }}, "passed": boolean }}
        ],
        "fees": {{
          "tr": [ {{ "cat": "string", "early": "string", "late": "string" }} ],
          "en": [ {{ "cat": "string", "early": "string", "late": "string" }} ],
          "footnote": {{ "tr": "string", "en": "string" }}
        }},
        "grants": [
          {{ "tr": {{ "title": "string", "desc": "string" }}, "en": {{ "title": "string", "desc": "string" }} }}
        ],
        "conditions": [
          {{ "tr": {{ "title": "string", "desc": "string" }}, "en": {{ "title": "string", "desc": "string" }} }}
        ]
      }}
    }}
  ]
}}
"""

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    import time
    max_retries = 3
    for attempt in range(max_retries):
        try:
            res = requests.post(endpoint, json=payload, headers=headers, timeout=60)
            if res.status_code == 200:
                raw_data = res.json()
                txt_response = raw_data['candidates'][0]['content']['parts'][0]['text']
                parsed_json = json.loads(txt_response)
                return parsed_json.get("events", [])
            elif res.status_code == 429:
                print(f"[-] Gemini API 429 error (Rate limit exceeded) on attempt {attempt+1}/{max_retries}. Sleeping 15s...")
                time.sleep(15)
            elif res.status_code == 503:
                print(f"[-] Gemini API 503 error (High demand) on attempt {attempt+1}/{max_retries}. Retrying in 10s...")
                time.sleep(10)
            else:
                print(f"[-] Gemini API error: {res.status_code} - {res.text} on attempt {attempt+1}/{max_retries}. Retrying in 5s...")
                time.sleep(5)
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            print(f"[-] Gemini API timeout/connection error on attempt {attempt+1}/{max_retries}: {e}. Retrying in 10s...")
            time.sleep(10)
        except Exception as e:
            print(f"[-] Unexpected exception during Gemini API call: {e}")
            break
            
    print("[-] Max retries reached for Gemini API call. Returning empty list.")
    return []

def detect_deltas(new_events, snapshot_file):
    """Compares new events with existing snapshots to detect changes."""
    print("[*] Performing delta comparison...")
    if not os.path.exists(snapshot_file):
        print("[+] No previous snapshots found. All events are new.")
        return new_events

    try:
        with open(snapshot_file, 'r', encoding='utf-8') as f:
            old_data = json.load(f)
    except Exception as e:
        print(f"[-] Error reading snapshot file: {e}")
        old_data = {}

    updated_events = {}
    for ev_id, ev in new_events.items():
        if ev_id in old_data:
            old_ev = old_data[ev_id]
            changes = []
            
            # Check deadline change
            if ev.get("deadline") != old_ev.get("deadline"):
                changes.append(f"Deadline: {old_ev.get('deadline')} -> {ev.get('deadline')}")
            # Check event date change
            if ev.get("date") != old_ev.get("date"):
                changes.append(f"Event Date: {old_ev.get('date')} -> {ev.get('date')}")
            # Check grants change
            if ev.get("grants") != old_ev.get("grants"):
                changes.append(f"Grants: {old_ev.get('grants')} -> {ev.get('grants')}")
                
            if changes:
                print(f"[!] UPDATE DETECTED for '{ev['title']}':")
                for c in changes:
                    print(f"    - {c}")
                ev["changeLog"] = changes
            else:
                # Keep existing changeLog if no new changes
                if "changeLog" in old_ev:
                    ev["changeLog"] = old_ev["changeLog"]
        else:
            print(f"[+] NEW EVENT discovered: '{ev['title']}'")
            ev["changeLog"] = ["New event discovered"]
            
        updated_events[ev_id] = ev
        
    return updated_events

def main():
    print("=== Confer Scraper & Data Extractor Prototype ===")
    
    all_extracted_events = {}
    
    for target in TARGETS:
        print(f"\n[*] Fetching target: {target['name']} ({target['url']})")
        html = fetch_html(target["url"])
        if not html:
            continue
            
        title, text = extract_main_text(html)
        # Skip directories with no events
        if "No events at this time" in text:
            print("[*] Calendar is currently empty. Skipping Gemini extraction.")
            continue
            
        print(f"[*] Sending cleaned text ({len(text)} chars) to Gemini for extraction...")
        events = call_gemini_extraction(target["url"], title, text)
        print(f"[+] Gemini extracted {len(events)} events from this page.")
        
        for ev in events:
            # Set domain field automatically if empty
            if not ev.get("domain"):
                ev["domain"] = target["domain"]
            all_extracted_events[ev["id"]] = ev

    # Save and delta check
    snapshot_path = "scratch/event_snapshots.json"
    os.makedirs("scratch", exist_ok=True)
    
    # Perform delta checks
    final_events = detect_deltas(all_extracted_events, snapshot_path)
    
    # Save final snapshot
    with open(snapshot_path, "w", encoding="utf-8") as f:
        json.dump(final_events, f, ensure_ascii=False, indent=2)
        
    print(f"\n[+] Processing finished. Stored {len(final_events)} verified events in '{snapshot_path}'.")

if __name__ == "__main__":
    main()
