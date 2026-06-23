import requests
from bs4 import BeautifulSoup

url = "https://www.earthsystemgovernance.org/2026-bath/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

try:
    res = requests.get(url, headers=headers, timeout=10)
    print("Status Code:", res.status_code)
    if res.status_code == 200:
        soup = BeautifulSoup(res.text, "html.parser")
        text = soup.get_text("\n")
        lines = (line.strip() for line in text.splitlines())
        clean_text = "\n".join(l for l in lines if l)
        print("Total text length:", len(clean_text))
        print("First 1500 chars:")
        print(clean_text[:1500])
except Exception as e:
    print("Error:", e)
