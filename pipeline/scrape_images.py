"""
Scrape actual shoe product images from RunRepeat using og:image meta tags.
Updates the main_image field in shoes.json.
"""

import json
import time
import requests
from bs4 import BeautifulSoup

RAW_FILE = "../shoes.json"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}

def get_og_image(url: str) -> str | None:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        og = soup.find("meta", property="og:image")
        if og and og.get("content"):
            img_url = og["content"]
            # Verify it's a product image, not a generic/avatar
            if "gallery/product" in img_url or "shoe" in img_url.lower():
                return img_url
            # Also accept any large CDN image that's not an expert/avatar
            if "runrepeat.com" in img_url and "expert" not in img_url:
                return img_url
        return None
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None


def main():
    with open(RAW_FILE, "r") as f:
        shoes = json.load(f)

    total = len(shoes)
    updated = 0
    skipped = 0

    for i, (name, shoe) in enumerate(shoes.items()):
        current_img = shoe.get("main_image", "")
        # Skip if already has a valid product image
        if current_img and "gallery/product" in current_img:
            skipped += 1
            continue

        url = shoe.get("url")
        if not url:
            continue

        img = get_og_image(url)
        if img:
            shoe["main_image"] = img
            updated += 1
            print(f"[{i+1}/{total}] {name}: {img}")
        else:
            print(f"[{i+1}/{total}] {name}: no image found")

        time.sleep(0.8)

        # Save periodically
        if updated % 20 == 0 and updated > 0:
            with open(RAW_FILE, "w") as f:
                json.dump(shoes, f, indent=2)
            print(f"  --- Saved ({updated} updated so far) ---")

    # Final save
    with open(RAW_FILE, "w") as f:
        json.dump(shoes, f, indent=2)

    print(f"\nDone. Updated: {updated}, Skipped (already had image): {skipped}, Total: {total}")


if __name__ == "__main__":
    main()
