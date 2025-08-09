// reservation/LibrarySelectorScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LibrarySelectorScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>도서관을 선택하세요 📚</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CentralLibrary')}>
        <Text style={styles.buttonText}>중앙도서관</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SujeongLibrary')}>
        <Text style={styles.buttonText}>수정관</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UnjeongLibrary')}>
        <Text style={styles.buttonText}>운정도서관</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffafc', alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, marginBottom: 40, fontWeight: 'bold', color: '#8a2be2' },
  button: { backgroundColor: '#a491d3', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, marginVertical: 10, width: '100%' },
  buttonText: { color: '#ffffff', fontSize: 18, textAlign: 'center' },
});
