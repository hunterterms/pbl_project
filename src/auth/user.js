// The Cognito user attribute behind each field students can edit on the My Profile page.
// `nickname` is a standard attribute; the custom ones are created by infra/cognito.yaml.
// (name, email and picture aren't editable here: Cognito copies them from Google/Apple on every sign-in.)
export const PROFILE_ATTRIBUTES = {
  displayName: 'nickname',
  course: 'custom:course',
  year: 'custom:year',
  bio: 'custom:bio',
};

// Cognito's provider names → the names people know
const PROVIDER_NAMES = { Google: 'Google', SignInWithApple: 'Apple' };

// Builds the app's user object from Cognito's user attributes and the ID token's claims
export function toUser(attributes, claims) {
  const accountName = attributes.name || [attributes.given_name, attributes.family_name].filter(Boolean).join(' ');
  const identity = claims.identities?.[0]; // The Google or Apple account they signed in with

  const user = {
    id: attributes.sub,
    email: attributes.email,
    picture: attributes.picture, // Apple doesn't share a photo, so Apple users get their initials instead
    accountName,
    provider: PROVIDER_NAMES[identity?.providerName],
    memberSince: identity?.dateCreated ? new Date(Number(identity.dateCreated)) : null,
  };
  Object.entries(PROFILE_ATTRIBUTES).forEach(([field, attribute]) => {
    user[field] = attributes[attribute] ?? '';
  });

  // The name shown around the app: the display name they picked, else the one on their Google/Apple account
  user.name = user.displayName || accountName || user.email?.split('@')[0] || 'Student';
  return user;
}
