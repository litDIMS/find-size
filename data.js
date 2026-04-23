// ============================================
// STAMPIFY - 모델 데이터 및 검색 로직
// ============================================
// 이 파일은 index.html과 admin.html이 공유합니다.

// 사각형 스탬프 모델 (세로 x 가로, mm 단위)
const RECT_MODELS = [
  { model: "1341",  h: 8,   w: 36  },
  { model: "1743",  h: 12,  w: 38  },
  { model: "1755",  h: 12,  w: 50  },
  { model: "1767",  h: 12,  w: 62  },
  { model: "2255",  h: 17,  w: 50  },
  { model: "2267",  h: 17,  w: 62  },
  { model: "2278",  h: 17,  w: 73  },
  { model: "2291",  h: 17,  w: 86  },
  { model: "2743",  h: 22,  w: 38  },
  { model: "2755",  h: 22,  w: 50  },
  { model: "2767",  h: 22,  w: 62  },
  { model: "2778",  h: 22,  w: 73  },
  { model: "2791",  h: 22,  w: 86  },
  { model: "27103", h: 22,  w: 98  },
  { model: "27130", h: 22,  w: 125 },
  { model: "3255",  h: 27,  w: 50  },
  { model: "3267",  h: 27,  w: 62  },
  { model: "3278",  h: 27,  w: 73  },
  { model: "3291",  h: 27,  w: 86  },
  { model: "32103", h: 27,  w: 98  },
  { model: "32130", h: 27,  w: 125 },
  { model: "4355",  h: 38,  w: 50  },
  { model: "4367",  h: 38,  w: 62  },
  { model: "4378",  h: 38,  w: 73  },
  { model: "43103", h: 38,  w: 98  },
  { model: "43130", h: 38,  w: 125 },
  { model: "5355",  h: 48,  w: 50  },
  { model: "5378",  h: 48,  w: 73  },
  { model: "5391",  h: 48,  w: 86  },
  { model: "53103", h: 48,  w: 98  },
  { model: "6670",  h: 61,  w: 65  },
  { model: "6685",  h: 61,  w: 80  },
  { model: "66103", h: 61,  w: 98  },
  { model: "66130", h: 61,  w: 125 },
  { model: "78103", h: 73,  w: 98  },
  { model: "94130", h: 89,  w: 125 },
  { model: "f1600", h: 115, w: 145 },
];

// 원형 스탬프 (파이 = 지름, mm)
const CIRCLE_MODELS = [
  { model: "13파이", d: 10 },
  { model: "19파이", d: 16 },
  { model: "23파이", d: 20 },
  { model: "30파이", d: 27 },
  { model: "35파이", d: 32 },
  { model: "42파이", d: 39 },
  { model: "51파이", d: 48 },
];

// ============================================
// 검색 로직
// ============================================
// 세로 h, 가로 w가 주어졌을 때, 세로 >= h AND 가로 >= w인
// 모델 중 가장 작은 (세로+가로 합이 최소) 모델을 반환
function findRectModel(h, w) {
  const candidates = RECT_MODELS.filter(m => m.h >= h && m.w >= w);
  if (candidates.length === 0) return null;
  // 세로 기준 최소 -> 그 중 가로 기준 최소
  candidates.sort((a, b) => (a.h - b.h) || (a.w - b.w));
  return candidates[0];
}

// 원형: 지름 d 이상인 것 중 최소
function findCircleModel(d) {
  const candidates = CIRCLE_MODELS.filter(m => m.d >= d);
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a.d - b.d);
  return candidates[0];
}

// ============================================
// 로컬 저장소 - 구매 링크 및 썸네일
// ============================================
const STORAGE_KEY = "stampify_model_config_v1";

function getConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveConfig(cfg) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function getModelConfig(modelName) {
  const cfg = getConfig();
  return cfg[modelName] || { link: "", thumbnail: "" };
}

function setModelConfig(modelName, data) {
  const cfg = getConfig();
  cfg[modelName] = data;
  saveConfig(cfg);
}

// 모든 모델 이름 (관리자용)
function getAllModels() {
  return {
    rect: RECT_MODELS.map(m => ({ ...m, type: "rect" })),
    circle: CIRCLE_MODELS.map(m => ({ ...m, type: "circle" })),
  };
}
