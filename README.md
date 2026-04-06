# SoleMate

A data-driven running shoe recommendation engine built on lab-tested biomechanical data. Answer a few questions about how you run, and SoleMate scores 300+ shoes against your profile using soft archetype blending, GMM clustering, UMAP embeddings, and a similarity graph.

![Next.js](https://img.shields.io/badge/Next.js_14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikit-learn&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3dotjs&logoColor=white)

## Overview

Most shoe recommendation tools rely on brand marketing or editorial reviews. SoleMate takes a different approach: it treats shoe selection as a **nearest-neighbor search in feature space**, where each shoe is an 8-dimensional vector of lab-measured properties and each runner is a preference vector derived from their training profile.

The pipeline:

1. **Scrape** 596 shoes from RunRepeat, extracting lab-tested metrics (durometer readings, flexibility tests, energy return percentages, traction scores)
2. **Normalize** 8 numeric features via quantile transform to a uniform [0, 1] distribution, with semantic inversion where needed
3. **Expand** to 36 dimensions with pairwise interaction features, then project into 2D with UMAP
4. **Cluster** using Gaussian Mixture Models with silhouette-validated k, producing soft membership probabilities
5. **Build** a k-NN similarity graph in feature space
6. **Score** client-side using sigmoid-blended archetype weights, terrain gating, and price dampening

Everything ships as static JSON. No server, no API, no accounts.

## Feature Engineering

### Raw Data Extraction

Each shoe has up to 8 lab-measured features parsed from RunRepeat's test results:

| Feature | Raw Metric | Unit | Parsing Example |
|---------|-----------|------|-----------------|
| Weight | Lab weigh-in | grams | `"8.8 oz (249g)"` → `249.0` |
| Stack Height | Heel stack measurement | mm | `"32.7 mm"` → `32.7` |
| Drop | Heel-to-forefoot differential | mm | `"10.0 mm"` → `10.0` |
| Midsole Softness | Shore A durometer | HA | `"20.4 HA"` → `20.4` |
| Flexibility | Bending stiffness | N | `"17.7N"` → `17.7` |
| Width | Forefoot fit | mm | `"98.2 mm"` → `98.2` |
| Energy Return | Heel rebound | % | `"53.0%"` → `53.0` |
| Traction | Forefoot grip coefficient | unitless | `"0.33"` → `0.33` |

Shoes missing any of the 5 core features (weight, stack, drop, softness, flexibility) are excluded. Optional features (width, energy return, traction) are imputed with the column median.

### Normalization (Quantile Transform)

All features are transformed to a uniform [0, 1] distribution using `QuantileTransformer(output_distribution='uniform')`. This is a deliberate upgrade over min-max scaling:

- **Outlier-robust**: A single 130g racing flat or 450g trail boot won't compress the useful range for the other 300 shoes
- **Distribution-agnostic**: Weight (roughly normal), traction (bimodal), and energy return (right-skewed) all get mapped to the same uniform scale
- **Consistent distances**: A 0.1 difference means the same percentile gap on every axis, which directly improves scoring fidelity

Two features require **semantic inversion** because lower raw values represent "more" of the desirable quality:

- **Midsole Softness**: Lower HA = softer → inverted so 1.0 = plush
- **Flexibility**: Lower N = more flexible → inverted so 1.0 = flexible

After normalization, each shoe becomes a point in R^8.

## Dimensionality Reduction (UMAP)

### Polynomial Interaction Features

Before embedding, the pipeline expands the 8D feature space to 36D by adding all 28 pairwise interaction terms:

```python
PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
# 8 base features → 8 + C(8,2) = 36 dimensions
```

This captures non-linear biomechanical relationships that matter for shoe categorization:
- **weight x energy_return** — light + bouncy = racing flat
- **stack_height x midsole_softness** — tall + soft = max cushion recovery shoe
- **flexibility x weight** — stiff + heavy = stability trainer

### UMAP Projection

The 36D interaction-enriched vectors are projected to 2D using [UMAP](https://umap-learn.readthedocs.io/):

```python
UMAP(n_components=2, n_neighbors=15, min_dist=0.1, metric="euclidean", random_state=42)
```

**Why UMAP over t-SNE or PCA?**
- UMAP preserves both local and global structure better than t-SNE, so clusters that are distant in feature space remain distant in the projection
- PCA would lose too much variance in 2 components given the non-linear relationships between features
- UMAP's `min_dist=0.1` keeps nearby shoes slightly separated for cleaner hover interactions

**Why expand features before UMAP but not before clustering?**
The interaction features improve UMAP's topology (shoes with similar biomechanical profiles land closer together), but clustering stays on the interpretable 8D space so cluster centroids can be inspected and labeled by feature.

### User Position Projection

Since UMAP can't run client-side, the user's position on the map is approximated via **inverse-distance-weighted k-NN** (k=5) — find the 5 nearest shoes in feature space and take a weighted average of their 2D positions:

```
userPos = Σ (coord_i / dist_i) / Σ (1 / dist_i)    for i in k-nearest neighbors
```

## Clustering & Segmentation

### Cluster Count Discovery

The pipeline uses a two-step approach to determine the optimal number of clusters:

1. **HDBSCAN** (optional) discovers the natural number of density-based clusters. Unlike k-means, HDBSCAN doesn't assume spherical clusters of equal size and can identify noise points that don't fit any cluster cleanly.

2. **Silhouette analysis** validates the cluster count by sweeping k and measuring cohesion vs separation. The pipeline searches around HDBSCAN's estimate (or k=[3, 12] if HDBSCAN is unavailable) and picks the k with the highest silhouette score.

```
Current result: k=9 (silhouette=0.1495)
```

### Gaussian Mixture Model (Soft Clustering)

Instead of hard k-means assignments, the pipeline fits a **full-covariance GMM** on the 8D normalized features:

```python
GaussianMixture(n_components=k, covariance_type='full', n_init=5)
```

This produces **soft membership probabilities** for each shoe — a shoe can be "65% Max Cushion, 25% Daily Trainer, 10% Speed Trainer" rather than belonging to a single cluster. This is more accurate for shoes that sit at category boundaries (e.g., a cushioned racer).

The probabilities are shipped in `clusters.json` and displayed in the UI as primary + secondary cluster badges with percentages.

### Cluster Labeling

GMM component means serve as interpretable centroids. Each is labeled via a priority-ordered rule system that inspects the centroid's feature profile:

| Rule | Condition | Label |
|------|-----------|-------|
| 1 | traction > 0.6, width > 0.5 | Trail Grip Specialists |
| 2 | weight > 0.7, energy_return > 0.55 | Lightweight Racers |
| 3 | stack_height > 0.7, softness > 0.6 | Max Cushion |
| 4 | energy_return > 0.6, flexibility > 0.5 | Energy Returners |
| 5 | softness > 0.6, stack_height < 0.5 | Plush Low-Profile |
| 6 | weight > 0.55, flexibility > 0.55 | Speed Trainers |
| ... | *(additional fallback rules)* | ... |

## Similarity Graph

A **k-NN graph** (k=6) is pre-computed in 8D feature space and shipped as `graph.json`:

```python
NearestNeighbors(n_neighbors=7, metric='euclidean')  # 6 neighbors + self
```

Each shoe maps to its 6 nearest neighbors with Euclidean distances. This powers the "Similar Shoes" panel on the recommendations page — biomechanically similar shoes regardless of cluster membership or user profile.

## Scoring Algorithm

Each shoe receives a match score in [0, 1] computed as:

```
score = featureMatch × terrainGate × priceDampen
```

### Soft Archetype Blending

Instead of hard if/else archetype classification, the scoring system computes **continuous sigmoid-smoothed affinities** to each archetype:

```typescript
affinities = {
  cushion_chaser: sigmoid((mileage - 40) / 15) × sigmoid((50 - comfortSpeed) / 20),
  speed_demon:    sigmoid((7.5 - pace) / 1.5)  × sigmoid((comfortSpeed - 50) / 20),
  injury_guardian: hasInjuries ? 0.8 : 0.0,
  trail_explorer:  terrain === "trail" ? 1.0 : terrain === "mixed" ? 0.3 : 0.0,
  all_rounder:     0.2,  // baseline
}
// Normalized to sum to 1, then used to blend archetype weight vectors
```

A runner at pace 7.4 gets ~55% speed demon + ~20% cushion chaser + ... instead of flipping discretely at a threshold. The UI still shows the dominant archetype as a label, but scoring uses the full blend.

### Feature Match (Blended-Weight L1)

The blended weight vector is a weighted combination of archetype-specific feature weights:

| Archetype | High-Weight Features |
|-----------|---------------------|
| Cushion Chaser | stack_height (3x), midsole_softness (3x), energy_return (2x) |
| Speed Demon | weight (3x), energy_return (3x), flexibility (2x) |
| Injury Guardian | stack_height (2x), drop (2x), midsole_softness (2x), width (2x) |
| Trail Explorer | traction (3x), width (2x) |
| All Rounder | All features weighted equally (1x) |

The feature match score is the weighted average of per-feature similarities:

```
featureMatch = Σ w_i × (1 - |shoe_i - pref_i|) / Σ w_i
```

### Terrain Gate

A hard multiplier that penalizes terrain mismatches:

| User Terrain | Shoe Terrain | Multiplier |
|-------------|-------------|------------|
| Trail | Trail | 1.0 |
| Trail | Road | 0.3 |
| Road | Road | 1.0 |
| Road | Trail | 0.4 |
| Mixed | Any | 1.0 |

### Price Dampening

A gentle linear penalty capped at 10%:

```
priceDampen = 1.0 - 0.1 × min(price / 300, 1)
```

### Explainability

The top 3 contributing features are extracted from each score and presented as plain-English explanations (e.g., *"Energy Return: 92% match with your preference"*), making the scoring transparent.

## Evaluation Framework

The project includes an offline evaluation pipeline (`pipeline/evaluate.py`) that measures recommendation quality without real user data.

### Leave-One-Out Test

For each shoe, create a synthetic user whose preference vector equals that shoe's features. The system should rank that shoe #1. Results:

| Archetype | Hit@1 | Hit@5 | Mean Rank |
|-----------|-------|-------|-----------|
| All Rounder | 100% | 100% | 0.0 |
| Cushion Chaser | 100% | 100% | 0.0 |
| Speed Demon | 100% | 100% | 0.0 |
| Injury Guardian | 100% | 100% | 0.0 |
| Trail Explorer | 100% | 100% | 0.0 |

This validates that the scoring function has no distortions — a user who perfectly matches a shoe always gets it ranked first.

### Synthetic Ground Truth (NDCG from Expert Verdicts)

Expert verdicts and pros are mined for use-case keywords (e.g., "marathon", "plush", "trail grip") to build pseudo-relevance labels. For each use-case, a synthetic preference vector is built from the centroid of labeled shoes, then NDCG@k measures how well the system ranks relevant shoes:

| Use Case | Relevant Shoes | NDCG@10 | NDCG@20 | Precision@10 | Diversity@10 | Coverage@20 |
|----------|---------------|---------|---------|-------------|-------------|-------------|
| Stability | 142 | 0.860 | 0.764 | 80% | 0.720 | 67% |
| Cushion | 259 | 0.776 | 0.821 | 80% | 0.735 | 67% |
| Trail | 150 | 0.640 | 0.628 | 60% | 0.747 | 67% |
| Daily | 172 | 0.546 | 0.599 | 70% | 0.704 | 67% |
| Long Run | 146 | 0.211 | 0.272 | 30% | 0.699 | 67% |
| Speed | 118 | 0.136 | 0.196 | 20% | 0.669 | 67% |

Stability and cushion recommendations are strong. Speed and long-run scores indicate room for improvement in those archetype weight vectors — a natural target for learned feature weights in a future iteration.

## Rotation Optimization

The rotation builder selects a multi-shoe set (default 3) that maximizes **coverage** and minimizes **redundancy** using a greedy objective:

```
value(shoe) = 2.0 × novelty + 1.0 × diversity + 0.5 × quality
```

Where:
- **Novelty** = 1 if the shoe fills an uncovered role (daily trainer, long run, speed work, recovery, trail), 0 otherwise
- **Diversity** = mean Euclidean distance in feature space from already-selected shoes
- **Quality** = the shoe's match score

Coverage is reported as the fraction of distinct roles filled; redundancy as the mean pairwise feature-space similarity.

## Application Features

### Runner Profile Input
Interactive sliders for weekly mileage (5-100 mi), pace (5:00-13:00/mi), and comfort-vs-speed preference. Multi-select for injury history. Live archetype classification with sigmoid-blended affinities and preference vector visualization.

### Shoe Explorer
D3.js interactive scatter plot of the UMAP embedding (36D interaction-feature input). Shoes are color-coded by cluster. Hover tooltips show primary + secondary cluster with GMM probabilities. Your projected position pulses on the map with a recommendation zone highlighting the 15 nearest shoes.

### Ranked Recommendations
Scored list with per-shoe explainability breakdowns. "Similar Shoes" panel showing 6 nearest neighbors from the k-NN graph. Lazy-loaded expert verdicts, pros, and cons from lab reviews.

### Rotation Builder
Greedy-optimized 3-shoe rotation with coverage and redundancy metrics. Each shoe is assigned a role label (Daily Trainer, Speed Work, Long Run, etc.).

### Comparison Dashboard
Side-by-side spider chart overlays on all 8 features, per-feature bars with best-in-class highlighting, and a "Biggest Differences" panel.

## Tech Stack

| Layer | Tools |
|-------|-------|
| Data pipeline | Python, pandas, scikit-learn (QuantileTransformer, GaussianMixture, KMeans, NearestNeighbors), umap-learn, hdbscan |
| Evaluation | NDCG, silhouette score, leave-one-out, synthetic ground truth from NLP keyword extraction |
| Scraping | Python, BeautifulSoup, requests |
| Frontend | Next.js 14 (App Router, static export), React 18, TypeScript |
| Visualization | D3.js (d3-scale, d3-zoom, d3-selection), SVG spider charts |
| State | Zustand |
| Animation | Framer Motion |
| Styling | Tailwind CSS |
| Deployment | GitHub Pages via GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (only needed to re-run the data pipeline)

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3333/solemate](http://localhost:3333/solemate).

### Re-run the Data Pipeline

```bash
cd pipeline
pip install -r requirements.txt
python prepare_data.py
```

Reads `shoes.json` (raw scraped data) and writes to `public/data/`:

| Output File | Contents |
|-------------|----------|
| `shoes.json` | Slim shoe records (id, brand, model, normalized features, tags, image) |
| `shoes-detail.json` | Verdicts, pros, cons — lazy-loaded on demand |
| `embeddings.json` | UMAP 2D coordinates (from 36D interaction-feature input) |
| `clusters.json` | GMM assignments, soft probabilities, centroid coordinates, cluster labels |
| `graph.json` | k-NN similarity graph (6 neighbors per shoe with distances) |
| `meta.json` | Feature ranges, embedding bounds, clustering/normalization metadata |

### Run Evaluation

```bash
cd pipeline
python evaluate.py
```

Outputs leave-one-out hit rates, NDCG scores by use-case, diversity and coverage metrics. Results saved to `eval_results.json`.

### Re-scrape Shoes

```bash
python scraper.py
```

Scrapes RunRepeat and caches to `shoes.json`. Then re-run the pipeline.

## Project Structure

```
solemate/
├── pipeline/               # Offline data science pipeline
│   ├── prepare_data.py     #   Parse → quantile normalize → poly expand → UMAP → HDBSCAN → GMM → k-NN graph
│   ├── evaluate.py         #   Leave-one-out, NDCG, diversity, coverage evaluation
│   ├── scrape_images.py    #   Download shoe images
│   └── requirements.txt    #   pandas, scikit-learn, umap-learn, hdbscan, numpy
├── utils/                  # Client-side algorithms
│   ├── scoring.ts          #   Blended-weight L1 scoring
│   ├── archetype.ts        #   Sigmoid-blended archetype affinities → preference vector
│   ├── rotation.ts         #   Greedy rotation optimization
│   ├── projector.ts        #   IDW k-NN projection into UMAP space
│   └── constants.ts        #   Colors, nav config, injury options
├── app/                    # Next.js pages
│   ├── page.tsx            #   Landing
│   ├── input/page.tsx      #   Runner profile input
│   ├── explore/page.tsx    #   UMAP shoe map
│   ├── recommendations/    #   Scored rankings + similar shoes
│   ├── rotation/page.tsx   #   Multi-shoe rotation builder
│   └── compare/page.tsx    #   Side-by-side comparison
├── components/             # React components
├── hooks/                  # Data fetching & state hooks
├── types/                  # TypeScript interfaces
├── public/data/            # Pre-computed pipeline output (JSON)
├── scraper.py              # RunRepeat web scraper
└── shoes.json              # Raw scraped data (596 shoes)
```

## Build & Deploy

```bash
npm run build    # Static export to out/
```

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys to GitHub Pages automatically.

## License

MIT
