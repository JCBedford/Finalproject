import csv
import json
from pathlib import Path
from statistics import mean

ROOT = Path(__file__).resolve().parents[1]
INPUT_CSV = ROOT / "crju_complete.csv"
WEB_DATA_DIR = ROOT / "web" / "data"
OUTPUT_COURSES = WEB_DATA_DIR / "courses.json"
OUTPUT_PROFESSORS = WEB_DATA_DIR / "professors.json"


def to_int(value):
  try:
    return int(str(value).strip())
  except Exception:
    return None


def to_float(value):
  try:
    return float(str(value).strip())
  except Exception:
    return None


def to_bool_has_data(value):
  return str(value).strip().lower() in {"yes", "true", "1"}


def normalize_row(row):
  return {
    "course_code": row.get("course_code", "").strip(),
    "course_name": row.get("course_name", "").strip(),
    "section": row.get("section", "").strip(),
    "format": row.get("format", "").strip(),
    "schedule": row.get("schedule", "").strip(),
    "enrollment_cap": to_int(row.get("enrollment_cap")),
    "seats_available": to_int(row.get("seats_available")),
    "professor_name": row.get("professor_name", "Unknown").strip() or "Unknown",
    "rmp_rating": to_float(row.get("rmp_rating")),
    "rmp_difficulty": to_float(row.get("rmp_difficulty")),
    "rmp_would_take_again": to_int(row.get("rmp_would_take_again")),
    "rmp_has_data": to_bool_has_data(row.get("rmp_has_data")),
  }


def build_professors(courses):
  grouped = {}
  for course in courses:
    name = course["professor_name"]
    grouped.setdefault(name, []).append(course)

  professors = []
  for name, rows in grouped.items():
    ratings = [r["rmp_rating"] for r in rows if r["rmp_rating"] is not None]
    diffs = [r["rmp_difficulty"] for r in rows if r["rmp_difficulty"] is not None]
    retakes = [r["rmp_would_take_again"] for r in rows if r["rmp_would_take_again"] is not None]
    has_data = any(r["rmp_has_data"] for r in rows)

    professors.append({
      "professor_name": name,
      "section_count": len(rows),
      "rmp_has_data": has_data,
      "rmp_rating": round(mean(ratings), 2) if ratings else None,
      "rmp_difficulty": round(mean(diffs), 2) if diffs else None,
      "rmp_would_take_again": round(mean(retakes), 1) if retakes else None,
    })

  professors.sort(key=lambda x: x["professor_name"])
  return professors


def main():
  WEB_DATA_DIR.mkdir(parents=True, exist_ok=True)

  with INPUT_CSV.open("r", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    courses = [normalize_row(row) for row in reader]

  professors = build_professors(courses)

  OUTPUT_COURSES.write_text(json.dumps(courses, indent=2), encoding="utf-8")
  OUTPUT_PROFESSORS.write_text(json.dumps(professors, indent=2), encoding="utf-8")

  print(f"Wrote {len(courses)} course rows to {OUTPUT_COURSES}")
  print(f"Wrote {len(professors)} professor rows to {OUTPUT_PROFESSORS}")


if __name__ == "__main__":
  main()
