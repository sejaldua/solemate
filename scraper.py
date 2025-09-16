import requests
from bs4 import BeautifulSoup
import re
import json
import os
from pprint import pprint

CACHE_FILE = "shoes.json"

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    return {}

def save_cache(data):
    with open(CACHE_FILE, "w") as f:
        json.dump(data, f, indent=2)



def fetch_page(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
    }
    resp = requests.get(url, headers=headers)
    resp.raise_for_status()
    return resp.text

def parse_runrepeat_shoe(url):
    html = fetch_page(url)
    soup = BeautifulSoup(html, "html.parser")

    data = {"url": url}

    # ---------------- Title ----------------
    title_tag = soup.find("h1")
    data["title"] = title_tag.get_text(strip=True) if title_tag else None

    # ---------------- Verdict ----------------
    verdict_h2 = soup.find(lambda tag: tag.name == "h2" and "Our verdict" in tag.get_text())
    verdict_text = None
    if verdict_h2:
        verdict_texts = []
        for sib in verdict_h2.find_next_siblings():
            if sib.name and sib.name.startswith("h"):
                break
            verdict_texts.append(sib.get_text(" ", strip=True))
        verdict_text = " ".join(verdict_texts).strip()
    data["verdict"] = verdict_text

    # ---------------- Pros & Cons ----------------
    pros, cons = [], []

    pros_h3 = soup.find(lambda tag: tag.name == "h3" and "Pros" in tag.get_text())
    if pros_h3:
        ul = pros_h3.find_next_sibling("ul")
        if ul:
            pros = [li.get_text(strip=True) for li in ul.find_all("li")]

    cons_h3 = soup.find(lambda tag: tag.name == "h3" and "Cons" in tag.get_text())
    if cons_h3:
        ul = cons_h3.find_next_sibling("ul")
        if ul:
            cons = [li.get_text(strip=True) for li in ul.find_all("li")]

    data["pros"] = pros
    data["cons"] = cons

    # ---------------- Lab Test Results ----------------
    lab_data = {}
    lab_section = None
    for h in soup.find_all(["h2", "h3"]):
        if "Lab test results" in h.get_text():
            lab_section = h
            break

    if lab_section:
        for sibling in lab_section.find_next_siblings():
            if sibling.name and sibling.name.startswith("h2"):
                break
            if sibling.name == "table":
                for tr in sibling.find_all("tr"):
                    tds = tr.find_all(["td", "th"])
                    if len(tds) >= 2:
                        key = tds[0].get_text(" ", strip=True)
                        val = tds[1].get_text(" ", strip=True)
                        lab_data[key] = val
            else:
                text = sibling.get_text(" ", strip=True)
                for field in ["Heel stack", "Forefoot stack", "Drop", "Weight", "Midsole softness", "Secondary foam softness"]:
                    if field in text:
                        match = re.search(rf"{field}.*?([\d.,]+ ?[a-zA-Z%°]+)", text)
                        if match:
                            lab_data[field] = match.group(1)

    data["lab_results"] = lab_data

    # ---------------- Brand Specs ----------------
    specs = {}
    specs_section = None
    for h in soup.find_all(["h2","h3"]):
        if "Specs (brand)" in h.get_text() or "Specs" in h.get_text():
            specs_section = h
            break

    if specs_section:
        for sibling in specs_section.find_next_siblings():
            if sibling.name and sibling.name.startswith("h2"):
                break
            if sibling.name == "table":
                for tr in sibling.find_all("tr"):
                    th = tr.find("th")
                    td = tr.find("td")
                    if th and td:
                        specs[th.get_text(" ", strip=True)] = td.get_text(" ", strip=True)

    data["brand_specs"] = specs

    # ---------------- First Main Image ----------------
    first_img = None
    # Usually main shoe image has role="img" or alt with shoe name
    img_tag = soup.find_all("img", {"alt": re.compile(r".*", re.I)})[1]
    if img_tag and img_tag.get("src"):
        first_img = img_tag["src"]

    data["main_image"] = first_img

    return data


# Example usage
if __name__ == "__main__":
    # get urls for all the shoes
    catalog_url = "https://runrepeat.com/catalog/running-shoes"
    suffixes = ["", *[f"?page={i}" for i in range(2, 21)]]
    urls = []
    for suffix in suffixes:
        shoe_catalog_url = f"{catalog_url}{suffix}"
        print(shoe_catalog_url)
        html = fetch_page(shoe_catalog_url)
        soup = BeautifulSoup(html, "html.parser")
        for shoe in soup.find_all('div', class_="product-name"):
            urls.append(f"https://runrepeat.com/{shoe.find('a').get('href')}")
    print("Scraped all shoe urls... found", len(urls), "pages")


    cache = load_cache()

    for url in urls:
        if url not in cache:  # scrape only if not already saved
            cache[url] = parse_runrepeat_shoe(url)
            print(f"Scraped {url}")
        else:
            print(f"Loaded from cache: {url}")

    save_cache(cache)

    # Now you can access all data without re-scraping
    # pprint(cache)


