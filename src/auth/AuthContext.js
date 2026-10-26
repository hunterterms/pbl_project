import { createContext, useContext } from 'react';

// Who's signed in, shared with the whole app by AuthProvider
export const AuthContext = createContext(null);

// Returns { status, user, error, signIn, signOut, updateProfile }.
// status is 'loading', 'signedIn', 'signedOut', or 'unconfigured' (no Cognito settings in .env.local).
export const useAuth = () => useContext(AuthContext);
