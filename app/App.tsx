import { StatusBar } from 'expo-status-bar';
import { TodayScreen } from './src/screens/TodayScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <TodayScreen />
    </>
  );
}
