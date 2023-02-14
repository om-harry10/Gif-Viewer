import {View, Text} from 'react-native';
import React from 'react';
import HomeScreen from './HomeScreen';
import {QueryClient, QueryClientProvider} from 'react-query';
const queryClient = new QueryClient();

export default function Home() {
  return (
    <View>
      <QueryClientProvider client={queryClient}>
        <HomeScreen />
      </QueryClientProvider>
    </View>
  );
}
