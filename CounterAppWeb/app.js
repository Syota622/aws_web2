import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

// 公演データ（ランダムに設定）
const performances = [
  { id: "performance_001", name: "東京" },
  { id: "performance_002", name: "大阪" },
  { id: "performance_003", name: "横浜" },
  { id: "performance_004", name: "名古屋" }
];

// ランダムな公演を取得する関数
const getRandomPerformance = () => {
  return performances[Math.floor(Math.random() * performances.length)];
};

// 初期公演を設定
let currentPerformance = getRandomPerformance();
let PERFORMANCE_ID = currentPerformance.id;
let PERFORMANCE_NAME = currentPerformance.name;
console.log(`選択された公演: ${PERFORMANCE_NAME} (${PERFORMANCE_ID})`);

// 認証情報設定


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log('Firebase初期化完了');

let count = 0;

document.getElementById('increment').onclick = () => {
  count++;
  document.getElementById('count').textContent = count;
  logEvent(analytics, `press_${PERFORMANCE_ID}`, { 
    count,
    performance_id: PERFORMANCE_ID,
    performance_name: PERFORMANCE_NAME
  });
  document.getElementById('log').textContent = `button_press送信: count=${count}, performance_id=${PERFORMANCE_ID}`;
  console.log('button_press送信:', count, PERFORMANCE_ID);
};

document.getElementById('reset').onclick = () => {
  const prev = count;
  count = 0;
  document.getElementById('count').textContent = count;
  
  // 公演IDと公演名をリセット（新しいランダムな値を設定）
  currentPerformance = getRandomPerformance();
  PERFORMANCE_ID = currentPerformance.id;
  PERFORMANCE_NAME = currentPerformance.name;
  console.log(`リセット - 新しい公演: ${PERFORMANCE_NAME} (${PERFORMANCE_ID})`);
  
  logEvent(analytics, `reset_${PERFORMANCE_ID}`, { 
    previous_count: prev,
    performance_id: PERFORMANCE_ID,
    performance_name: PERFORMANCE_NAME
  });
  document.getElementById('log').textContent = `counter_reset送信: previous_count=${prev}, performance_id=${PERFORMANCE_ID}`;
  console.log('counter_reset送信:', prev, PERFORMANCE_ID);
};