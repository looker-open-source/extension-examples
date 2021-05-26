# Demo External API

This example demonstrates usage of external API in an extension using javascript.

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

## Google Sheets API setup

The demo requires a project with access to the sheets API and an OAUTH2 client id to be setup in the Google console. To create the project and client id [click here](https://developers.google.com/sheets/api/quickstart/js) and follow the instructions in step 1. The OAUTH client id value needs to be added to a `.env` file in the root directory of this project. This value can be found in the [google developer console](https://console.developers.google.com/). The format of the `.env` file is as follows:

```
GOOGLE_CLIENT_ID=Application OAUTH2 client ID
```

**Important: DO NOT COMMIT FILES CONTAINING CLIENT IDS OR API KEYS TO SOURCE CONTROL.**

## Deployment

The process above describes how to run the extension for development. Once you're done developing and ready to deploy, the production version of the extension may be deployed as follows:

1. In the extension project directory build the extension by running `yarn build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify the `manifest.lkml` to use `file` instead of `url`:
