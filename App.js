import React from 'react';
import { View, Button, Linking, Alert, StyleSheet, Text } from 'react-native';

export default function App() {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 성신여대 캠퍼스 앱</Text>

      <View style={styles.buttonWrapper}>
        <Button
          title="📺 YouTube 열기"
          onPress={() => openLink('https://www.youtube.com/', '유튜브를 열 수 없습니다.')}
          color="#FF0000"
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="🏫 스마트캠퍼스 접속"
          onPress={() => openLink('https://smart.sungshin.ac.kr/login/index.do', '스마트캠퍼스를 열 수 없습니다.')}
          color="#0066CC"
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="📝 스마트 출석 열기"
          onPress={() => openLink('https://smart.sungshin.ac.kr/student/clgr/attd/smartAttList.do', '출석 페이지를 열 수 없습니다.')}
          color="#00AA55"
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="🌸 생리 유고 신청"
          onPress={() => openLink('https://smart.sungshin.ac.kr/student/clgr/attd/accAbscList.do', '생리 유고 신청 페이지를 열 수 없습니다.')}
          color="#CC3399"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  buttonWrapper: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
