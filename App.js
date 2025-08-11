import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  Linking,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 스크린들 (경로에 맞게 파일 준비하세요)
import LibrarySelectorScreen from './LibrarySelectorScreen';
import CentralLibraryScreen from './CentralLibraryScreen';
import SujeongLibraryScreen from './SujeongLibraryScreen';
import UnjeongLibraryScreen from './UnjeongLibraryScreen';
import SeatRoom from './SeatRoom';

const Stack = createNativeStackNavigator();

// 웹 링크 열기 함수
const openLink = async (url, errorMessage) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(errorMessage);
    }
  } catch {
    Alert.alert(errorMessage);
  }
};

function HomeScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');

  // 비교과 크롤링 시작 함수
  const startCrawling = async () => {
    if (!userId || !userPw) {
      setTimeout(() => {
        Alert.alert('입력 오류', '아이디와 비밀번호를 입력하세요.');
      }, 50);
      return;
    }

    try {
      console.log('서버 요청 보냄:', userId, userPw);
      // 여기를 Flask 서버 IP와 포트로 바꾸세요! 예: 172.20.10.4:5678
      const response = await fetch('http://172.20.10.3:5678/start-crawling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          user_pw: userPw,
        }),
      });

      console.log('응답 상태:', response.status);
      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('서버 응답 데이터:', data);

      if (data.status === 'success') {
        setTimeout(() => {
          Alert.alert('크롤링 성공!', `프로그램 수: ${data.programs.length}`);
        }, 50);
      } else {
        setTimeout(() => {
          Alert.alert('실패', data.message || '오류가 발생했습니다.');
        }, 50);
      }
    } catch (error) {
      console.error('fetch 에러:', error);
      setTimeout(() => {
        Alert.alert('에러', '서버에 연결할 수 없습니다.');
      }, 50);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎓 성신 허브</Text>

      {/* 도서관 좌석 예약 */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#00AA55' }]}
        onPress={() => navigation.navigate('LibrarySelector')}
      >
        <Text style={styles.buttonText}>📚 도서관 좌석 예약</Text>
      </TouchableOpacity>

      {/* 스마트 출석 열기 */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#0066CC' }]}
        onPress={() =>
          openLink(
            'https://smart.sungshin.ac.kr/student/clgr/attd/smartAttList.do',
            '출석 페이지를 열 수 없습니다.'
          )
        }
      >
        <Text style={styles.buttonText}>📝 스마트 출석 열기</Text>
      </TouchableOpacity>

      {/* 생리 유고 신청 */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#CC3399' }]}
        onPress={() =>
          openLink(
            'https://smart.sungshin.ac.kr/student/clgr/attd/accAbscList.do',
            '생리 유고 신청 페이지를 열 수 없습니다.'
          )
        }
      >
        <Text style={styles.buttonText}>💊 생리 유고 신청</Text>
      </TouchableOpacity>

      {/* 비교과 프로그램 자동신청 */}
      <View style={[styles.buttonWrapper, { marginTop: 30, alignItems: 'center' }]}>
        <Text style={styles.inputLabel}>아이디 입력</Text>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>비밀번호 입력</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={userPw}
          onChangeText={setUserPw}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF8800', marginTop: 20, width: '100%', maxWidth: 320 }]}
          onPress={startCrawling}
        >
          <Text style={styles.buttonText}>📚 비교과 프로그램 신청</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '성신 허브' }} />
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
    justifyContent: 'center',
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
});
