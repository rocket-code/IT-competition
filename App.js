import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Linking,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LibrarySelectorScreen from './LibrarySelectorScreen';
import CentralLibraryScreen from './CentralLibraryScreen';
import SujeongLibraryScreen from './SujeongLibraryScreen';
import UnjeongLibraryScreen from './UnjeongLibraryScreen';
import SeatRoom from './SeatRoom';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  const startCrawling = async () => {
    if (!userId || !userPw) {
      Alert.alert('입력 오류', '아이디와 비밀번호를 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.200.175:5000/start-crawling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, user_pw: userPw }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setPrograms(data.programs);
      } else {
        Alert.alert('실패', data.message || '오류가 발생했습니다.');
        setPrograms([]);
      }
    } catch (error) {
      Alert.alert('에러', '서버에 연결할 수 없습니다.');
      setPrograms([]);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎓 성신 허브</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#00AA55' }]}
        onPress={() => navigation.navigate('LibrarySelector')}
      >
        <Text style={styles.buttonText}>📚 도서관 좌석 예약</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#0066CC' }]}
        onPress={() =>
          Linking.openURL('https://smart.sungshin.ac.kr/student/clgr/attd/smartAttList.do')
        }
      >
        <Text style={styles.buttonText}>📝 스마트 출석 열기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#CC3399' }]}
        onPress={() =>
          Linking.openURL('https://smart.sungshin.ac.kr/student/clgr/attd/accAbscList.do')
        }
      >
        <Text style={styles.buttonText}>💊 생리 유고 신청</Text>
      </TouchableOpacity>

      {/* 아이디 / 비밀번호 입력 */}
      <View style={[styles.buttonWrapper, { marginTop: 30, alignItems: 'center' }]}>
        <Text style={styles.inputLabel}>아이디</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={userPw}
          onChangeText={setUserPw}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: loading ? '#ccc' : '#FF8800', marginTop: 20, width: '100%', maxWidth: 320 },
          ]}
          onPress={startCrawling}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '로딩 중...' : '📚 비교과 프로그램 목록 불러오기'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 크롤링 결과 프로그램 목록 */}
      {programs.length > 0 && (
        <>
          <Text style={[styles.title, { marginTop: 30, fontSize: 20 }]}>진행 중 프로그램</Text>
          {programs.map((item, idx) => (
            <View key={idx.toString()} style={styles.programItemRow}>
              <Text style={styles.programTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => Linking.openURL('https://portal.sungshin.ac.kr/sso/login.jsp')}
              >
                <Text style={styles.applyButtonText}>신청하기</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
        <Stack.Screen name="LibrarySelector" component={LibrarySelectorScreen} options={{ title: '도서관 선택' }} />
        <Stack.Screen name="CentralLibrary" component={CentralLibraryScreen} options={{ title: '중앙도서관 열람실' }} />
        <Stack.Screen name="SujeongLibrary" component={SujeongLibraryScreen} options={{ title: '수정관 열람실' }} />
        <Stack.Screen name="UnjeongLibrary" component={UnjeongLibraryScreen} options={{ title: '운정도서관 열람실' }} />
        <Stack.Screen name="SeatRoom" component={SeatRoom} options={{ title: '좌석 현황' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fffafc',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000000ff',
  },
  buttonWrapper: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 6,
    color: '#555',
    alignSelf: 'flex-start',
  },
  input: {
    height: 40,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    width: '100%',
  },
  programItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    width: '100%',
  },
  programTitle: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: '#FF8800',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
