import { Redirect } from "expo-router";

export default function Index() {
  // Direct new launches straight into the main app dashboard
  return <Redirect href="/(tabs)/dashboard" />;
}
