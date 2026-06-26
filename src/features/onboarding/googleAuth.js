import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../../config/supabaseClient';

WebBrowser.maybeCompleteAuthSession();

export const executeGoogleSignIn = async () => {
  try {
    // Step 1: Request an OAuth URL from Supabase for Google
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'machaira://auth-callback', // Match your Supabase dashboard whitelist exactly
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    // Step 2: Open Safari and listen for the returning deep link
    const result = await WebBrowser.openAuthSessionAsync(data.url, 'machaira://');
    
    // Step 3: Parse the incoming tokens out of the landing URL
    if (result.type === 'success' && result.url) {
      const urldecoded = decodeURIComponent(result.url);
      
      // Extract access_token and refresh_token from the hash fragment (#)
      const params = new URLSearchParams(urldecoded.split('#')[1]);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        // Step 4: Explicitly hand the tokens over to your Supabase client
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) throw sessionError;

        const user = sessionData?.user;
        return {
          success: true,
          data: {
            id: user?.id,
            email: user?.email,
            name: user?.user_metadata?.full_name || user?.user_metadata?.name,
            photo: user?.user_metadata?.avatar_url,
          },
        };
      }
    }

    return { success: false, error: 'Sign-in sequence canceled or tokens missing.' };
  } catch (error) {
    return { success: false, error: error.message || 'Google Auth failed' };
  }
};