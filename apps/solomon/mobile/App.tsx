import "@expo/metro-runtime"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import * as Sentry from "@sentry/react-native"

Sentry.init({
  dsn: "https://9054e73759e571f58ccb6fbd76bf9161@o4507201706196992.ingest.us.sentry.io/4507205938249728",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 0.1,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 0.1,
  },
})

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default Sentry.wrap(IgniteApp)
