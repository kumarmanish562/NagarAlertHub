import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import ReportIncidentScreen from "../screens/ReportIncidentScreen";
import LiveAlertsMapScreen from "../screens/LiveAlertsMapScreen";
import AlertDetailsScreen from "../screens/AlertDetailsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileSettingsScreen from "../screens/ProfileSettingsScreen";

import UserProfileScreen from "../screens/UserProfileScreen";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import LanguageScreen from "../screens/LanguageScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HelpSupportScreen from "../screens/HelpSupportScreen";

import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      {/* App */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Report" component={ReportIncidentScreen} />
      <Stack.Screen name="LiveAlertsMap" component={LiveAlertsMapScreen} />
      <Stack.Screen name="AlertDetails" component={AlertDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />

      {/* Settings Sub-screens */}
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
    </Stack.Navigator>
  );
}
