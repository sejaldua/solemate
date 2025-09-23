import pandas as pd
import streamlit as st 
import json
from pprint import pprint

names, img_urls = [], []
shoes = json.load(open('shoes.json', 'r'))
for key in shoes.keys():
    shoe = shoes[key]
    names.append(shoe['name'])
    # shoe['price'] = float(shoe['price'].replace('$', '').replace(',', ''))
    # shoe['release_date'] = pd.to_datetime(shoe['release_date'])
    img_urls.append(shoe['main_image'])

# render each shoe image as a gallery in Streamlit
def render_gallery(image_urls, names):
    cols = st.columns(3)
    for i, url in enumerate(image_urls):
        with cols[i % 3]:
            st.caption(names[i])
            st.image(url, use_container_width=True)
            

render_gallery(img_urls, names)