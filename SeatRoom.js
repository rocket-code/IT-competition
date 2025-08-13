// SeatRoom.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function SeatRoom({ route }) {
  const { roomName, totalSeats } = route.params;
  
  
  const [reservedSeats, setReservedSeats] = useState([3, 7]);

  const handleSeatPress = (seatNumber) => {
    if (reservedSeats.includes(seatNumber)) {
      Alert.alert('예약 불가', `좌석 ${seatNumber}번은 이미 예약되었습니다.`);
    } else {
      Alert.alert(
        '예약하기',
        `${seatNumber}번 좌석을 예약하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '예약',
            onPress: () => setReservedSeats([...reservedSeats, seatNumber]),
          },
        ]
      );
    }
  };

  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{roomName} 좌석 현황</Text>
      <View style={styles.grid}>
        {seats.map((seat) => {
          const isReserved = reservedSeats.includes(seat);
          return (
            <TouchableOpacity
              key={seat}
              style={[
                styles.seat,
                { backgroundColor: isReserved ? '#3498db' : '#ecf0f1' },
              ]}
              onPress={() => handleSeatPress(seat)}
            >
              <Text style={{ color: isReserved ? 'white' : 'black' }}>{seat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  seat: {
    width: 60,
    height: 60,
    margin: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
