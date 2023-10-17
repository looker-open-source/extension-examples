# Looker Extension File Upload Demo (React & JavaScript)

This repository demonstrates a file upload Looker extension.

## Getting Started for Development

1. Clone the Looker extension examples repo.

   ```
   # cd ~/ Optional, your user directory is usually a good place to git clone to.
   git clone git@github.com:looker-open-source/extension-examples.git
   ```

2. Navigate (`cd`) to the example directory

   ```
   cd extension-examples/react/javascript/file-upload
   ```

3. Install the dependencies with `npm`.

   ```
   npm install
   ```

4. Start the development server

   ```
   npm run develop
   ```

   The extension is now running and serving the JavaScript locally at https://localhost:8080/bundle.js.

5. Start the data server. This server recieves the files uploaded by the extension. Note that it is
   for demo purposes only.

   ```
   npm run server
   ```

6. Log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   Select "Blank Project" as your "Starting Point". This will create a new project with no files.

   1. The extension folder has a `manifest.lkml` file.

   Either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

   ```
   project_name: "fileupload"

   application: fileupload {
      label: "File upload demo"
      url: "https://localhost:8080/bundle.js"
      entitlements: {
         external_api_urls: ["http://localhost:3000"]
      }
   }
   ```

7. Create a `model` LookML file in your project. The name doesn't matter but the convention is to name it the same as the project, in this case, fileupload.

- Add a connection in this model.
- [Configure the model you created](https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model) so that it has access to the selected connection.
  We do this because Looker permissions data access via models— In order to grant / limit access to an extension, it must be associated with a model.

8. Connect the project to Git. This can be done in multiple ways:

- Create a new repository on GitHub or a similar service, and follow the instructions to [connect your project to Git](https://docs.looker.com/data-modeling/getting-started/setting-up-git-connection)
- A simpler but less powerful approach is to set up git with the "Bare" repository option which does not require connecting to an external Git Service.

9. Commit the changes and deploy them to production through the Project UI.

10. Reload the page and click the `Browse` dropdown menu. You will see the extension in the list.

- The extension will load the JavaScript from the `url` provided in the `application` definition. By default, this is https://localhost:8080/bundle.js. If you change the port your server runs on in the package.json, you will need to also update it in the manifest.lkml.
- Refreshing the extension page will bring in any new code changes from the extension template, although some changes will hot reload.

## Deployment

The process above describes how to run the extension for development. Once you're done developing and ready to deploy, the production version of the extension may be deployed as follows:

1. In the extension project directory build the extension by running `npm run build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify the `manifest.lkml` to use `file` instead of `url`:

   ```
   project_name: "fileupload"

   application: fileupload {
      label: "File upload demo"
      file: "bundle.js"
      entitlements: {
         external_api_urls: ["http://localhost:3000"]
      }
   }
   ```
