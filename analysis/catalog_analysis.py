"""
FrogPath – Course Catalog Analysis
===================================
Loads the TCU course catalog CSV, cleans it, identifies:
  - Courses offered only in one semester (bottlenecks)
  - Courses that are typically full (high demand)
  - Prerequisite chain depth per course

Outputs written to outputs/:
    course_catalog.json        – cleaned row-level course data
    course_bottlenecks.json    – courses offered once/year or typically full
"""

import os
import json
import pandas as pd

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR  = os.path.join(BASE_DIR, "data", "raw")
OUT_DIR   = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUT_DIR, exist_ok=True)

CATALOG_CSV = os.path.join(DATA_DIR, "tcu_course_catalog_sample.csv")


def load_catalog(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    df["course_number"]    = df["course_number"].str.strip()
    df["course_title"]     = df["course_title"].str.strip()
    df["department"]       = df["department"].str.strip()
    df["semester_offered"] = df["semester_offered"].str.strip()
    df["prerequisite"]     = df["prerequisite"].fillna("None").str.strip()
    df["typically_full"]   = df["typically_full"].str.strip()
    return df


def identify_bottlenecks(df: pd.DataFrame) -> pd.DataFrame:
    """
    A bottleneck is a course that:
      - is offered only once per year (not in both Fall & Spring), OR
      - is typically full
    """
    both_semesters = df["semester_offered"].str.contains(",", na=False)
    bottleneck = df[~both_semesters | (df["typically_full"] == "Yes")].copy()
    return bottleneck.reset_index(drop=True)


def save_json(obj, path: str) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, indent=2)
    print(f"  Saved: {path}")


def main() -> None:
    print("=== FrogPath – Catalog Analysis ===\n")

    df = load_catalog(CATALOG_CSV)
    print(f"Loaded {len(df)} courses across {df['department'].nunique()} departments.")

    bottlenecks = identify_bottlenecks(df)
    print(f"Bottleneck courses (single-semester or typically full): {len(bottlenecks)}")

    save_json(df.to_dict(orient="records"),
              os.path.join(OUT_DIR, "course_catalog.json"))
    save_json(bottlenecks.to_dict(orient="records"),
              os.path.join(OUT_DIR, "course_bottlenecks.json"))

    print("\n=== Catalog analysis complete ===")


if __name__ == "__main__":
    main()
