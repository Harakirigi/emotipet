import React, { useContext } from 'react';
import { FlatList, Text, View } from 'react-native';
import { DiaryContext } from '../../providers/DiaryContext';

// Diary screen to display pet diary entries
export default function DiaryScreen() {
  const { diary } = useContext(DiaryContext);

  return (
    <View className="flex-1 p-4 bg-white">
      {diary.length === 0 ? (
        <Text className="text-lg text-center">No diary entries yet!</Text>
      ) : (
        <FlatList
          data={diary}
          keyExtractor={(item) => item.timestamp.toISOString()}
          renderItem={({ item }) => (
            <View className="p-2 border-b border-gray-200">
              <Text className="text-lg">{item.event}</Text>
              <Text className="text-gray-600">{`${item.mood} - ${item.timestamp.toLocaleString()}`}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}