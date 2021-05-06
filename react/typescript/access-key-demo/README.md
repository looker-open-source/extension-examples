# Looker Extension Access Key Demo Example (React & TypeScript)

This repository demonstrates how to write a Looker extension that needs an access key to run. This is useful for building monetized extensions.

It uses [React](https://reactjs.org/) and [Typescript](https://typescriptlang.org) for writing your extension, the [React Extension SDK]((https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk-react) for interacting with Looker, [Looker Components](https://components.looker.com) for UI, and [Webpack](https://webpack.js.org/) for building your code.
This version of the template requires Looker 7.10 or above.

## Getting Started for Development

1. Clone or download a copy of this repository to your development machine.

   ```
   # cd ~/ Optional, your user directory is usually a good place to git clone to.
   git clone git@github.com:looker-open-source/extension-examples.git
   ```

2. Navigate (`cd`) to the template directory on your system

   ```
   cd extension-examples/react/typescript/access-key-demo
   ```

3. Install the dependencies with [Yarn](https://yarnpkg.com/).

   ```
   yarn install
   ```

   > You may need to update your Node version or use a [Node version manager](https://github.com/nvm-sh/nvm) to change your Node version.

4. Start the development server

   ```
   yarn develop
   ```

The extension is now running and serving the JavaScript locally at http://localhost:8080/bundle.js. Nice!

5. Log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   You'll want to select "Blank Project" as your "Starting Point". You'll now have a new project with no files.

   1. In your copy of the extension project you have `manifest.lkml` file.

   You can either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

```
  project_name: "access_key_demo"
  application: access_key_demo {
    label: "Extension Access Key Demo"
    url: "http://localhost:8080/bundle.js"
    entitlements: {
      use_form_submit: yes
      core_api_methods: ["me", "all_user_attributes", "delete_user_attribute", "create_user_attribute"]
      external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000"]
    }
  }
```

6. Create a `model` LookML file in your project. The name doesn't matter but the convention is to name it the same as the project— in this case, access-key-demo.

- Add a connection in this model. It can be any connection, it doesn't matter which.
- [Configure the model you created](https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model) so that it has access to the connection.
  We do this because Looker permissions data access via models— In order to grant / limit access to an extension, it must be associated with a model.

7. Connect your new project to Git. You can do this multiple ways:

- Create a new repository on GitHub or a similar service, and follow the instructions to [connect your project to Git](https://docs.looker.com/data-modeling/getting-started/setting-up-git-connection)
- A simpler but less powerful approach is to set up git with the "Bare" repository option which does not require connecting to an external Git Service.

8. Commit your changes and deploy your them to production through the Project UI.

9. Reload the page and click the `Browse` dropdown menu. You should see the extension in the list.

- The extension will load the JavaScript from the `url` provided in the `application` definition. By default, this is http://localhost:8080/bundle.js. If you change the port your server runs on in the package.json, you will need to also update it in the manifest.lkml.
- Refreshing the extension page will bring in any new code changes from the extension template, although some changes will hot reload.

10. Use with an access key requires a bit more setup. First, create a .env file in the `extension-examples/react/typescript/access-key-demo` directory with the following entries. Use a password generator to create the values. These values should be set prior to starting the development and data servers. **Do NOT store the .env file in your source code repository.**

```
ACCESS_KEY=
JWT_TOKEN_SECRET=
DATA_SERVER_URL=http://127.0.0.1:3000
```

11. This access key demo requires a data server to be running in order to validate the access key. Note that this is just sample code to demonstrate concepts— It is by no means production grade code. To start the demo data server, run the following command from the `extension-examples/react/typescript/access-key-demo` directory:

```
yarn start-server
```

12. Use the browse menu to navigate to the extension. The access check will fail because it has not yet been configured. Click the Configure button and enter the ACCESS_KEY that you previously set in the .env file. Navigate back to the Home page. The access key check should now work. Click the Verify JWT to validate the JWT token.

## Production Deployment

The process above requires your local development server to be running to load the extension code. To allow other people to use the extension build the JavaScript file and include it in the project directly.

1. In your extension project directory build the extension with `yarn build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify your `manifest.lkml` to use `file` instead of `url`:
   ```
   project_name: "access_key_demo"
   application: access_key_demo {
    label: "Extension Access Key Demo"
    file: "bundle.js"
    entitlements: {
      use_form_submit: yes
      core_api_methods: ["me", "all_user_attributes", "delete_user_attribute", "create_user_attribute"]
      external_api_urls: ["http://127.0.0.1:3000", "http://localhost:3000"]
    }
   }
   ```

## Notes

- This template uses Looker's [component library](https://components.looker.com) and [styled components](https://styled-components.com/). Neither of these libraries are required, and you may remove and replace them with a component library of your own choice or simply build your UI from scratch.

## Production Implementation Details

- So you've got a great idea for an extension you want to monetize and you want to get started building the production key management infrastructure. How do you get started?

  1. You're going to need a server to validate that the extension users' keys are valid. For an example, see `/server/index.js`, where we've implemented an extremely basic (and non-functional) example that shows the necessary endpoints. The important route is `/access_check` where you need to validate the access key being sent, and return a token that will be used to validate further requests. It's up to you to manage key invalidation, user state, key TTL, and anything else that's important to the authorization process of your extension.

  2. You're going to need to set an access key for your extension. One example for this can be found in `src/scenes/ConfigurationScene/ConfigurationScene.tsx::onAccessKeySubmit`. You'll notice that we use the Extension SDK to save the key as a user attribute. You can also store this key as a user attribute through the Looker UI, or include it as a field in the `marketplace.json` file (see marketplace considerations below), which requires the extension framework to request the key from the extension's authentication server and allows the user to set it during the extension configuration.

  3. Once the access key has been set, you can make requests to your authentication server through the extension framework. An example of this can be seen in the initialize function of `src/scenes/HomeScene/HomeScene.tsx`. There, you can use the extension framework to create the tag for your access key. That tag can then be included anywhere in your request, and the Looker server will take care of replacing the string value with the actual value of your stored access key. Your server should receive a request with the key and other data you're sending, and you can decide if the request is authenticated. If so, you can return any value you want (though we recommend a JSON Web Token (JWT) for this job). **_DO NOT_** return the access key, as it will then be exposed in plaintext in the users' client. It's up to you to decide what to do with the response from your server.

  ### Marketplace Considerations

  Sample Marketplace configuration files can be found the the marketplace_config directory.

  #### Manifest file

  Note that the manifest.lkml is slightly different from the manifest described above, as it contains a LookML constant for the connection and two user attributes. Note that you should also change the data server external_api_url to point to the URL of your deployed access check server.

  #### Marketplace json file

  The marketplace.json contains the data needed by Looker's Marketplace to install an extension in a Looker instance. Note the connection constant which causes the installation process to prompt for a connection. Also note the two user attributes, show_configuration_editor and access_key. The installation process will prompt for values for these which will be stored in user attributes for the Looker instance.

  - `show_configuration_editor` - When no, access to the coniguration dialog is disabled. In most cases, you should probably set this to "no" and only configure the access key through the marketplace.
  - `access_key` - The access key. Note that even though the access key does not have to be re-entered on the Marketplace when updating configuration or version, the secret key remains safely in the Looker server and is never loaded in the browser once it has been created.

## Related Projects

- [Looker Extension SDK React](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk-react)
- [Looker Extension SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk)
- [Looker SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/sdk)
- [Looker Embed SDK](https://github.com/looker-open-source/embed-sdk)
- [Looker Components](https://components.looker.com/)
- [Styled components](https://www.styled-components.com/docs)
