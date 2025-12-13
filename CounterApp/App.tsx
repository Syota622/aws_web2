import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import analytics from '@react-native-firebase/analytics';
import app from '@react-native-firebase/app';

// 公演データをランダムに設定
const performances = [
  { id: "performance_001", name: "東京" },
  { id: "performance_002", name: "大阪" },
  { id: "performance_003", name: "横浜" },
  { id: "performance_004", name: "名古屋" }
];
const randomPerformance = performances[0];
const PERFORMANCE_ID = randomPerformance.id;
const PERFORMANCE_NAME = randomPerformance.name;
console.log(`公演ID: ${PERFORMANCE_ID}, 公演名: ${PERFORMANCE_NAME}`); 

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);

  const handleIncrement = async () => {
    const newCount = count + 1;
    setCount(newCount);

    try {
      // Firebase Appが初期化されているか確認
      if (app.apps.length === 0) {
        console.warn('Firebase Appが初期化されていません');
        return;
      }

      await analytics().logEvent(`press_ios_${PERFORMANCE_ID}`, {
        count: newCount,
        timestamp: new Date().toISOString(),
        performance_id: PERFORMANCE_ID,
        performance_name: PERFORMANCE_NAME,
      });

      console.log(`カウント: ${newCount} - Analyticsに送信しました`);
    } catch (error) {
      console.error('Analytics送信エラー:', error);
    }
  };

  const handleReset = async () => {
    setCount(0);

    try {
      // Firebase Appが初期化されているか確認
      if (app.apps.length === 0) {
        console.warn('Firebase Appが初期化されていません');
        return;
      }

      await analytics().logEvent(`reset_ios_${PERFORMANCE_ID}`, {
        previous_count: count,
        timestamp: new Date().toISOString(),
        performance_id: PERFORMANCE_ID,
        performance_name: PERFORMANCE_NAME,
      });

      console.log('リセット - Analyticsに送信しました');
    } catch (error) {
      console.error('Analytics送信エラー:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>カウンターアプリ</Text>
        <Text style={styles.subtitle}>Firebase Analytics テスト</Text>

        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleIncrement}>
          <Text style={styles.buttonText}>+1 カウントアップ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}>
          <Text style={styles.buttonText}>リセット</Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          ボタンを押すとFirebase Analyticsに{'\n'}イベントが送信されます
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  countContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  count: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#34a853',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#ea4335',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    marginTop: 30,
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default App;