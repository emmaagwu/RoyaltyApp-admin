// import { AppState } from 'react-native'
// import 'react-native-url-polyfill/auto'
// // import AsyncStorage from '@react-native-async-storage/async-storage'
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://dltsryfxqcvbjdrgoist.supabase.co'
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsdHNyeWZ4cWN2YmpkcmdvaXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTQ1OTIsImV4cCI6MjA1NTk3MDU5Mn0.H-SnHP_NhoByd97v71GtZpSLpsNOzCBZzOt5fSs8wLc'

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// })

// // Tells Supabase Auth to continuously refresh the session automatically
// // if the app is in the foreground. When this is added, you will continue
// // to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// // `SIGNED_OUT` event if the user's session is terminated. This should
// // only be registered once.
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh()
//   } else {
//     supabase.auth.stopAutoRefresh()
//   }
// })

import { createClient } from "@supabase/supabase-js";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // Optional: For React Native only

const supabaseUrl = "https://dltsryfxqcvbjdrgoist.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsdHNyeWZ4cWN2YmpkcmdvaXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzOTQ1OTIsImV4cCI6MjA1NTk3MDU5Mn0.H-SnHP_NhoByd97v71GtZpSLpsNOzCBZzOt5fSs8wLc";

// For Web: Use localStorage instead of AsyncStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : AsyncStorage, // Use AsyncStorage for React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Set this to true for web
  },
});

// Web alternative to handle session refresh
if (typeof window !== "undefined") {
  window.addEventListener("focus", () => {
    supabase.auth.startAutoRefresh();
  });

  window.addEventListener("blur", () => {
    supabase.auth.stopAutoRefresh();
  });
}
