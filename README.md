# 🐸 FrogPath – TCU Degree Planning Tool

**FrogPath** is a data-driven degree planning tool for TCU (Texas Christian University) students, built as a Digital Culture and Data Analytics capstone project.

It combines two datasets—the TCU course catalog and Rate My Professor instructor data—to surface course availability patterns, prerequisite bottlenecks, professor ratings, and RMP coverage gaps through a clean, interactive web interface.

---

## Project Structure

```
Finalproject/
├── data/
│   ├── raw/
│   │   ├── rmp_tcu_sample.csv              ← RMP data for TCU instructors
│   │   └── tcu_course_catalog_sample.csv   ← TCU course catalog
│   └── processed/                          ← cleaned intermediate files
│
├── analysis/
│   ├── rmp_analysis.py          ← standalone script: RMP loading, cleaning & viz
│   ├── catalog_analysis.py      ← standalone script: course catalog analysis
│   └── rmp_exploration.ipynb    ← Jupyter notebook walkthrough
│
├── outputs/                     ← JSON files consumed by the web app
│   ├── rmp_clean.json
│   ├── dept_avg_ratings.json
│   ├── dept_avg_difficulty.json
│   ├── rated_vs_unrated.json
│   ├── course_catalog.json
│   ├── course_bottlenecks.json
│   └── figures/                 ← saved chart images (PNG)
│
└── web/                         ← GitHub Pages front-end
    ├── index.html
    ├── pages/
    │   ├── degree-planner.html
    │   ├── course-explorer.html
    │   └── professor-explorer.html
    ├── scripts/
    │   ├── nav.js
    │   ├── home.js
    │   ├── degree-planner.js
    │   ├── course-explorer.js
    │   └── professor-explorer.js
    ├── styles/main.css
    └── data/
        ├── courses.json
        └── professors.json
```

---

## Getting Started

### 1 · Install Python dependencies

```bash
pip install -r requirements.txt
```

### 2 · Run the analysis scripts

```bash
# RMP analysis (produces rmp_clean.json, dept_avg_*.json, rated_vs_unrated.json, figures/)
python analysis/rmp_analysis.py

# Course catalog analysis (produces course_catalog.json, course_bottlenecks.json)
python analysis/catalog_analysis.py
```

Or open the interactive notebook:

```bash
jupyter lab analysis/rmp_exploration.ipynb
```

### 3 · View the web app locally

Open `web/index.html` in your browser, **or** serve the repo root with a simple HTTP server so the JSON files are reachable:

```bash
python -m http.server 8000
# then open http://localhost:8000/web/
```

### 4 · Deploy to GitHub Pages

GitHub Pages must publish from wherever `index.html` lives.

- If your Pages settings allow selecting a folder, set it to `web/`.
- If your Pages settings only support root or `docs/`, move the contents of `web/` to repo root (or into `docs/`) so Pages can find `index.html`.

If Pages is pointing at repo root while `index.html` is still inside `web/`, your site URL will not load the app correctly.

---

## Data Sources

| Dataset | Description |
|---------|-------------|
| `rmp_tcu_sample.csv` | Rate My Professor entries for TCU instructors (sample) |
| `tcu_course_catalog_sample.csv` | TCU course catalog with scheduling & prerequisite info (sample) |

> **Note:** The CSVs in `data/raw/` are sample/template files. Replace them with the real datasets and re-run the analysis scripts to generate updated JSON outputs.

---

## Analysis Overview

| Script / Notebook | What it produces |
|-------------------|-----------------|
| `rmp_analysis.py` | Rating distributions, dept averages, RMP coverage stats |
| `catalog_analysis.py` | Course bottlenecks (single-semester or typically full) |
| `rmp_exploration.ipynb` | Interactive walkthrough of the full RMP pipeline |

---

## Tech Stack

- **Python 3** – pandas, matplotlib, Jupyter
- **JavaScript** – vanilla JS + [Chart.js](https://www.chartjs.org/)
- **HTML / CSS** – static site, no build step
- **Hosting** – GitHub Pages

---

*TCU DCDA Capstone · Go Frogs! 🐸*
