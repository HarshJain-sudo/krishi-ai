import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import { HomeScreen } from '../screens/HomeScreen';
import { VoiceAssistantScreen } from '../screens/VoiceAssistantScreen';
import { SoilTestScreen } from '../screens/SoilTestScreen';
import { MarketPricesScreen } from '../screens/MarketPricesScreen';
import { GovernmentSchemesScreen } from '../screens/GovernmentSchemesScreen';
import { AgricultureTipsScreen } from '../screens/AgricultureTipsScreen';
import { FarmerTestimonialsScreen } from '../screens/FarmerTestimonialsScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="VoiceAssistant" 
          component={VoiceAssistantScreen} 
          options={{ 
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen 
          name="SoilTest" 
          component={SoilTestScreen} 
          options={{ 
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen 
          name="MarketPrices" 
          component={MarketPricesScreen}
          options={{ 
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen 
          name="GovernmentSchemes" 
          component={GovernmentSchemesScreen}
          options={{ 
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen 
          name="AgricultureTips" 
          component={AgricultureTipsScreen}
          options={{ 
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen 
          name="FarmerTestimonials" 
          component={FarmerTestimonialsScreen}
          options={{ 
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 