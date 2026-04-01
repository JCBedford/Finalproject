"""
FrogPath – Rate My Professor Data Loading & Exploration
========================================================
Loads the RMP CSV, cleans it, and produces summary statistics
and visualisations used by the web front-end.

Run directly:
    python analysis/rmp_analysis.py

Outputs written to outputs/:
    rmp_clean.json               – cleaned row-level data
    dept_avg_ratings.json        – average ratings per department
    dept_avg_difficulty.json     – average difficulty per department
    rated_vs_unrated.json        – counts for coverage pie chart
    figures/rating_dist.png      – rating distribution histogram
    figures/dept_ratings.png     – bar chart of avg ratings by dept
    figures/dept_difficulty.png  – bar chart of avg difficulty by dept
"""

import os
import json
import pandas as pd
import matplotlib
matplotlib.use("Agg")           # headless rendering for CI / scripts
import matplotlib.pyplot as plt

# ── Paths ──────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR   = os.path.join(BASE_DIR, "data", "raw")
OUT_DIR    = os.path.join(BASE_DIR, "outputs")
FIG_DIR    = os.path.join(OUT_DIR, "figures")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(FIG_DIR, exist_ok=True)

RMP_CSV  = os.path.join(DATA_DIR, "rmp_tcu_sample.csv")
DEPT_CSV = os.path.join(DATA_DIR, "tcu_course_catalog_sample.csv")


# ── 1. Load ─────────────────────────────────────────────────────────────────
def load_data(rmp_path: str, dept_path: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Load raw CSVs and return (rmp_df, catalog_df)."""
    rmp     = pd.read_csv(rmp_path)
    catalog = pd.read_csv(dept_path)
    return rmp, catalog


# ── 2. Clean ────────────────────────────────────────────────────────────────
def clean_rmp(df: pd.DataFrame) -> pd.DataFrame:
    """Standardise column names, cast types, drop bad rows."""
    df = df.copy()

    # normalise column names
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    # expected columns after normalisation
    numeric_cols = ["overall_rating", "difficulty", "num_ratings", "would_take_again"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # drop rows missing the core fields
    df.dropna(subset=["professor_name", "department", "overall_rating"], inplace=True)

    # strip whitespace from string columns
    str_cols = ["professor_name", "department"]
    for col in str_cols:
        if col in df.columns:
            df[col] = df[col].str.strip()

    # ratings must be in [0, 5]; difficulty in [0, 5]
    df = df[(df["overall_rating"].between(0, 5)) &
            (df["difficulty"].between(0, 5))]

    df.reset_index(drop=True, inplace=True)
    return df


# ── 3. Summaries ─────────────────────────────────────────────────────────────
def dept_avg_ratings(df: pd.DataFrame) -> pd.DataFrame:
    return (df.groupby("department")["overall_rating"]
              .agg(avg_rating="mean", count="count")
              .round(2)
              .reset_index()
              .sort_values("avg_rating", ascending=False))


def dept_avg_difficulty(df: pd.DataFrame) -> pd.DataFrame:
    return (df.groupby("department")["difficulty"]
              .agg(avg_difficulty="mean", count="count")
              .round(2)
              .reset_index()
              .sort_values("avg_difficulty", ascending=False))


def rated_vs_unrated(rmp_df: pd.DataFrame, catalog_df: pd.DataFrame) -> dict:
    """
    Compare unique instructor names in the catalog to those found in RMP.
    The catalog does not have an instructor column; use department-level
    coverage instead (departments present in RMP vs. all departments).
    """
    catalog_depts = set(catalog_df["department"].str.strip().unique())
    rmp_depts     = set(rmp_df["department"].str.strip().unique())
    covered       = catalog_depts & rmp_depts
    uncovered     = catalog_depts - rmp_depts

    rated_profs   = int(rmp_df["professor_name"].nunique())
    return {
        "rated_professors":   rated_profs,
        "departments_covered":   len(covered),
        "departments_uncovered": len(uncovered),
        "covered_list":   sorted(covered),
        "uncovered_list": sorted(uncovered),
    }


# ── 4. Visualisations ────────────────────────────────────────────────────────
def plot_rating_distribution(df: pd.DataFrame, out_path: str) -> None:
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.hist(df["overall_rating"], bins=20, color="#4e2a84", edgecolor="white")
    ax.set_title("Distribution of Overall Ratings – TCU Instructors (RMP)", fontsize=14)
    ax.set_xlabel("Overall Rating (1–5)", fontsize=12)
    ax.set_ylabel("Number of Professors", fontsize=12)
    ax.axvline(df["overall_rating"].mean(), color="#a3c4f3", linestyle="--",
               label=f"Mean: {df['overall_rating'].mean():.2f}")
    ax.legend()
    plt.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)
    print(f"  Saved: {out_path}")


def plot_dept_ratings(summary: pd.DataFrame, out_path: str) -> None:
    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.barh(summary["department"], summary["avg_rating"],
                   color="#4e2a84", edgecolor="white")
    ax.set_title("Average Overall Rating by Department", fontsize=14)
    ax.set_xlabel("Average Rating (1–5)", fontsize=12)
    ax.set_xlim(0, 5)
    for bar, val in zip(bars, summary["avg_rating"]):
        ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height() / 2,
                f"{val:.2f}", va="center", fontsize=9)
    plt.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)
    print(f"  Saved: {out_path}")


def plot_dept_difficulty(summary: pd.DataFrame, out_path: str) -> None:
    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.barh(summary["department"], summary["avg_difficulty"],
                   color="#a3c4f3", edgecolor="white")
    ax.set_title("Average Difficulty Score by Department", fontsize=14)
    ax.set_xlabel("Average Difficulty (1–5)", fontsize=12)
    ax.set_xlim(0, 5)
    for bar, val in zip(bars, summary["avg_difficulty"]):
        ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height() / 2,
                f"{val:.2f}", va="center", fontsize=9)
    plt.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)
    print(f"  Saved: {out_path}")


# ── 5. Export JSON ────────────────────────────────────────────────────────────
def save_json(obj, path: str) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2)
    print(f"  Saved: {path}")


# ── Main ──────────────────────────────────────────────────────────────────────
def main() -> None:
    print("=== FrogPath – RMP Analysis ===\n")

    # Load
    print("1. Loading data …")
    rmp_raw, catalog = load_data(RMP_CSV, DEPT_CSV)
    print(f"   RMP rows: {len(rmp_raw)}  |  Catalog rows: {len(catalog)}")

    # Clean
    print("\n2. Cleaning RMP data …")
    rmp = clean_rmp(rmp_raw)
    print(f"   Rows after cleaning: {len(rmp)}")
    print(rmp.describe())

    # Summaries
    print("\n3. Computing summaries …")
    ratings_by_dept    = dept_avg_ratings(rmp)
    difficulty_by_dept = dept_avg_difficulty(rmp)
    coverage           = rated_vs_unrated(rmp, catalog)

    print("\nRatings by department:")
    print(ratings_by_dept.to_string(index=False))
    print("\nDifficulty by department:")
    print(difficulty_by_dept.to_string(index=False))
    print("\nCoverage summary:")
    for k, v in coverage.items():
        print(f"  {k}: {v}")

    # Visualisations
    print("\n4. Generating visualisations …")
    plot_rating_distribution(rmp,
        os.path.join(FIG_DIR, "rating_dist.png"))
    plot_dept_ratings(ratings_by_dept,
        os.path.join(FIG_DIR, "dept_ratings.png"))
    plot_dept_difficulty(difficulty_by_dept,
        os.path.join(FIG_DIR, "dept_difficulty.png"))

    # Export JSON
    print("\n5. Exporting JSON outputs …")
    save_json(rmp.to_dict(orient="records"),
              os.path.join(OUT_DIR, "rmp_clean.json"))
    save_json(ratings_by_dept.to_dict(orient="records"),
              os.path.join(OUT_DIR, "dept_avg_ratings.json"))
    save_json(difficulty_by_dept.to_dict(orient="records"),
              os.path.join(OUT_DIR, "dept_avg_difficulty.json"))
    save_json(coverage,
              os.path.join(OUT_DIR, "rated_vs_unrated.json"))

    print("\n=== Analysis complete ===")


if __name__ == "__main__":
    main()
