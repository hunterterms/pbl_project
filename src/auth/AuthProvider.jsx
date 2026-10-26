import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteUserAttributes, fetchAuthSession, fetchUserAttributes, signInWithRedirect, signOut as amplifySignOut, updateUserAttributes
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { AuthContext } from './AuthContext';
import { configureAuth, isAuthConfigured } from './config';
import { PROFILE_ATTRIBUTES, toUser } from './user';

// Amplify's names for the identity providers on the Cognito app client
const PROVIDERS = { google: 'Google', apple: 'Apple' };

// Reads the signed-in user's profile from Cognito, or returns null when nobody is signed in
async function loadProfile() {
  // Waits for a sign-in redirect to finish, and refreshes the tokens if they've expired
  const { tokens } = await fetchAuthSession();
  if (!tokens?.idToken) return null;

  const claims = tokens.idToken.payload;
  // The ID token's copy of the profile can be up to an hour old, so ask Cognito for the latest one
  const attributes = await fetchUserAttributes().catch((error) => {
    console.error('Could not load the profile from Cognito, using the copy in the ID token:', error);
    return claims;
  });
  return { attributes, claims };
}

// Keeps track of who's signed in (with Google or Apple, through Amazon Cognito) and shares it via useAuth()
export default function AuthProvider({ children }) {
  const [status, setStatus] = useState(isAuthConfigured ? 'loading' : 'unconfigured');
  const [profile, setProfile] = useState(null); // { attributes, claims } from Cognito
  const [error, setError] = useState(null);

  const refresh = useCallback(() => loadProfile()
    .then((loaded) => {
      setProfile(loaded);
      setStatus(loaded ? 'signedIn' : 'signedOut');
      if (loaded) setError(null);
    })
    .catch((err) => {
      console.error('Could not check who is signed in:', err);
      setProfile(null);
      setStatus('signedOut');
    }), []);

  useEffect(() => {
    if (!isAuthConfigured) return undefined;

    // Amplify announces sign-ins and sign-outs on its Hub. Start listening before connecting to Cognito:
    // connecting finishes any sign-in that's coming back from Google/Apple, and failures are announced right away.
    const stopListening = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
          refresh();
          break;
        case 'signInWithRedirect_failure': // e.g. they cancelled on the Google/Apple page
          console.error('Sign-in failed:', payload.data?.error);
          setError("Sign-in didn't finish. Please try again.");
          window.history.replaceState(window.history.state, '', window.location.pathname); // Drop Cognito's ?error=... from the address bar
          refresh(); // A check that started while the sign-in was still finishing can be left waiting, so check again
          break;
        case 'signedOut':
        case 'tokenRefresh_failure': // The session ran out or was revoked
          setProfile(null);
          setStatus('signedOut');
          break;
        default:
      }
    });

    configureAuth();
    refresh();
    return stopListening;
  }, [refresh]);

  // Sends the user to Google or Apple. They come back to /profile, where Amplify finishes signing them in.
  // Returns false if the browser isn't on its way there.
  const signIn = useCallback(async (provider) => {
    setError(null);
    try {
      await signInWithRedirect({ provider: PROVIDERS[provider] });
      return true;
    } catch (err) {
      if (err.name === 'UserAlreadyAuthenticatedException') {
        refresh();
      } else {
        console.error('Could not start sign-in:', err);
        setError("Couldn't open the sign-in page. Please try again.");
      }
      return false;
    }
  }, [refresh]);

  // Forgets the tokens, then goes through Cognito's logout page back to the home page
  const signOut = useCallback(async () => {
    try {
      await amplifySignOut();
    } catch (err) {
      console.error('Could not log out:', err);
    }
  }, []);

  // Saves the editable profile fields (see PROFILE_ATTRIBUTES) to Cognito.
  // Fields that were cleared are deleted rather than saved as empty text.
  const updateProfile = useCallback(async (changes) => {
    const updates = {};
    const deletions = [];
    Object.entries(changes).forEach(([field, value]) => {
      const attribute = PROFILE_ATTRIBUTES[field];
      const text = value.trim();
      if (text) updates[attribute] = text;
      else if (profile?.attributes[attribute]) deletions.push(attribute);
    });

    try {
      if (Object.keys(updates).length > 0) await updateUserAttributes({ userAttributes: updates });
      if (deletions.length > 0) await deleteUserAttributes({ userAttributeKeys: deletions });
    } catch (err) {
      refresh(); // Part of the save may have gone through, so show what Cognito has now
      throw err;
    }

    setProfile((prev) => {
      const attributes = { ...prev.attributes, ...updates };
      deletions.forEach((attribute) => delete attributes[attribute]);
      return { ...prev, attributes };
    });
  }, [profile, refresh]);

  const user = useMemo(() => (profile ? toUser(profile.attributes, profile.claims) : null), [profile]);

  const value = useMemo(
    () => ({ status, user, error, signIn, signOut, updateProfile }),
    [status, user, error, signIn, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
