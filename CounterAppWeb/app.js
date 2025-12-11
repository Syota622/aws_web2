import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

// 公演データ（ハードコーディング）
const PERFORMANCE_ID = "performance_001";
const PERFORMANCE_NAME = "東京公演2025";

// 認証情報設定

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log('Firebase初期化完了');

let count = 0;

document.getElementById('increment').onclick = () => {
  count++;
  document.getElementById('count').textContent = count;
  logEvent(analytics, 'button_press', { 
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
  logEvent(analytics, 'counter_reset', { 
    previous_count: prev,
    performance_id: PERFORMANCE_ID,
    performance_name: PERFORMANCE_NAME
  });
  document.getElementById('log').textContent = `counter_reset送信: previous_count=${prev}, performance_id=${PERFORMANCE_ID}`;
  console.log('counter_reset送信:', prev, PERFORMANCE_ID);
};