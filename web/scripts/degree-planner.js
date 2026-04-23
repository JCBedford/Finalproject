const STORAGE_KEY = "frogpath.degreePlanner.v2";
const STUDENT_NAME_KEY = "frogpath.degreePlanner.studentName";
const INTERESTS_KEY = "frogpath.degreePlanner.interests";
const SETTINGS_KEY = "frogpath.degreePlanner.recommendationSettings";
const COURSE_TERMS_KEY = "frogpath.degreePlanner.courseTerms";
const TOTAL_MAJOR_HOURS = 120;
const TOTAL_MINOR_HOURS = 18;
const VIEW_MAJOR = "major";
const VIEW_MINOR = "minor";
const JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
const AUTOTABLE_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.4/jspdf.plugin.autotable.min.js";

const INTEREST_OPTIONS = [
  { id: "policing", label: "Policing", keywords: ["police", "policing", "enforcement"], preferredCourses: ["CRJU30613", "CRJU30633", "CRJU30653", "CRJU30623"] },
  { id: "law", label: "Law and Courts", keywords: ["law", "court", "judicial", "constitutional"], preferredCourses: ["CRJU30423", "CRJU30433", "CRJU30553", "CRJU30863"] },
  { id: "corrections", label: "Corrections", keywords: ["corrections", "institutional", "community"], preferredCourses: ["CRJU30383", "CRJU30643"] },
  { id: "forensics", label: "Forensics", keywords: ["crime scene", "criminalistics", "investigation"], preferredCourses: ["CRJU30523", "CRJU30543", "CRJU40903"] },
  { id: "cyber", label: "Cybercrime", keywords: ["cyber", "technology", "mapping"], preferredCourses: ["CRJU30623", "CRJU30703", "CRJU40403"] },
  { id: "youth", label: "Youth and Juvenile", keywords: ["juvenile", "youth", "offenders"], preferredCourses: ["CRJU30453", "CRJU40473"] },
  { id: "equity", label: "Equity and Society", keywords: ["race", "ethnicity", "multicultural", "victim", "social"], preferredCourses: ["CRJU30853", "CRJU40853", "CRJU30803", "CRJU30913"] },
  { id: "theory", label: "Theory and Research", keywords: ["theory", "research", "data", "analysis"], preferredCourses: ["CRJU30333", "CRJU20873", "CRJU20883", "CRJU30983"] }
];

const DEFAULT_SETTINGS = {
  targetHours: 15,
  format: "",
  openSeatsOnly: true,
  noEvening: false
};

const plannerModel = {
  required: [
    { id: "CRJU10121", code: "CRJU 10121", title: "Career Planning, Ethics and Professional Development", hours: 1 },
    { id: "CRJU20413", code: "CRJU 20413", title: "Introduction to Criminal Justice", hours: 3 },
    { id: "CRJU20423", code: "CRJU 20423", title: "Critical Issues in Crime and Justice", hours: 3 },
    { id: "CRJU20873", code: "CRJU 20873", title: "Research Design", hours: 3 },
    { id: "CRJU20883", code: "CRJU 20883", title: "Data Analyses", hours: 3 },
    { id: "CRJU30333", code: "CRJU 30333", title: "Criminological Theory", hours: 3 },
    { id: "CRJU30423", code: "CRJU 30423", title: "Courts and Judicial Procedure", hours: 3 },
    { id: "CRJU40963", code: "CRJU 40963", title: "Internship in Criminal Justice", hours: 3 }
  ],
  distribution: {
    lawEnforcement: {
      label: "Law Enforcement (choose 1)",
      options: [
        { id: "CRJU30613", code: "CRJU 30613", title: "Police in a Free Society", hours: 3 },
        { id: "CRJU30633", code: "CRJU 30633", title: "Federal Law Enforcement", hours: 3 },
        { id: "CRJU30653", code: "CRJU 30653", title: "Controversial Issues in Policing", hours: 3 }
      ]
    },
    law: {
      label: "Law (choose 1)",
      options: [
        { id: "CRJU30433", code: "CRJU 30433", title: "Criminal Law", hours: 3 },
        { id: "CRJU30553", code: "CRJU 30553", title: "Constitutional Law for Criminal Justice", hours: 3 },
        { id: "CRJU30863", code: "CRJU 30863", title: "Law Justice and Social Control", hours: 3 }
      ]
    },
    corrections: {
      label: "Corrections (choose 1)",
      options: [
        { id: "CRJU30383", code: "CRJU 30383", title: "Institutional Corrections", hours: 3 },
        { id: "CRJU30643", code: "CRJU 30643", title: "Community Corrections", hours: 3 }
      ]
    },
    diversity: {
      label: "Diversity (choose 1)",
      options: [
        { id: "CRJU30853", code: "CRJU 30853", title: "Multiculturalism in the Criminal Justice System", hours: 3 },
        { id: "CRJU40473", code: "CRJU 40473", title: "Youthful Offenders", hours: 3 },
        { id: "CRJU40853", code: "CRJU 40853", title: "Race Ethnicity and Crime", hours: 3 }
      ]
    }
  },
  electives: [
    { id: "CRJU30223", code: "CRJU 30223", title: "Contemporary Topics in Criminal Justice", hours: 3 },
    { id: "CRJU30453", code: "CRJU 30453", title: "Juvenile Justice", hours: 3 },
    { id: "CRJU30523", code: "CRJU 30523", title: "Crime Scene Investigation", hours: 3 },
    { id: "CRJU30543", code: "CRJU 30543", title: "Criminalistics", hours: 3 },
    { id: "CRJU30623", code: "CRJU 30623", title: "Policing Cyberspace", hours: 3 },
    { id: "CRJU30703", code: "CRJU 30703", title: "Crime Mapping", hours: 3 },
    { id: "CRJU30803", code: "CRJU 30803", title: "Victimology", hours: 3 },
    { id: "CRJU30813", code: "CRJU 30813", title: "Sex Crimes", hours: 3 },
    { id: "CRJU30823", code: "CRJU 30823", title: "Criminal Violence", hours: 3 },
    { id: "CRJU30883", code: "CRJU 30883", title: "Crime and Justice in Scandinavia", hours: 3 },
    { id: "CRJU30913", code: "CRJU 30913", title: "Social Psychology of Crime", hours: 3 },
    { id: "CRJU30923", code: "CRJU 30923", title: "Organized Crime", hours: 3 },
    { id: "CRJU30933", code: "CRJU 30933", title: "Crime and the Media", hours: 3 },
    { id: "CRJU30973", code: "CRJU 30973", title: "Victimless Crime", hours: 3 },
    { id: "CRJU30983", code: "CRJU 30983", title: "Wrongful Convictions", hours: 3 },
    { id: "CRJU40403", code: "CRJU 40403", title: "Cyber Crime", hours: 3 },
    { id: "CRJU40503", code: "CRJU 40503", title: "White Collar Crime", hours: 3 },
    { id: "CRJU40613", code: "CRJU 40613", title: "Terrorism and Homeland Security", hours: 3 },
    { id: "CRJU40903", code: "CRJU 40903", title: "Ethics in Criminal Justice", hours: 3 }
  ],
  core: [
    { id: "CORE_FINE_ARTS", title: "Fine Arts", hours: 3, group: "Critical and Creative Thinking" },
    { id: "CORE_HUMANITIES", title: "Humanities", hours: 9, group: "Critical and Creative Thinking" },
    { id: "CORE_SOC_SCI", title: "Social Sciences", hours: 9, group: "Critical and Creative Thinking" },
    { id: "CORE_HIST_TRAD", title: "Historical Traditions", hours: 3, group: "Critical and Creative Thinking" },
    { id: "CORE_LIT_TRAD", title: "Literary Traditions", hours: 3, group: "Critical and Creative Thinking" },
    { id: "CORE_REL_TRAD", title: "Religious Traditions", hours: 3, group: "Critical and Creative Thinking" },
    { id: "CORE_MATH", title: "Mathematics", hours: 3, group: "Quantitative and Scientific Reasoning" },
    { id: "CORE_NAT_SCI", title: "Natural Sciences", hours: 6, group: "Quantitative and Scientific Reasoning" },
    { id: "CORE_ORAL", title: "Oral Communications", hours: 3, group: "Communication" },
    { id: "CORE_WRITE1", title: "Written Communication I", hours: 3, group: "Communication" },
    { id: "CORE_WRITE2", title: "Written Communication II", hours: 3, group: "Communication" },
    { id: "CORE_WRITE_EMP", title: "Writing Emphasis", hours: 6, group: "Communication" },
    { id: "CORE_CULT_AWARE", title: "Cultural Awareness", hours: 3, group: "Responsible Citizenship" },
    { id: "CORE_GLOBAL", title: "Global Awareness", hours: 3, group: "Responsible Citizenship" },
    { id: "CORE_CITIZEN", title: "Citizenship and Social Values", hours: 3, group: "Responsible Citizenship" }
  ],
  freeElectives: { id: "FREE_ELECTIVES", title: "Free Electives to 120 Hours", hours: 38 }
};

const sharedCourseIds = new Set([
  "CRJU20413",
  "CRJU30333",
  ...plannerModel.electives.map((item) => item.id)
]);

const plannerState = loadPlannerState();
let courseCatalog = [];
let dataLoadedAt = null;
let dataLastModified = "";
let pdfLibraryPromise = null;
let referenceDataPromise = loadReferenceData();

function createEmptyState() {
  return {
    activeView: VIEW_MAJOR,
    major: {},
    minor: {}
  };
}

function normalizeSelectionMap(map) {
  const normalized = {};
  if (!map || typeof map !== "object") {
    return normalized;
  }

  Object.entries(map).forEach(([key, value]) => {
    if (value) {
      normalized[key] = true;
    }
  });

  return normalized;
}

function mirrorSharedSelections(state) {
  sharedCourseIds.forEach((courseId) => {
    const checked = !!state.major[courseId] || !!state.minor[courseId];
    if (checked) {
      state.major[courseId] = true;
      state.minor[courseId] = true;
    } else {
      delete state.major[courseId];
      delete state.minor[courseId];
    }
  });
}

function loadPlannerState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!raw || typeof raw !== "object") {
      return createEmptyState();
    }

    if (raw.major || raw.minor || raw.activeView) {
      const state = createEmptyState();
      state.activeView = raw.activeView === VIEW_MINOR ? VIEW_MINOR : VIEW_MAJOR;
      state.major = normalizeSelectionMap(raw.major);
      state.minor = normalizeSelectionMap(raw.minor);
      mirrorSharedSelections(state);
      return state;
    }

    const legacy = createEmptyState();
    legacy.major = normalizeSelectionMap(raw);
    mirrorSharedSelections(legacy);
    return legacy;
  } catch (error) {
    return createEmptyState();
  }
}

function savePlannerState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerState));
}

function getStudentName() {
  return localStorage.getItem(STUDENT_NAME_KEY) || "";
}

function setStudentName(name) {
  localStorage.setItem(STUDENT_NAME_KEY, name);
}

function getSelectedInterests() {
  try {
    const raw = JSON.parse(localStorage.getItem(INTERESTS_KEY) || "[]");
    if (!Array.isArray(raw)) {
      return [];
    }

    const validIds = new Set(INTEREST_OPTIONS.map((option) => option.id));
    return raw.filter((id) => validIds.has(id));
  } catch (error) {
    return [];
  }
}

function setSelectedInterests(interestIds) {
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(interestIds));
}

function getRecommendationSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
    if (!raw || typeof raw !== "object") {
      return { ...DEFAULT_SETTINGS };
    }

    return {
      targetHours: clampNumber(Number(raw.targetHours), 3, 18, DEFAULT_SETTINGS.targetHours),
      format: typeof raw.format === "string" ? raw.format : "",
      openSeatsOnly: raw.openSeatsOnly !== false,
      noEvening: !!raw.noEvening
    };
  } catch (error) {
    return { ...DEFAULT_SETTINGS };
  }
}

function setRecommendationSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getCourseTermMap() {
  try {
    const raw = JSON.parse(localStorage.getItem(COURSE_TERMS_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch (error) {
    return {};
  }
}

function setCourseTerm(courseId, term) {
  const termMap = getCourseTermMap();
  if (!term) {
    delete termMap[courseId];
  } else {
    termMap[courseId] = term;
  }

  localStorage.setItem(COURSE_TERMS_KEY, JSON.stringify(termMap));
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, value));
}

function renderInterestOptions() {
  const host = document.getElementById("interest-options");
  const selected = new Set(getSelectedInterests());
  host.innerHTML = "";

  INTEREST_OPTIONS.forEach((option) => {
    const chip = document.createElement("label");
    chip.className = "interest-chip";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = selected.has(option.id);

    const text = document.createElement("span");
    text.textContent = option.label;

    box.addEventListener("change", () => {
      const next = new Set(getSelectedInterests());
      if (box.checked) {
        next.add(option.id);
      } else {
        next.delete(option.id);
      }

      setSelectedInterests([...next]);
      renderRecommendations();
    });

    chip.append(box, text);
    host.appendChild(chip);
  });
}

function getTermOptions() {
  const now = new Date();
  const year = now.getFullYear();
  return [
    `Spring ${year}`,
    `Summer ${year}`,
    `Fall ${year}`,
    `Spring ${year + 1}`,
    `Summer ${year + 1}`,
    `Fall ${year + 1}`
  ];
}

function getAllTrackableItems() {
  const distributionItems = Object.values(plannerModel.distribution).flatMap((category) => category.options);
  return [
    ...plannerModel.required,
    ...distributionItems,
    ...plannerModel.electives,
    ...plannerModel.core,
    plannerModel.freeElectives
  ];
}

function getActiveView() {
  return plannerState.activeView === VIEW_MINOR ? VIEW_MINOR : VIEW_MAJOR;
}

function getSelectionMap(view) {
  return view === VIEW_MINOR ? plannerState.minor : plannerState.major;
}

function getTakenCourseIds(view) {
  const selections = getSelectionMap(view);
  return new Set(
    Object.keys(selections)
      .filter((courseId) => selections[courseId] && courseId.startsWith("CRJU"))
  );
}

function isCourseChecked(courseId) {
  if (sharedCourseIds.has(courseId)) {
    return !!plannerState.major[courseId] || !!plannerState.minor[courseId];
  }

  return !!getSelectionMap(getActiveView())[courseId];
}

function setCourseSelection(courseId, checked) {
  if (sharedCourseIds.has(courseId)) {
    if (checked) {
      plannerState.major[courseId] = true;
      plannerState.minor[courseId] = true;
    } else {
      delete plannerState.major[courseId];
      delete plannerState.minor[courseId];
    }
  } else if (checked) {
    getSelectionMap(getActiveView())[courseId] = true;
  } else {
    delete getSelectionMap(getActiveView())[courseId];
  }

  savePlannerState();
  renderPlanner();
}

function getCourseLabel(item) {
  return item.code ? `${item.code} ${item.title}` : item.title;
}

function getKnownCourseHours(courseId) {
  const all = getAllTrackableItems();
  const found = all.find((item) => item.id === courseId);
  return found ? Number(found.hours || 3) : 3;
}

function isEveningSchedule(schedule) {
  const text = String(schedule || "");
  const match = text.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    return false;
  }

  const hour = Number(match[1]);
  return Number.isFinite(hour) && hour >= 17;
}

function getRequirementBoost(courseId, view) {
  if (view === VIEW_MINOR) {
    if (courseId === "CRJU20413" || courseId === "CRJU30333") {
      return plannerState.minor[courseId] ? 0 : 18;
    }

    return plannerModel.electives.some((item) => item.id === courseId) ? 10 : 0;
  }

  if (plannerModel.required.some((item) => item.id === courseId) && !plannerState.major[courseId]) {
    return 16;
  }

  if (plannerModel.electives.some((item) => item.id === courseId)) {
    const selectedElectives = plannerModel.electives.filter((item) => plannerState.major[item.id]).length;
    return selectedElectives < 3 ? 8 : 2;
  }

  if (Object.values(plannerModel.distribution).some((category) => category.options.some((item) => item.id === courseId))) {
    return 10;
  }

  return 0;
}

function computeRecommendationCandidates(view, settings) {
  const selectedInterests = getSelectedInterests();
  const interestRecords = INTEREST_OPTIONS.filter((option) => selectedInterests.includes(option.id));
  const takenCourseIds = getTakenCourseIds(view);
  const byCode = new Map();

  courseCatalog
    .filter((course) => String(course.course_code || "").startsWith("CRJU"))
    .forEach((course) => {
      const courseId = String(course.course_code).replace(/\s+/g, "");
      if (takenCourseIds.has(courseId)) {
        return;
      }

      if (settings.openSeatsOnly && Number(course.seats_available || 0) <= 0) {
        return;
      }

      if (settings.format && String(course.format) !== settings.format) {
        return;
      }

      if (settings.noEvening && isEveningSchedule(course.schedule)) {
        return;
      }

      const title = String(course.course_name || "").toLowerCase();
      const scoreParts = [];
      let score = getRequirementBoost(courseId, view);
      if (score > 0) {
        scoreParts.push("Needed requirement");
      }

      interestRecords.forEach((interest) => {
        const keywordHit = interest.keywords.some((keyword) => title.includes(keyword));
        const preferredHit = interest.preferredCourses.includes(courseId);

        if (preferredHit) {
          score += 8;
          scoreParts.push(`${interest.label} fit`);
        } else if (keywordHit) {
          score += 5;
          scoreParts.push(`${interest.label} keyword match`);
        }
      });

      const seats = Number(course.seats_available || 0);
      if (seats >= 12) {
        score += 3;
      } else if (seats >= 5) {
        score += 2;
      } else if (seats >= 1) {
        score += 1;
      }

      if (course.rmp_has_data && Number(course.rmp_rating) >= 4) {
        score += 1;
      }

      const existing = byCode.get(courseId);
      const candidate = {
        courseId,
        courseCode: course.course_code,
        courseName: course.course_name,
        professor: course.professor_name,
        schedule: course.schedule,
        format: course.format,
        seats,
        hours: getKnownCourseHours(courseId),
        score,
        reason: scoreParts.length ? scoreParts.slice(0, 2).join("; ") : "Fits selected filters"
      };

      if (!existing) {
        byCode.set(courseId, candidate);
        return;
      }

      if (candidate.score > existing.score || (candidate.score === existing.score && candidate.seats > existing.seats)) {
        byCode.set(courseId, candidate);
      }
    });

  return [...byCode.values()].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (b.seats !== a.seats) {
      return b.seats - a.seats;
    }

    return a.courseCode.localeCompare(b.courseCode);
  });
}

function pickRecommendationsForHours(candidates, targetHours) {
  const selected = [];
  let hours = 0;
  for (const candidate of candidates) {
    if (hours >= targetHours && selected.length >= 3) {
      break;
    }

    selected.push(candidate);
    hours += candidate.hours;

    if (selected.length >= 8) {
      break;
    }
  }

  return { selected, totalHours: hours };
}

function getCurrentRecommendations(view = getActiveView()) {
  const settings = getRecommendationSettings();
  const candidates = computeRecommendationCandidates(view, settings);
  const picked = pickRecommendationsForHours(candidates, settings.targetHours);
  return {
    candidates,
    selected: picked.selected,
    selectedHours: picked.totalHours,
    targetHours: settings.targetHours,
    settings
  };
}

function renderRecommendations() {
  const list = document.getElementById("recommendation-list");
  if (!list) {
    return;
  }

  const { selected, selectedHours, targetHours } = getCurrentRecommendations();
  list.innerHTML = "";

  if (selected.length === 0) {
    const empty = document.createElement("li");
    empty.className = "timeline-empty muted";
    empty.textContent = "No recommendations match your current filters. Try relaxing one filter.";
    list.appendChild(empty);
    return;
  }

  const summary = document.createElement("li");
  summary.className = "muted";
  summary.textContent = `Planned suggestion load: ${selectedHours} hours toward a ${targetHours}-hour goal.`;
  list.appendChild(summary);

  selected.forEach((item) => {
    const row = document.createElement("li");
    row.className = "recommendation-item";

    const top = document.createElement("div");
    top.className = "recommendation-top";

    const left = document.createElement("div");
    const title = document.createElement("p");
    title.className = "recommendation-title";
    title.textContent = `${item.courseCode} ${item.courseName}`;

    const meta = document.createElement("p");
    meta.className = "recommendation-meta";
    meta.textContent = `${item.professor || "TBA"} | ${item.schedule || "TBA"} | ${item.format || "TBA"} | Seats: ${item.seats}`;

    left.append(title, meta);

    const reason = document.createElement("span");
    reason.className = "reason-pill";
    reason.textContent = item.reason;

    top.append(left, reason);
    row.appendChild(top);
    list.appendChild(row);
  });
}

function renderTimeline() {
  const root = document.getElementById("timeline-root");
  if (!root) {
    return;
  }

  const view = getActiveView();
  const selections = getSelectionMap(view);
  const termMap = getCourseTermMap();
  const termOptions = getTermOptions();
  const allItems = getAllTrackableItems();
  const completedItems = allItems.filter((item) => selections[item.id]);

  root.innerHTML = "";

  if (completedItems.length === 0) {
    const p = document.createElement("p");
    p.className = "timeline-empty muted";
    p.textContent = "Mark courses as completed to assign them to a term.";
    root.appendChild(p);
    return;
  }

  completedItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "timeline-item";

    const info = document.createElement("div");
    info.innerHTML = `<strong>${item.code || item.title}</strong><div class="req-meta">${item.title}</div>`;

    const select = document.createElement("select");
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Term not set";
    select.appendChild(blank);

    termOptions.forEach((term) => {
      const opt = document.createElement("option");
      opt.value = term;
      opt.textContent = term;
      select.appendChild(opt);
    });

    select.value = termMap[item.id] || "";
    select.addEventListener("change", () => {
      setCourseTerm(item.id, select.value);
      renderRecommendations();
    });

    row.append(info, select);
    root.appendChild(row);
  });
}

function createReqItem(item, checked, onChange) {
  const label = document.createElement("label");
  label.className = "req-item";

  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = checked;

  const main = document.createElement("div");
  main.innerHTML = `<strong>${item.code || item.title}</strong><div class="req-meta">${item.title}${item.code ? "" : " requirement"}</div>`;

  const hrs = document.createElement("span");
  hrs.className = "pill";
  hrs.textContent = `${item.hours} hr`;

  box.addEventListener("change", () => onChange(box.checked));

  label.classList.toggle("done", checked);
  label.append(box, main, hrs);
  return label;
}

function section(title, subtitle) {
  const wrap = document.createElement("section");
  wrap.className = "panel req-section";

  const header = document.createElement("div");
  header.className = "req-header";
  header.innerHTML = `<h3>${title}</h3><span class="req-meta">${subtitle}</span>`;

  const list = document.createElement("div");
  list.className = "req-list";

  wrap.append(header, list);
  return { wrap, list, header };
}

function buildProgressStats(view) {
  if (view === VIEW_MINOR) {
    const completedRequired = ["CRJU20413", "CRJU30333"].reduce((total, courseId) => total + (plannerState.minor[courseId] ? 3 : 0), 0);
    const electiveCount = plannerModel.electives.filter((item) => plannerState.minor[item.id]).length;
    const completed = completedRequired + Math.min(electiveCount, 4) * 3;

    return {
      total: TOTAL_MINOR_HOURS,
      completed,
      remaining: Math.max(0, TOTAL_MINOR_HOURS - completed),
      percent: Math.min(100, (completed / TOTAL_MINOR_HOURS) * 100)
    };
  }

  let completed = 0;

  plannerModel.required.forEach((item) => {
    if (plannerState.major[item.id]) {
      completed += item.hours;
    }
  });

  Object.values(plannerModel.distribution).forEach((category) => {
    if (category.options.some((item) => plannerState.major[item.id])) {
      completed += 3;
    }
  });

  const electiveCount = plannerModel.electives.filter((item) => plannerState.major[item.id]).length;
  completed += Math.min(electiveCount, 3) * 3;

  plannerModel.core.forEach((item) => {
    if (plannerState.major[item.id]) {
      completed += item.hours;
    }
  });

  if (plannerState.major[plannerModel.freeElectives.id]) {
    completed += plannerModel.freeElectives.hours;
  }

  return {
    total: TOTAL_MAJOR_HOURS,
    completed,
    remaining: Math.max(0, TOTAL_MAJOR_HOURS - completed),
    percent: Math.min(100, (completed / TOTAL_MAJOR_HOURS) * 100)
  };
}

function updateChrome(view, progress) {
  const title = document.getElementById("planner-title");
  const summary = document.getElementById("planner-summary");
  const majorBtn = document.getElementById("major-view-btn");
  const minorBtn = document.getElementById("minor-view-btn");
  const stats = document.querySelectorAll(".stat-card");

  if (view === VIEW_MINOR) {
    title.textContent = "Criminology and Criminal Justice Minor Planner";
    summary.textContent = "Track the 18-hour Criminology and Criminal Justice minor. Shared courses stay checked when you switch back from the major.";
    stats[2].lastElementChild.textContent = "Percent to 18";
  } else {
    title.textContent = "Criminal Justice BCJ Degree Planner";
    summary.textContent = "Mark completed requirements to track progress toward 120 total semester hours. Switch to minor view to track the 18-hour Criminology and Criminal Justice minor.";
    stats[2].lastElementChild.textContent = "Percent to 120";
  }

  majorBtn.classList.toggle("active", view === VIEW_MAJOR);
  majorBtn.setAttribute("aria-pressed", view === VIEW_MAJOR ? "true" : "false");
  minorBtn.classList.toggle("active", view === VIEW_MINOR);
  minorBtn.setAttribute("aria-pressed", view === VIEW_MINOR ? "true" : "false");

  document.getElementById("hours-completed").textContent = String(progress.completed);
  document.getElementById("hours-remaining").textContent = String(progress.remaining);
  document.getElementById("hours-percent").textContent = `${progress.percent.toFixed(1)}%`;
  document.getElementById("progress-fill").style.width = `${progress.percent}%`;
  document.querySelector(".progress-shell").setAttribute("aria-label", `Progress toward ${progress.total} hours`);
}

function appendListSection(root, title, subtitle, items, options = {}) {
  const group = section(title, subtitle);

  if (options.badgeId) {
    group.header.querySelector("span").setAttribute("id", options.badgeId);
  }

  if (options.note) {
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = options.note;
    group.list.appendChild(note);
  }

  items.forEach((item) => {
    group.list.appendChild(
      createReqItem(item, isCourseChecked(item.id), (checked) => setCourseSelection(item.id, checked))
    );
  });

  root.appendChild(group.wrap);
}

function appendDistributionSection(root) {
  const distSec = section("Distribution Requirements", "12 hours total (1 course from each category)");

  Object.entries(plannerModel.distribution).forEach(([key, category]) => {
    const block = document.createElement("div");
    block.className = "panel";

    const satisfied = category.options.some((item) => plannerState.major[item.id]);
    const hdr = document.createElement("div");
    hdr.className = "req-header";
    hdr.innerHTML = `<strong>${category.label}</strong><span data-distribution-key="${key}" class="${satisfied ? "dist-satisfied" : "req-meta"}">${satisfied ? "Satisfied" : "Pick one"}</span>`;

    const list = document.createElement("div");
    list.className = "req-list";

    category.options.forEach((item) => {
      list.appendChild(
        createReqItem(item, isCourseChecked(item.id), (checked) => setCourseSelection(item.id, checked))
      );
    });

    block.append(hdr, list);
    distSec.list.appendChild(block);
  });

  root.appendChild(distSec.wrap);
}

function renderMajorView(root) {
  appendListSection(root, "Required CRJU Courses", "22 hours total", plannerModel.required);
  appendDistributionSection(root);
  appendListSection(root, "CRJU Electives", "9 hours total (choose 3 courses)", plannerModel.electives, {
    badgeId: "elective-badge"
  });
  appendListSection(root, "TCU Core Curriculum", "39 to 63 hours depending on overlap", plannerModel.core, {
    note: "Core note: No more than 4 requirements may be met in one subject area prefix (excluding Oral and Written Communication). Courses fulfilling core may also count toward major requirements."
  });
  appendListSection(root, "Free Electives", "Use electives to reach 120 total hours", [plannerModel.freeElectives]);
}

function renderMinorView(root) {
  appendListSection(root, "Minor Required Courses", "6 hours total", [
    plannerModel.required.find((item) => item.id === "CRJU20413"),
    plannerModel.required.find((item) => item.id === "CRJU30333")
  ]);

  appendListSection(root, "CRJU Electives", "12 hours total (choose 4 courses)", plannerModel.electives, {
    badgeId: "minor-elective-badge",
    note: "Shared elective selections from the major stay checked in minor view."
  });
}

function renderDataFreshness() {
  const el = document.getElementById("data-freshness");
  if (!el) {
    return;
  }

  if (!dataLoadedAt) {
    el.textContent = "Course data status: Unable to load current data.";
    return;
  }

  const loadedText = dataLoadedAt.toLocaleString();
  const lastModified = dataLastModified ? ` | Source updated: ${dataLastModified}` : "";
  el.textContent = `Course data loaded: ${loadedText}${lastModified}`;
}

function renderPlanner() {
  const root = document.getElementById("planner-root");
  const view = getActiveView();
  const progress = buildProgressStats(view);

  updateChrome(view, progress);
  root.innerHTML = "";

  if (view === VIEW_MINOR) {
    renderMinorView(root);
  } else {
    renderMajorView(root);
  }

  const electiveBadge = document.getElementById("elective-badge") || document.getElementById("minor-elective-badge");
  if (electiveBadge) {
    const selectedCount = plannerModel.electives.filter((item) => getSelectionMap(view)[item.id]).length;
    const limit = view === VIEW_MINOR ? 4 : 3;
    electiveBadge.textContent = `${Math.min(selectedCount, limit)} of ${limit} selected`;
    electiveBadge.className = selectedCount >= limit ? "dist-satisfied" : "req-meta";
  }

  renderTimeline();
  renderRecommendations();
  savePlannerState();
}

function loadScript(src) {
  if (!window.__frogpathScriptCache) {
    window.__frogpathScriptCache = {};
  }

  if (!window.__frogpathScriptCache[src]) {
    window.__frogpathScriptCache[src] = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  return window.__frogpathScriptCache[src];
}

function loadReferenceData() {
  return fetch("../data/courses.json")
    .then((response) => {
      dataLastModified = response.headers.get("last-modified") || "";
      return response.json();
    })
    .then((courses) => {
      courseCatalog = courses;
      dataLoadedAt = new Date();
      renderDataFreshness();
      renderRecommendations();
    })
    .catch(() => {
      courseCatalog = [];
      dataLoadedAt = null;
      renderDataFreshness();
    });
}

async function ensurePdfLibrariesLoaded() {
  if (!pdfLibraryPromise) {
    pdfLibraryPromise = (async () => {
      await loadScript(JSPDF_URL);
      await loadScript(AUTOTABLE_URL);
    })();
  }

  return pdfLibraryPromise;
}

function buildChecklistRows(view) {
  const rows = [];
  const checked = (courseId) => (view === VIEW_MINOR ? !!plannerState.minor[courseId] : !!plannerState.major[courseId]);

  if (view === VIEW_MINOR) {
    ["CRJU20413", "CRJU30333"].forEach((courseId) => {
      const item = plannerModel.required.find((entry) => entry.id === courseId);
      rows.push([
        "Minor Required Course",
        getCourseLabel(item),
        `${item.hours}`,
        checked(courseId) ? "[x]" : "[ ]"
      ]);
    });

    plannerModel.electives.forEach((item) => {
      rows.push([
        "Minor Elective",
        getCourseLabel(item),
        `${item.hours}`,
        checked(item.id) ? "[x]" : "[ ]"
      ]);
    });

    return rows;
  }

  plannerModel.required.forEach((item) => {
    rows.push([
      "Required Course",
      getCourseLabel(item),
      `${item.hours}`,
      checked(item.id) ? "[x]" : "[ ]"
    ]);
  });

  Object.values(plannerModel.distribution).forEach((category) => {
    category.options.forEach((item) => {
      rows.push([
        category.label,
        getCourseLabel(item),
        `${item.hours}`,
        checked(item.id) ? "[x]" : "[ ]"
      ]);
    });
  });

  plannerModel.electives.forEach((item) => {
    rows.push([
      "CRJU Elective",
      getCourseLabel(item),
      `${item.hours}`,
      checked(item.id) ? "[x]" : "[ ]"
    ]);
  });

  plannerModel.core.forEach((item) => {
    rows.push([
      `Core - ${item.group}`,
      getCourseLabel(item),
      `${item.hours}`,
      checked(item.id) ? "[x]" : "[ ]"
    ]);
  });

  rows.push([
    "Free Electives",
    plannerModel.freeElectives.title,
    `${plannerModel.freeElectives.hours}`,
    checked(plannerModel.freeElectives.id) ? "[x]" : "[ ]"
  ]);

  return rows;
}

function buildInterestSummaryRows() {
  const selectedInterests = getSelectedInterests();
  if (selectedInterests.length === 0) {
    return [["No interests selected", "Recommendations are based on open requirements and filter settings."]];
  }

  return INTEREST_OPTIONS
    .filter((option) => selectedInterests.includes(option.id))
    .map((option) => [option.label, `Priority on courses related to ${option.label.toLowerCase()}.`]);
}

function buildRecommendationRows(view) {
  const { selected } = getCurrentRecommendations(view);
  if (selected.length === 0) {
    return [["-", "No open CRJU recommendations", "-", "-", "-", "-", "Try relaxing one or more filters."]];
  }

  return selected.map((item) => [
    item.courseCode,
    item.courseName,
    item.professor || "TBA",
    item.schedule || "TBA",
    item.format || "TBA",
    String(item.seats),
    item.reason
  ]);
}

function buildAdvisorSnapshot(view) {
  const progress = buildProgressStats(view);
  const selectedInterests = getSelectedInterests();
  const { selected, targetHours } = getCurrentRecommendations(view);

  const topThree = selected.slice(0, 3).map((item) => item.courseCode).join(", ") || "None";
  const lowSeatRisk = selected.filter((item) => item.seats <= 2).map((item) => `${item.courseCode} (${item.seats} seats)`).join(", ") || "None";

  return [
    ["Progress", `${progress.completed}/${progress.total} hours complete`],
    ["Interests", selectedInterests.length ? selectedInterests.map((id) => INTEREST_OPTIONS.find((option) => option.id === id)?.label || id).join(", ") : "None selected"],
    ["Hour Goal", `${targetHours} hours next term`],
    ["Top Priorities", topThree],
    ["Advising Risks", lowSeatRisk],
    ["Data Freshness", dataLoadedAt ? dataLoadedAt.toLocaleString() : "Not loaded"]
  ];
}

function drawSectionHeader(doc, title, y) {
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  if (y + 24 > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage();
    y = margin;
  }

  doc.setFillColor(77, 25, 121);
  doc.rect(margin, y, contentWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title, margin + 8, y + 13);
  doc.setTextColor(29, 26, 31);

  return y + 30;
}

async function downloadAdvisingForm() {
  await referenceDataPromise;
  await ensurePdfLibrariesLoaded();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = margin;
  const view = getActiveView();
  const studentName = document.getElementById("student-name").value.trim();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(77, 25, 121);
  doc.text("FrogPath Advising Form", margin, y);

  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(29, 26, 31);
  doc.text(`Student Name: ${studentName || "______________________________"}`, margin, y);
  y += 16;
  doc.text(`Program View: ${view === VIEW_MINOR ? "Minor" : "Major"}`, margin, y);
  y += 16;

  y = drawSectionHeader(doc, "Advisor Snapshot", y);
  doc.autoTable({
    startY: y,
    head: [["Metric", "Value"]],
    body: buildAdvisorSnapshot(view),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 4, valign: "middle" },
    headStyles: { fillColor: [77, 25, 121], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 244, 236] },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 320 }
    }
  });

  y = doc.lastAutoTable.finalY + 18;
  y = drawSectionHeader(doc, "1. Degree requirements checklist", y);
  doc.autoTable({
    startY: y,
    head: [["Category", "Requirement", "Hours", "Done"]],
    body: buildChecklistRows(view),
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 4, valign: "middle" },
    headStyles: { fillColor: [77, 25, 121], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 244, 236] },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 250 },
      2: { halign: "center", cellWidth: 50 },
      3: { halign: "center", cellWidth: 40 }
    }
  });

  y = doc.lastAutoTable.finalY + 18;
  y = drawSectionHeader(doc, "2. Interest profile", y);
  doc.autoTable({
    startY: y,
    head: [["Selected interest", "How recommendations are weighted"]],
    body: buildInterestSummaryRows(),
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 4, valign: "middle" },
    headStyles: { fillColor: [77, 25, 121], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 244, 236] },
    columnStyles: {
      0: { cellWidth: 160 },
      1: { cellWidth: 300 }
    }
  });

  y = doc.lastAutoTable.finalY + 18;
  y = drawSectionHeader(doc, "3. Recommended next courses", y);
  doc.autoTable({
    startY: y,
    head: [["Course", "Name", "Professor", "Meeting Time", "Format", "Seats", "Why suggested"]],
    body: buildRecommendationRows(view),
    margin: { left: margin, right: margin },
    styles: { fontSize: 7, cellPadding: 3, valign: "middle" },
    headStyles: { fillColor: [77, 25, 121], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 244, 236] },
    columnStyles: {
      0: { cellWidth: 52 },
      1: { cellWidth: 128 },
      2: { cellWidth: 80 },
      3: { cellWidth: 62 },
      4: { cellWidth: 52 },
      5: { cellWidth: 30, halign: "center" },
      6: { cellWidth: 102 }
    }
  });

  doc.save(`frogpath-advising-form-${view}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function initializeRecommendationControls() {
  const settings = getRecommendationSettings();

  const targetHours = document.getElementById("target-hours");
  const format = document.getElementById("filter-format");
  const openSeats = document.getElementById("filter-open-seats");
  const noEvening = document.getElementById("filter-no-evening");
  const refresh = document.getElementById("refresh-recommendations");

  targetHours.value = String(settings.targetHours);
  format.value = settings.format;
  openSeats.checked = settings.openSeatsOnly;
  noEvening.checked = settings.noEvening;

  const persistFromControls = () => {
    const next = {
      targetHours: clampNumber(Number(targetHours.value), 3, 18, DEFAULT_SETTINGS.targetHours),
      format: format.value,
      openSeatsOnly: openSeats.checked,
      noEvening: noEvening.checked
    };

    targetHours.value = String(next.targetHours);
    setRecommendationSettings(next);
    renderRecommendations();
  };

  targetHours.addEventListener("change", persistFromControls);
  targetHours.addEventListener("input", persistFromControls);
  format.addEventListener("change", persistFromControls);
  openSeats.addEventListener("change", persistFromControls);
  noEvening.addEventListener("change", persistFromControls);
  refresh.addEventListener("click", () => {
    referenceDataPromise = loadReferenceData();
    referenceDataPromise.finally(() => renderRecommendations());
  });
}

function setView(view) {
  plannerState.activeView = view === VIEW_MINOR ? VIEW_MINOR : VIEW_MAJOR;
  savePlannerState();
  renderPlanner();
}

document.addEventListener("DOMContentLoaded", () => {
  const studentNameInput = document.getElementById("student-name");
  studentNameInput.value = getStudentName();
  studentNameInput.addEventListener("input", () => setStudentName(studentNameInput.value.trim()));

  renderInterestOptions();
  initializeRecommendationControls();
  renderDataFreshness();

  document.getElementById("major-view-btn").addEventListener("click", () => setView(VIEW_MAJOR));
  document.getElementById("minor-view-btn").addEventListener("click", () => setView(VIEW_MINOR));

  document.getElementById("download-advising-form").addEventListener("click", () => {
    downloadAdvisingForm().catch(() => {
      window.alert("The advising form could not be generated right now. Please try again in a moment.");
    });
  });

  document.getElementById("reset-progress").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COURSE_TERMS_KEY);
    plannerState.major = {};
    plannerState.minor = {};
    plannerState.activeView = VIEW_MAJOR;
    savePlannerState();
    renderPlanner();
  });

  renderPlanner();
});
