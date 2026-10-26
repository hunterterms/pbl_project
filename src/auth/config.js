import { Amplify } from 'aws-amplify';
import 'aws-amplify/auth/enable-oauth-listener'; // Finishes the sign-in when Google or Apple sends the user back

// Sign-in runs on Amazon Cognito. The values come from .env.local (see .env.example and infra/README.md).
// They aren't secret: they end up in the JavaScript that every visitor downloads.
const env = import.meta.env;

const cognito = {
  userPoolId: env.VITE_COGNITO_USER_POOL_ID,
  userPoolClientId: env.VITE_COGNITO_CLIENT_ID,
  // Amplify wants the bare host name, so drop a pasted "https://" or trailing slash
  domain: env.VITE_COGNITO_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/+$/, ''),
};

// Without these, the app still works but the sign-in buttons are disabled
export const isAuthConfigured = Object.values(cognito).every(Boolean);

// The sign-in buttons to show. Only list providers that are set up in Cognito,
// otherwise Cognito shows an error page when someone picks one.
export const AUTH_PROVIDERS = (env.VITE_AUTH_PROVIDERS || 'google,apple')
  .split(',')
  .map((provider) => provider.trim().toLowerCase())
  .filter((provider) => provider === 'google' || provider === 'apple');

// After signing in, users land on their profile. After logging out, on the home page.
// Both URLs must also be listed on the Cognito app client (CallbackUrls / LogoutUrls in infra/cognito.yaml).
const SIGN_IN_REDIRECT = `${window.location.origin}/profile`;
const SIGN_OUT_REDIRECT = `${window.location.origin}/`;

export function configureAuth() {
  if (!isAuthConfigured) return;

  Amplify.configure({
    Auth: {
      Cognito: {
        ...cognito,
        loginWith: {
          oauth: {
            domain: cognito.domain,
            // aws.cognito.signin.user.admin lets signed-in users read and edit their own profile
            scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
            redirectSignIn: [SIGN_IN_REDIRECT],
            redirectSignOut: [SIGN_OUT_REDIRECT],
            responseType: 'code',
          },
        },
      },
    },
  });
}
