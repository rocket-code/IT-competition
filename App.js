// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// 스크린들
import LibrarySelectorScreen from './LibrarySelectorScreen';
import CentralLibraryScreen from './CentralLibraryScreen';
import SujeongLibraryScreen from './SujeongLibraryScreen';
import UnjeongLibraryScreen from './UnjeongLibraryScreen';
import SeatRoom from './SeatRoom';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 성신 허브</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LibrarySelector')}
      >
        <Text style={styles.buttonText}>📚 도서관 좌석 예약</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>✅ 스마트 출석</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>📆 비교과 프로그램</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>🎁 S-마일리지 조회</Text>
      </TouchableOpacity>
    </View>
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
    flex: 1,
    backgroundColor: '#fffafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#8a2be2',
  },
  button: {
    backgroundColor: '#a491d3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});



