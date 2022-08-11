# IMPORTANT NOTE - PLEASE READ

This version and versions going forward demonstrate the use of code splitting. You must be on Looker version 21.0 or above for code splitting to work correctly.

To remove code splitting you will need to modify `KitchenSink.tsx`. Instructions are provided in this file to show how to fall back to building a single monolithic JavaScript bundle.

# Looker Extension Kitchensink Example (React & TypeScript)

This repository demonstrates functionality that is available to the Extension SDK. It can be used as a starting point for developing
your own extensions.

It uses [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) for writing your extension, the [React Extension SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk-react) for interacting with Looker, and [Webpack](https://webpack.js.org/) for building your code.

## Getting Started for Development

1. Clone or download a copy of this repository to your development machine.

   ```
   # cd ~/ Optional. your user directory is usually a good place to git clone to.
   git clone git@github.com:looker-open-source/extension-examples.git
   ```

2. Navigate (`cd`) to the template directory on your system

   ```
   cd extension-examples/react/typescript/kitchensink
   ```

3. Install the dependencies with [Yarn](https://yarnpkg.com/).

   ```
   yarn install
   ```

   > You may need to update your Node version or use a [Node version manager](https://github.com/nvm-sh/nvm) to change your Node version.

4) Start the development server

   ```
   yarn develop
   ```

   Great! Your extension is now running and serving the JavaScript at https://localhost:8080/bundle.js.

5) Now log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   You'll want to select "Blank Project" as your "Starting Point". You'll now have a new project with no files.

   1. In your copy of the extension project you have a `manifest.lkml` file.

   You can either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

   ```
   application: kitchensink {
     label: "Kitchen sink"
     url: "https://localhost:8080/bundle.js"
     entitlements: {
        local_storage: yes
        navigation: yes
        new_window: yes
        use_form_submit: yes
        use_embeds: yes
        core_api_methods: ["all_connections","search_folders", "run_inline_query", "me", "all_looks", "run_look"]
        external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000", "https://*.googleapis.com", "https://*.github.com", "https://REPLACE_ME.auth0.com"]
        oauth2_urls: ["https://accounts.google.com/o/oauth2/v2/auth", "https://github.com/login/oauth/authorize", "https://dev-5eqts7im.auth0.com/authorize", "https://dev-5eqts7im.auth0.com/login/oauth/token", "https://github.com/login/oauth/access_token"]
        scoped_user_attributes: ["user_value"]
        global_user_attributes: ["locale"]
     }
   }
   ```

The manifest includes a reference to the `oauth2_url https://REPLACE_ME.auth0.com`. This URL needs to be obtained from Auth0 and is explained later in this document.

6. Create a `model` LookML file in your project. The name doesn't matter. The model and connection won't be used, and in the future this step may be eliminated.

   - Add a connection in this model. It can be any connection, it doesn't matter which.
   - [Configure the model you created](https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model) so that it has access to some connection.

7. Connect your new project to Git. You can do this multiple ways:

   - Create a new repository on GitHub or a similar service, and follow the instructions to [connect your project to Git](https://docs.looker.com/data-modeling/getting-started/setting-up-git-connection)
   - A simpler but less powerful approach is to set up git with the "Bare" repository option which does not require connecting to an external Git Service.

8. Commit your changes and deploy your them to production through the Project UI.

9. Reload the page and click the `Browse` dropdown menu. You should see your extension in the list.
   - The extension will load the JavaScript from the `url` provided in the `application` definition. By default, this is https://localhost:8080/bundle.js. If you change the port your server runs on in the package.json, you will need to also update it in the manifest.lkml.

- Refreshing the extension page will bring in any new code changes from the extension template, although some changes will hot reload.

10. Use with an access key requires a bit more setup. First, create a .env file in the `extension-examples/react/typescript/kitchensink` directory with the following entries. Use a password generator to create the values. These values should be set prior to starting the development and data servers. **Do NOT store the .env file in your source code repository.**

```
CUSTOM_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_API_KEY=
GITHUB_CLIENT_ID=
AUTH0_CLIENT_ID=
AUTH0_BASE_URL=
POSTS_SERVER_URL=http://127.0.0.1:3000
```

POSTS_SERVER_URL is the URL of the data server.

See the "External API Functions" section for more information on CUSTOM_CLIENT_SECRET and other variables.

## Extension Entitlements

Going forward, most new features added to the Extension SDK will require that an entitlement be defined for the feature in the
application manifest. If you plan on adding your extension to the Looker Marketplace, entitlements MUST be defined, even for
existing functionality. Eventually most existing Extension SDK features will require entitlements to be defined so it is recommended
that you start defining entitlements now.

The external API feature demonstrated in the Kitchensink is a new feature and requires that entitlements are defined. This is now reflected
in the sample manifest contained repository.

## Demoed Extension Features

### Context Functions

Extensions can share context data between users. The context data can be used for data that does not change frequently and to share amongst different users of the extension. Care should be taken when writing the data as there is no data locking and the last write wins. The context data is available to the extension immediately. Functions are provided to write and refresh the data.

- `getContextData` - get the context data.
- `saveContextData` - writes context data to the Looker server.
- `refreshContextData` - gets the lastest context data from the Looker server.

The configuation component demonstrates the context functionality. It can be used to show/hide views in the Kitchen Sink. It can also be used to change the keys used for the embed demonstrations.

### API Functions

API functions demonstrates the following functionality

- Update title - modifies the title of the page the extension is running in.
- Navigation - navigates to different locations in the Looker server using the current page (browse and marketplace).
- Open new window - opens a new browser window.
- Verify host connection - simple mechanism to check whether the extension and Looker host are in touch. In reality an extension will never need to use this functionality.
- Local storage access - ability to read, write and remove data from local storage. Note that localstorage is namespaced to the extension.
- Pinger action - demonstrates sending data to Lookers pinger server.
- Generate error - demonstrates that extension errors are reported. Note that in Looker server development mode these are not reported.
- Route test - demonstrates routing with query strings and push state.

### Core SDK Functions

Core SDK functions demonstrates various calls the Looker SDK.

- All connections (GET method)
- Search folders (GET with parameters)
- Inline query (POST method)

### Embed Functions

There are three Embed demonstrations:

- Dashboard - can be toggled between class and next dashboards.
- Explore
- Look

### External API Functions

#### Fetch Proxy and OAUTH2 Authentication

The fetch proxy demonstration requires that a json data server be running. To start the server run the command

```
yarn data-server
```

An error message will be displayed if the server is not running OR if the required entitlements are not defined.

##### Custom API setup

The custom client secret in .env can be any value. It is NOT used in the extension but is used by the demo data server to validate whether a user is authorized the data server (note that the implemention is exceedingly simplistic and is just used for demo purposes). The client secret should be added to the `.env` file so that the data server can do a simple check.

```
CUSTOM_CLIENT_SECRET=
```

The custom client secret must also be added to the User attributes in the looker server. The user attribute should be set up as follows:

- name - `kitchensink_kitchensink_custom_secret_key`
- user acess - view
- hide values - yes
- domain whitelist - http://127.0.0.1:3000/*
- default value - your secret key

The extension authenticates the user by adding a secret key tag to the authentication request. The secret key tag is replaced by the Looker server with the user attribute value. The authentication endpoint then returns a JWT token that can be used in subsequent requests. The code that does this is found in the `Auth.tsx` file:

```typescript
const dataServerAuth = async (body: any): Promise<string | undefined> => {
  try {
    // The custom secret will be resolved by the Looker server.
    body.client_secret = extensionSDK.createSecretKeyTag('custom_secret_key')
    const response = await extensionSDK.serverProxy(
      `${POSTS_SERVER_URL}/auth`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      }
    )
    if (response.ok && response.body && response.body.jwt_token) {
      return response.body.jwt_token
    }
  } catch (error) {
    console.error(error)
  }
  return undefined
}
```

##### Google Sheets API setup

The demo requires a client id and an API key to access the Google sheets API. To obtain one, [click here](https://developers.google.com/sheets/api/quickstart/js) and follow the instructions in step 1. The following values need to be setup in the `.env` file, these values can be found in the [google developer console](https://console.developers.google.com/).

```
GOOGLE_CLIENT_ID=Application OAUTH2 client ID
GOOGLE_API_KEY=Application API key
```

When the user uses the Google OAUTH2 authorization mechanism the client id is used. The extension accesses the sheets API directly. Note that the OAUTH2 implicit flow is used to authorize with Google.

When the user uses the other authorization mechanisms, the extension access the sheets API using the serverProxy call. The data server uses the API key to access the sheets API. This way the API key is NOT exposed in the extension code.

##### Github OAUTH2 setup

The Github OAUTH2 mechanism uses the Authorization code grant type with secret key. Create a [Github OAUTH App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/). Add the Github client id to your .env file

```
GITHUB_CLIENT_ID=Github OAUTH2 client ID
```

The Github client secret must also be added to the User attributes in the looker server. The user attribute should be set up as follows:

- name - `kitchensink_kitchensink_github_secret_key`
- user acess - view
- hide values - yes
- domain whitelist - https://github.com/login/oauth/access_token
- default value - Github client secret

See `Auth.tsx` for authorizing use Github OAUTH2 Authorization code grant type with secret key.

```typescript
const githubSignin = async () => {
  try {
    const response = await extensionSDK.oauth2Authenticate(
      'https://github.com/login/oauth/authorize',
      {
        client_id: GITHUB_CLIENT_ID,
        response_type: 'code',
      },
      'GET'
    )
    const codeExchangeResponse = await extensionSDK.oauth2ExchangeCodeForToken(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: extensionSDK.createSecretKeyTag('github_secret_key'),
        code: response.code,
      }
    )
    const { access_token } = codeExchangeResponse
    // Success handling
  } catch (error) {
    // Error handling
  }
}
```

##### Auth0 OAUTH2 setup

The Auth0 OAUTH2 mechanism uses the uses the Authorization Code grant type with either a secret key or PKCE (code challenge & code verifier). Create a [Auth0 account](https://auth0.com). Add the Auth0 client id and base URL to your .env file

```
AUTH0_CLIENT_ID=Auth0 Client id
AUTH0_BASE_URL=https://{tenant_id}.auth0.com
```

The Auth0 application client secret must also be added to the User attributes in the looker server. The user attribute should be set up as follows:

- name - `kitchensink_kitchensink_auth0_secret_key`
- user acess - view
- hide values - yes
- domain whitelist - https://{tenant_id}.auth0.com/login/oauth/token
- default value - Auth0 client secret

See `Auth.tsx` for authorizing using the Auth0 OAUTH2 Authorization Code grant type. The following demonstrates use of the secret key.

```typescript
const auth0Signin = async () => {
  try {
    const response = await extensionSDK.oauth2Authenticate(
      `${AUTH0_BASE_URL}/authorize`,
      {
        client_id: AUTH0_CLIENT_ID,
        response_type: 'code',
        scope: AUTH0_SCOPES,
      },
      'GET'
    )
    const codeExchangeResponse = await extensionSDK.oauth2ExchangeCodeForToken(
      `${AUTH0_BASE_URL}/login/oauth/token`,
      {
        grant_type: 'authorization_code',
        client_id: AUTH0_CLIENT_ID,
        client_secret: extensionSDK.createSecretKeyTag('auth0_secret_key'),
        code: response.code,
      }
    )
    const { access_token, expires_in } = codeExchangeResponse
    // Success processing
  } catch (error) {
    // Error processing
  }
}
```

See `Auth.tsx` for authorizing using the Auth0 OAUTH2 PKCE (code challenge & code verifier). The following demonstrates use of the code challenge.

```typescript
const auth0Signin = async () => {
  try {
    const response = await extensionSDK.oauth2Authenticate(
      `${AUTH0_BASE_URL}/authorize`,
      {
        client_id: AUTH0_CLIENT_ID,
        response_type: 'code',
        scope: AUTH0_SCOPES,
        authRequest.code_challenge_method = 'S256',
      },
      'GET'
    )
    const codeExchangeResponse = await extensionSDK.oauth2ExchangeCodeForToken(
      `${AUTH0_BASE_URL}/login/oauth/token`,
      {
        grant_type: 'authorization_code',
        client_id: AUTH0_CLIENT_ID,
        code: response.code,
      }
    )
    const { access_token, expires_in } = codeExchangeResponse
    // Success processing
  } catch (error) {
    // Error processing
  }
}
```

## Code Splitting

Code-Splitting is a feature that can create _multiple_ bundles rather than just one bundle.js, which can then be dynamically loaded on the fly. This can drastically reduce bundle size, and in turn, app performance. For more info on React & code splitting, see the [React Docs](https://reactjs.org/docs/code-splitting.html).

Code splitting relies on `React.lazy` and `Suspense` to render dynamic imports of a component. The name of the generated JavaScript file can be influenced by specifying a webpackChunkName comment. Note that the `Suspense` component is rendered by the `KitchenSink` component.

Example:

````typescript
import React, { lazy, Suspense } from 'react'

const Home = lazy<any>(
  async () => import(/* webpackChunkName: "home" */ './Home')
)

export const AsyncHome: React.FC = () => <Home />
```

Note that the imported component MUST be the default export for the module.

```typescript
import React from 'react'
import { Heading, Paragraph, SpaceVertical } from '@looker/components'
import { SandboxStatus } from '../SandboxStatus'
import { HomeProps } from './types'

const Home: React.FC<HomeProps> = () => {
  return <>. . .</>
}

export default Home
````

## Tree Shaking

The following packages now support tree shaking which reduces the size the bundle generated:

1. `@looker/sdk`
2. `@looker/sdk-rtl`
3. `@looker/extension-sdk`
4. `@looker/extension-sdk-react`

Note that the `@looker/components` does not yet support tree shaking but when it does bundle sizes should be reduced even further.

To fully take advantage of tree shaking, the extension should use a single SDK and use `ExtensionProvider40` which only pulls in dependent code for SDK 4.0.

Example setup (see `App.tsx`):

```typescript
return (
  <ExtensionProvider40 onRouteChange={onRouteChange}>
    <KitchenSink route={route} routeState={routeState} />
  </ExtensionProvider40>
)
```

Example usage:

```typescript
const extensionContext = useContext<ExtensionContextData40>(ExtensionContext40)
const { extensionSDK, coreSDK } = extensionContext

OR

const sdk = getCoreSDK40()
```

## Deployment

The process above requires your local development server to be running to load the extension code. To allow other people to use the extension, a production build of the extension needs to be run. As the kitchensink uses code splitting to reduce the size of the initially loaded bundle, multiple JavaScript files are generated.

1. In your extension project directory on your development machine, build the extension by running the command `yarn build`.
2. Drag and drop ALL of the generated JavaScript files contained in the `dist` directory into the Looker project interface.
3. Modify your `manifest.lkml` to use `file` instead of `url` and point it at the `bundle.js` file:
   ```
   application: kitchensink {
     label: "Kitchen sink"
     file: "bundle.js"
       entitlements: {
        local_storage: yes
        navigation: yes
        new_window: yes
        use_form_submit: yes
        use_embeds: yes
        core_api_methods: ["all_connections","search_folders", "run_inline_query", "me", "all_looks", "run_look"]
        external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000", "https://*.googleapis.com", "https://*.github.com", "https://REPLACE_ME.auth0.com"]
        oauth2_urls: ["https://accounts.google.com/o/oauth2/v2/auth", "https://github.com/login/oauth/authorize", "https://dev-5eqts7im.auth0.com/authorize", "https://dev-5eqts7im.auth0.com/login/oauth/token", "https://github.com/login/oauth/access_token"]
        scoped_user_attributes: ["user_value"]
        global_user_attributes: ["locale"]
      }
   }
   ```

Note that the additional JavaScript files generated during the production build process do not have to be mentioned in the manifest. These files will be loaded dynamically by the extension as and when they are needed. Note that to utilize code splitting, the Looker server must be at version 7.21 or above.

## Notes

- This template uses Looker's [component library](https://components.looker.com) and [styled components](https://styled-components.com/). Neither of these libraries are required, and you may remove and replace them with a component library of your own choice or simply build your UI from scratch.

## Related Projects

- [Looker Extension SDK React](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk-react)
- [Looker Extension SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk)
- [Looker SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/sdk)
- [Looker Embed SDK](https://github.com/looker-open-source/embed-sdk)
- [Looker Components](https://components.looker.com/)
- [Styled components](https://www.styled-components.com/docs)
