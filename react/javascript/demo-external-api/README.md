# Demo External API

This example demonstrates usage of external API in an extension using javascript. Its uses OAUTH2 to get an access token from Google. It then use that token to create and update a spreadsheet using the Google sheet APIs. The key thing to observe are:

- the OauthProvider which handles interfactions with Googles OAUTH2 identity service. The auth token is stored in the pushRouter state so that it survives a page reload.
- The SheetsProvider which provides a simple abstraction to calling the Google sheets restful endpoints.

## Prerequisites

This demo requires a project with access to the sheets API and an OAUTH2 client to be setup in the Google console.

1. [Open the Google console](https://console.cloud.google.com/).
2. Select `IAM and Admin/Create a project`.
3. Enter the name of the project and click `create` which navigates you to the project dashboard.
4. On the project dashboard click `select project` for your newly created project. This displays information about your project and tasks you can do.
5. In the `Getting started` section click `Explore and enable APIs`.
6. Click `Libraries` and search for `Sheets`. This brings up a link to the `Google Sheets API`. `Select` it.
7. Click `Enable` which brings you to the Google Sheets API setup.
8. Click the `Configure Consent Screen` button.
9. Select the `User Type` and click Create. You maybe restricted as to the type you can select.
10. Enter `application information` and click `Save and Continue`. The minimum you need to enter is the `App name`, `User support email` and at least one `developer contact email`.
11. Click `Save and Continue` until you see the `Back to Dashboard` button. Click the `Back to Dashboard` button.
12. Click the `Credentials` link in the sidebar.
13. Click the `Create Credentials` button and select `OAUTH client ID`.
14. Select `Application Type` of `Web Application`.
15. `Name` your application.
16. Add the base url of the Looker instance that will host your extension as an `Authorized JavaScript Origin`. Example `https://myinstance.looker.com`.
17. Add the base url of the Looker instance that will host your extension appended with `/extensions/oauth2_redirect` as an `Authorized redirect URI`. Example `https://myinstance.looker.com//extensions/oauth2_redirect`.
18. Click `Create`. This will display the `Client Id` and `Client Secret`. Copy the client id.
19. Create a `.env` file in the root of your project. Create an entry like this: `GOOGLE_CLIENT_ID=Application OAUTH2 client ID` from the previous step. **Important: Do not add the `.env` file to source control.**

At this point you should be able use OAUTH2 to login Google and use the Google Sheets API in the Extension.

Further information on creating a Google console project can be found [here](https://developers.google.com/workspace/guides/create-project).

Information on using the sheets API can be found [here](https://developers.google.com/sheets/api/quickstart/js).

## Getting Started for Development

1. Clone the Looker extension examples repo.

   ```
   # cd ~/ Optional, your user directory is usually a good place to git clone to.
   git clone git@github.com:looker-open-source/extension-examples.git
   ```

2. Navigate (`cd`) to the example directory on your system

   ```
   cd extension-examples/react/javascript/demo-external-api
   ```

3. Install the dependencies with [Yarn](https://yarnpkg.com/).

   ```
   yarn install
   ```

4. Start the development server

   This particular extension example requires that a `.env` file is created before starting the development server for the first time. See the **Prerequisites section ** above for instructions on setting this file up.

   ```
   yarn develop
   ```

   The extension is now running and serving the JavaScript locally at http://localhost:8080/bundle.js.

5. Log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   Select "Blank Project" as your "Starting Point". This will create a new project with no files.

   1. The extension folder has a `manifest.lkml` file.

   Either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

6. Create a `model` LookML file in your project. The name doesn't matter but the convention is to name it the same as the project, in this case, demo-external-api.

- Add a connection in this model.
- [Configure the model you created](https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model) so that it has access to the selected connection.
  We do this because Looker permissions data access via models. In order to grant / limit access to an extension, it must be associated with a model.

7. Connect the project to Git. This can be done in multiple ways:

- Create a new repository on GitHub or a similar service, and follow the instructions to [connect your project to Git](https://docs.looker.com/data-modeling/getting-started/setting-up-git-connection)
- A simpler but less powerful approach is to set up git with the "Bare" repository option which does not require connecting to an external Git Service.

8. Commit the changes and deploy them to production through the Project UI.

9. Reload the page and click the `Browse` dropdown menu. You will see the extension in the list.

- The extension will load the JavaScript from the `url` provided in the `application` definition. By default, this is http://localhost:8080/bundle.js. If you change the port your server runs on in the package.json, you will need to also update it in the manifest.lkml.
- Refreshing the extension page will bring in any new code changes from the extension template, although some changes will hot reload.

## Logging in using Google OAUTH

If you selected `External user type` on the `Oauth consent screen` you MAY have to perform additional actions.

You MAY have to add your email as a test user on the `Oauth consent screen`. When you login you MAY get a message `Google hasn't verified this app`. Click `continue`, `allow` and `allow` again.

You MAY also publish your app on the `Oauth consent screen`. In this case any user may access the application but will most likely get the `Google hasn't verified this app` message.

## Deployment

The process above describes how to run the extension for development. Once you're done developing and ready to deploy, the production version of the extension may be deployed as follows:

1. In the extension project directory build the extension by running `yarn build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify the `manifest.lkml` to use `file` instead of `url`.

You will need to perform additional steps to the Google OAUTH and API access ready for production. Please consult Google documentation for information on how to do this.
