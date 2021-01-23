# Looker Extension Counter Example

This repository demonstrates a very basic extension (no react).

## Getting Started for Development

1. Navigate (`cd`) to the directory on your system
2. Install the dependencies with [Yarn](https://yarnpkg.com/).

   ```
   yarn
   ```

3. Start the development server

   ```
   yarn develop
   ```

   The develop server is now running and serving the JavaScript at http://localhost:8080/bundle.js.

4. Log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   Select a "Blank Project" as the starting point.

5. Create a `manifest` file

   Either drag and upload the `manifest.lkml` file in this directory into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

   ```
    project_name: "extension-counter"
    application: extension-counter {
        label: "Extension Counter"
        url: "http://localhost:8080/bundle.js"
        # file: "bundle.js"
        entitlements: {
          core_api_methods: ["me"]
        }
    }
   ```

6. Create a `model` LookML file in your project.

   The convention is to name the model the same as the extension project. The model is used to control access to the extension.

   - Add a connection in this model (it can be any connection).
   - [Configure the model you created](https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model) so that it has access to some connection.

7. Connect the new project to Git.

   This can be done in multiple ways:

   - Create a new repository on GitHub or a similar service, and follow the instructions to [connect your project to Git](https://docs.looker.com/data-modeling/getting-started/setting-up-git-connection)
   - A simpler but less powerful approach is to set up git with the "Bare" repository option which does not require connecting to an external Git Service.

8. Commit the changes and deploy your them to production through the Project UI.

9. Reload the page and click the `Browse` dropdown menu. You should see the extension label in the list.

   - The extension will load the JavaScript from the `url` you provided in the `application` definition.
   - Reloading the extension page will bring in any new code changes from the extension template.

## Deployment

The process above requires that the development server to be running to load the extension code. To allow other people to use the extension, build the JavaScript file and include it in the project directly.

1. In your extension project directory on your development machine you can build the extension with `yarn build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify your `manifest.lkml` to use `file` instead of `url`:

   ```
    project_name: "extension-counter"
    application: extension-counter {
        label: "Extension Counter"
        # url: "http://localhost:8080/bundle.js"
        file: "bundle.js"
        entitlements: {
          core_api_methods: ["me"]
        }
    }
   ```
