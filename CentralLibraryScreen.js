import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CentralLibraryScreen({ navigation }) {
  const rooms = [
    { name: '2F 전자정보실 노트북', seats: 8 },
    { name: '2F 멀티미디어 스튜디오 PC', seats: 42 },
    { name: '3F 집중열람실', seats: 70 },
    { name: '2F 전자정보실 PC좌석', seats: 16 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 중앙도서관 열람실</Text>
      {rooms.map((room, index) => (
        <TouchableOpacity
          key={index}
          style={styles.room}
          onPress={() =>
            navigation.navigate('SeatRoom', {
              roomName: room.name,
              totalSeats: room.seats,
            })
          }
        >
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomInfo}>좌석 수: {room.seats}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  room: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f3f1ff',
    marginBottom: 16,
    elevation: 2,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
  },
  roomInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
