const STORAGE_KEY = "frogpath.degreePlanner.v1";
const TOTAL_HOURS = 120;

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

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (err) {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createReqItem(item, state, onChange) {
  const label = document.createElement("label");
  label.className = "req-item";

  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = !!state[item.id];

  const main = document.createElement("div");
  main.innerHTML = `<strong>${item.code || item.title}</strong><div class="req-meta">${item.title}${item.code ? "" : " requirement"}</div>`;

  const hrs = document.createElement("span");
  hrs.className = "pill";
  hrs.textContent = `${item.hours} hr`;

  box.addEventListener("change", () => {
    state[item.id] = box.checked;
    label.classList.toggle("done", box.checked);
    onChange();
  });

  label.classList.toggle("done", box.checked);
  label.append(box, main, hrs);
  return label;
}

function renderPlanner() {
  const root = document.getElementById("planner-root");
  const state = getSavedState();

  function recomputeStats() {
    let completed = 0;

    plannerModel.required.forEach((c) => {
      if (state[c.id]) completed += c.hours;
    });

    Object.values(plannerModel.distribution).forEach((cat) => {
      const selected = cat.options.some((opt) => state[opt.id]);
      if (selected) completed += 3;
    });

    const selectedElectives = plannerModel.electives.filter((c) => state[c.id]).length;
    completed += Math.min(selectedElectives, 3) * 3;

    plannerModel.core.forEach((coreReq) => {
      if (state[coreReq.id]) completed += coreReq.hours;
    });

    if (state[plannerModel.freeElectives.id]) {
      completed += plannerModel.freeElectives.hours;
    }

    const pct = Math.min(100, (completed / TOTAL_HOURS) * 100);
    document.getElementById("hours-completed").textContent = String(completed);
    document.getElementById("hours-remaining").textContent = String(Math.max(0, TOTAL_HOURS - completed));
    document.getElementById("hours-percent").textContent = `${pct.toFixed(1)}%`;
    document.getElementById("progress-fill").style.width = `${pct}%`;

    saveState(state);
    updateBadges();
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

  function updateBadges() {
    document.querySelectorAll("[data-distribution-key]").forEach((el) => {
      const key = el.getAttribute("data-distribution-key");
      const group = plannerModel.distribution[key];
      const satisfied = group.options.some((c) => state[c.id]);
      el.textContent = satisfied ? "Satisfied" : "Pick one";
      el.className = satisfied ? "dist-satisfied" : "req-meta";
    });

    const electiveCount = plannerModel.electives.filter((c) => state[c.id]).length;
    const electiveBadge = document.getElementById("elective-badge");
    electiveBadge.textContent = `${Math.min(electiveCount, 3)} of 3 selected`;
    electiveBadge.className = electiveCount >= 3 ? "dist-satisfied" : "req-meta";
  }

  root.innerHTML = "";

  const requiredSec = section("Required CRJU Courses", "22 hours total");
  plannerModel.required.forEach((item) => requiredSec.list.appendChild(createReqItem(item, state, recomputeStats)));
  root.appendChild(requiredSec.wrap);

  const distSec = section("Distribution Requirements", "12 hours total (1 course from each category)");
  Object.entries(plannerModel.distribution).forEach(([key, cat]) => {
    const block = document.createElement("div");
    block.className = "panel";

    const hdr = document.createElement("div");
    hdr.className = "req-header";
    hdr.innerHTML = `<strong>${cat.label}</strong><span data-distribution-key="${key}" class="req-meta">Pick one</span>`;

    const lst = document.createElement("div");
    lst.className = "req-list";
    cat.options.forEach((item) => lst.appendChild(createReqItem(item, state, recomputeStats)));

    block.append(hdr, lst);
    distSec.list.appendChild(block);
  });
  root.appendChild(distSec.wrap);

  const electSec = section("CRJU Electives", "9 hours total (any 3 courses)");
  electSec.header.querySelector("span").setAttribute("id", "elective-badge");
  plannerModel.electives.forEach((item) => electSec.list.appendChild(createReqItem(item, state, recomputeStats)));
  root.appendChild(electSec.wrap);

  const coreSec = section("TCU Core Curriculum", "39 to 63 hours depending on overlap");
  const coreNote = document.createElement("p");
  coreNote.className = "muted";
  coreNote.textContent = "Core note: No more than 4 requirements may be met in one subject area prefix (excluding Oral and Written Communication). Courses fulfilling core may also count toward major requirements.";
  coreSec.list.appendChild(coreNote);
  plannerModel.core.forEach((item) => coreSec.list.appendChild(createReqItem(item, state, recomputeStats)));
  root.appendChild(coreSec.wrap);

  const freeSec = section("Free Electives", "Use electives to reach 120 total hours");
  freeSec.list.appendChild(createReqItem(plannerModel.freeElectives, state, recomputeStats));
  root.appendChild(freeSec.wrap);

  recomputeStats();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reset-progress").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderPlanner();
  });

  renderPlanner();
});
