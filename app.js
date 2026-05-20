const partnerData = {
  a: {
    name: "A금속가공",
    score: "적합도 91%",
    desc: "같은 산단에 위치한 후가공 가능 기업입니다. 생산품 유사도와 공정 보완성이 가장 높습니다.",
  },
  b: {
    name: "B정밀부품",
    score: "적합도 87%",
    desc: "정밀 절삭 설비를 보유한 인근 기업입니다. 소량 다품종 생산 대응력이 좋아 신규 발주 대응에 적합합니다.",
  },
  c: {
    name: "C표면처리",
    score: "적합도 84%",
    desc: "표면처리와 품질 인증 역량이 강한 기업입니다. 납기 단축과 후공정 안정화에 도움이 됩니다.",
  },
  d: {
    name: "D물류테크",
    score: "적합도 78%",
    desc: "산단 공동물류 운영 경험이 있는 기업입니다. 출하 리드타임 개선과 물류비 절감 시나리오에 적합합니다.",
  },
};

const profilePresets = {
  "자동차 부품 제조": {
    score: 82,
    partners: 32,
    programs: 5,
    percentile: "동일 업종 상위 18%",
  },
  "전자부품 제조": {
    score: 78,
    partners: 27,
    programs: 4,
    percentile: "동일 업종 상위 24%",
  },
  "정밀기계 제조": {
    score: 86,
    partners: 38,
    programs: 6,
    percentile: "동일 업종 상위 14%",
  },
  "금속가공 제조": {
    score: 80,
    partners: 35,
    programs: 5,
    percentile: "동일 업종 상위 21%",
  },
};

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function setActiveNav(sectionId) {
  qsa(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === sectionId);
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(sectionId);
  }
}

function updateDiagnosis() {
  const company = qs("#companyName").value.trim() || qs("#companySearch").value.trim() || "대한정밀가공";
  const industry = qs("#industry").value;
  const preset = profilePresets[industry] || profilePresets["자동차 부품 제조"];
  const dashOffset = 389 - (389 * preset.score) / 100;

  qs("#companySearch").value = company;
  qs("#growthScore").textContent = preset.score;
  qs("#partnerCount").textContent = preset.partners;
  qs("#programCount").textContent = preset.programs;
  qs("#scoreText").textContent = preset.score;
  qs(".ring-value").style.strokeDashoffset = dashOffset;
  qs("#resultTitle").textContent = `${company} 진단 결과`;
  qs("#reportCompany").textContent = `${company} 성장진단 리포트`;
  qs(".metric small").textContent = preset.percentile;

  scrollToSection("diagnosis");
}

function selectPartner(id) {
  const data = partnerData[id];
  if (!data) return;

  qsa(".pin").forEach((pin) => pin.classList.toggle("active", pin.dataset.partner === id));
  qsa(".partner-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.partnerCard === id);
  });
  qs("#partnerName").textContent = data.name;
  qs("#partnerDesc").textContent = data.desc;
  qs(".partner-detail .tag").textContent = data.score;
}

qsa("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => scrollToSection(button.dataset.scroll));
});

qsa(".nav-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToSection(item.dataset.section);
  });
});

qs("#runDiagnosis").addEventListener("click", () => {
  qs("#companyName").value = qs("#companySearch").value || "대한정밀가공";
  updateDiagnosis();
});

qs("#profileDiagnosis").addEventListener("click", updateDiagnosis);

qs("#refreshReport").addEventListener("click", () => {
  qs("#refreshReport").textContent = "생성 완료";
  setTimeout(() => {
    qs("#refreshReport").textContent = "리포트 재생성";
  }, 1400);
});

qsa(".pin").forEach((pin) => {
  pin.addEventListener("click", () => selectPartner(pin.dataset.partner));
});

qsa(".partner-card").forEach((card) => {
  card.addEventListener("click", () => selectPartner(card.dataset.partnerCard));
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveNav(visible.target.id);
  },
  { threshold: [0.28, 0.48, 0.68] },
);

qsa(".section").forEach((section) => observer.observe(section));
