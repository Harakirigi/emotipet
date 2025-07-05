import { useLogger } from '@/hooks/useLogger';
import { PetContext } from '@/providers/PetContext';
import { UserContext } from '@/providers/UserContext';
import { StorageService } from '@/services/storageService';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';

// Profile screen for user and pet information, with logout and delete account options
export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const { pet } = useContext(PetContext);
  const router = useRouter();
  const logger = useLogger();
  const storageService = new StorageService(logger);

  const handleLogout = async () => {
    logger.debug('Logging out user', { userId: user?.id });
    await storageService.clearLocalData();
    setUser(null);
    router.replace('/welcome');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    logger.debug('Deleting account', { userId: user.id });
    const error = await storageService.deleteAccount(user.id);
    if (!error) {
      setUser(null);
      router.replace('/welcome');
      // TODO: Show success toast notification
    } else {
      // TODO: Show error toast notification
      logger.error('Failed to delete account', { error });
    }
  };

  const handleSaveToCloud = async () => {
    await storageService.saveGameToCloud();
    // TODO: Show success toast notification
    logger.info('Game saved to cloud');
  };

  const evolutionStages = ['Baby', 'Teen', 'Adult', 'Special', 'Legendary'];

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-lg">Username: {user?.username ?? 'Guest'}</Text>
      <Text className="mt-2 text-lg">Pet: {pet?.name ?? 'None'}</Text>
      <Text className="mt-2 text-lg">
        Evolution Stage: {pet ? evolutionStages[pet.evolutionStage] : 'None'}
      </Text>
      <Pressable
        className="p-3 mt-4 bg-red-600 rounded-lg"
        onPress={handleLogout}
      >
        <Text className="text-center text-white">Log Out</Text>
      </Pressable>
      <Pressable
        className="p-3 mt-2 bg-red-900 rounded-lg"
        onPress={handleDeleteAccount}
      >
        <Text className="text-center text-white">Delete Account</Text>
      </Pressable>
      <Pressable
        className="p-3 mt-2 bg-blue-600 rounded-lg"
        onPress={handleSaveToCloud}
      >
        <Text className="text-center text-white">Save to Cloud</Text>
      </Pressable>
    </View>
  );
}