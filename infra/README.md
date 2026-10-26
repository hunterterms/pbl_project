# Sign-in setup: Google and Apple through Amazon Cognito

Students sign in to UniHub with their Google or Apple account. There are no UniHub passwords.
[`cognito.yaml`](cognito.yaml) is a CloudFormation template that creates everything on the AWS side:
a Cognito user pool, its sign-in domain, the Google and Apple connections, and the app client the website uses.

## What it costs

Nothing, as long as fewer than 10,000 people use UniHub in a month. Cognito's free tier covers
10,000 monthly active users who sign in through a social provider like Google or Apple, on the Lite
and Essentials plans. It doesn't expire after AWS's 12-month free period. A monthly active user is
anyone who signs in, or uses UniHub while signed in, during that month.

The template keeps you inside that free tier:

| Setting | Why |
| --- | --- |
| Lite plan | It's the cheapest plan and has everything UniHub uses. Cognito picks Essentials if you don't say otherwise. |
| Google and Apple as Cognito's built-in social providers | Sign-ins through generic OIDC or SAML providers only get 50 free users a month. |
| Cognito-hosted domain (`<prefix>.auth.<region>.amazoncognito.com`) | A custom domain needs a certificate and DNS records. |
| No passwords, MFA, SMS or emails | Text messages are billed, and there's nothing to verify or reset. |
| No threat protection | That's the Plus plan, which has no free tier. |
| Profile details stored on the Cognito user | No database, Lambda or API needed for My Profile. |
| Secrets passed as hidden (`NoEcho`) stack parameters | Secrets Manager charges per secret. |

Apple charges separately: Sign in with Apple needs a membership in the Apple Developer Program
(US$99 a year). You can start with Google only and add Apple later.

Tip: in AWS Budgets, create a budget from the **Zero spend budget** template. You'll get an email if
anything in your account ever starts costing money.

## 1. Choose a domain prefix and region

Pick a prefix for your sign-in address, such as `unihub-yourname`. Use lowercase letters, numbers and
hyphens. Pick a region too: `us-east-1` matches the items API.
Google and Apple both need this redirect URL, so note it down:

```
https://<prefix>.auth.<region>.amazoncognito.com/oauth2/idpresponse
```

## 2. Create a Google OAuth client

1. In the [Google Cloud console](https://console.cloud.google.com/), create a project and open
   **Google Auth Platform**.
2. Fill in **Branding**: app name UniHub, a support email, and `amazoncognito.com` under
   **Authorized domains**.
3. Under **Audience**, choose **External**.
4. Under **Clients**, create a client of type **Web application** with:
   - Authorized JavaScript origins: `https://<prefix>.auth.<region>.amazoncognito.com`
   - Authorized redirect URIs: `https://<prefix>.auth.<region>.amazoncognito.com/oauth2/idpresponse`
5. Copy the client ID and client secret.
6. Under **Audience**, click **Publish app**. Until you do, only the test users listed there can sign in.
   UniHub only asks for your name, email and photo (`openid email profile`), so Google doesn't need to review it.

## 3. Set up Sign in with Apple (optional)

This needs an Apple Developer Program membership. In
[Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources):

1. **Identifiers → App IDs**: register an App ID (for example `com.yourname.unihub`) with
   **Sign in with Apple** turned on.
2. **Identifiers → Services IDs**: register a Services ID (for example `com.yourname.unihub.signin`).
   Turn on **Sign in with Apple**, click **Configure**, and enter:
   - Primary App ID: the App ID from step 1
   - Domains and Subdomains: `<prefix>.auth.<region>.amazoncognito.com`
   - Return URLs: `https://<prefix>.auth.<region>.amazoncognito.com/oauth2/idpresponse`
3. **Keys**: create a key with **Sign in with Apple** turned on, configured for the same App ID.
   Download the `.p8` file (Apple only lets you download it once) and note the **Key ID**.
4. Your **Team ID** is on the Membership page of your developer account.

## 4. Deploy the stack

The easiest way is [AWS CloudShell](https://console.aws.amazon.com/cloudshell/home). It's free, already
signed in, and has the AWS CLI installed. Upload `infra/cognito.yaml` (and your `.p8` file for Apple)
with **Actions → Upload file**, then run:

```bash
aws cloudformation deploy \
  --region us-east-1 \
  --stack-name unihub-auth \
  --template-file cognito.yaml \
  --parameter-overrides \
    DomainPrefix=unihub-yourname \
    GoogleClientId=1234567890-abc.apps.googleusercontent.com \
    GoogleClientSecret=GOCSPX-your-secret \
    "CallbackUrls=http://localhost:5173/profile,https://your-site.example/profile" \
    "LogoutUrls=http://localhost:5173/,https://your-site.example/" \
    AppleServicesId=com.yourname.unihub.signin \
    AppleTeamId=ABCDE12345 \
    AppleKeyId=XYZ9876543 \
    "ApplePrivateKey=$(cat AuthKey_XYZ9876543.p8)"
```

- **Google only:** leave out the four Apple lines. To add Apple later, run the same command with just
  those four lines. Settings you don't repeat keep their current values.
- **CallbackUrls and LogoutUrls** must list every address UniHub runs at: the `/profile` page for
  sign-in and the home page for log-out. They must match exactly, including `http`/`https` and the
  trailing slash on the home page.

Then print the values the app needs:

```bash
aws cloudformation describe-stacks --region us-east-1 --stack-name unihub-auth \
  --query "Stacks[0].Outputs" --output table
```

## 5. Point UniHub at Cognito

Copy `.env.example` to `.env.local` in the project root and fill it in with those outputs:

```
VITE_COGNITO_USER_POOL_ID=us-east-1_AbCdEf123
VITE_COGNITO_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m
VITE_COGNITO_DOMAIN=unihub-yourname.auth.us-east-1.amazoncognito.com
VITE_AUTH_PROVIDERS=google,apple
```

Restart `npm run dev` and open http://localhost:5173/profile.
When you host the site somewhere, set the same `VITE_` variables in the host's build settings. Also add
the site's `/profile` and home page addresses to `CallbackUrls` and `LogoutUrls`.

## Good to know

- **Where the profile lives:** the display name, course, year and bio are stored on the student's
  Cognito user as `nickname`, `custom:course`, `custom:year` and `custom:bio`. Only that student can
  read or change them. To show them to other students later (on listings, for example), store
  profiles in DynamoDB behind the API instead.
- **Name, email and photo** come from Google or Apple, and Cognito copies them again at every sign-in.
  That's why they can't be edited in UniHub. The display name is shown instead of the name when it's set.
- **Apple** shares the name only the first time someone signs in, never shares a photo, and lets
  people hide their email address. UniHub then sees an `@privaterelay.appleid.com` address.
- **Google and Apple accounts with the same email** become two separate UniHub accounts. Cognito
  doesn't merge them.
- **Building an API on top of this?** Identify students by the `sub` claim in their token, not by
  their email. Students can edit their own Cognito attributes.
- **Deleting the stack keeps the user pool**, so accounts aren't lost by accident. Delete the pool in
  the Cognito console if you really want it gone.

### Troubleshooting

- Cognito says **redirect_mismatch**: the address you signed in or out from isn't in `CallbackUrls`
  or `LogoutUrls`.
- Google says **Error 400: redirect_uri_mismatch**: the Google client's redirect URI doesn't match
  the `IdentityProviderRedirectUri` output.
- Apple says **invalid_client**: check the Services ID, Team ID and Key ID, and the Return URL in the
  Services ID settings.
- The sign-in buttons are greyed out: `.env.local` is missing a value, or you didn't restart `npm run dev`.
