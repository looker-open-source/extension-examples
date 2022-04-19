# Integrating Looker's Visualization Components and Filter Components

This repository demonstrates how to create a dashboard-like interface using Looker's Visualization Components and Filter Components within a simple React application.

It uses [React](https://reactjs.org/) and [Typescript](https://typescriptlang.org) for writing your extension, the [React Extension SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk-react) for interacting with Looker, [Looker Components](https://components.looker.com) for UI, [Looker Visualization Components](https://docs.looker.com/data-modeling/extension-framework/vis-components) to render visualizations, [Looker Data Components](https://github.com/looker-open-source/components/tree/main/packages/components-data) to handle data fetching and integration with our sdk, [Looker Filter Components](https://docs.looker.com/data-modeling/extension-framework/filter-components) to modify filters applied to the query and [Webpack](https://webpack.js.org/) for building your code.

## Getting Started for Development

1. Clone or download a copy of this template to your development machine, if you haven't already cloned the entire repo.

   ```
   # cd ~/ Optional, your user directory is usually a good place to git clone to.
   git clone git@github.com:looker-open-source/extension-examples.git
   ```

2. Navigate (`cd`) to the template directory on your system

   ```
   cd extension-examples/react/typescript/vis-and-filter-components
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

   The extension is now running and serving the JavaScript locally at http://localhost:8080/bundle.js.

5) Log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   Select "Blank Project" as your "Starting Point". This will create a new project with no files.

   1. The extension folder has a `manifest.lkml` file.

   Either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

   ```
   project_name: "vis-filter-integration"
   application: vis-filter-integration {
    label: "Visualization and Filter Components (TypeScript)"
    url: "http://localhost:8080/bundle.js"
      entitlements: {
         core_api_methods: ["all_connections", "all_looks", "create_query", "dashboard", "lookml_model_explore", "query_for_slug", "query", "run_inline_query", "run_look", "run_query", "search_folders", "model_fieldname_suggestions"]
      }
   }
   ```

6. Create a `model` LookML file in your project. The name doesn't matter but the convention is to name it the same as the project— in this case, helloworld-js.

- Add a connection in this model.
- [Configure the model you created](https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model) so that it has access to the selected connection.
  We do this because Looker permissions data access via models— In order to grant / limit access to an extension, it must be associated with a model.

7. Connect the project to Git. This can be done in multiple ways:

- Create a new repository on GitHub or a similar service, and follow the instructions to [connect your project to Git](https://docs.looker.com/data-modeling/getting-started/setting-up-git-connection)
- A simpler but less powerful approach is to set up git with the "Bare" repository option which does not require connecting to an external Git Service.

8. Commit the changes and deploy them to production through the Project UI.

9. Reload the page and click the `Browse` dropdown menu. You will see the extension in the list.

- The extension will load the JavaScript from the `url` provided in the `application` definition. By default, this is http://localhost:8080/bundle.js. If you change the port your server runs on in the package.json, you will need to also update it in the manifest.lkml.
- Refreshing the extension page will bring in any new code changes from the extension template, although some changes will hot reload.

## Extension Entitlements

Entitlements are defined in the project manifest file for the extension.

Resources required by the extension (Looker API methods for example) must be defined in entitlements. This extension uses the `me` api method, as such it is defined in the entitlements.

- all_connections
- all_looks
- create_query
- dashboard
- lookml_model_explore
- query_for_slug
- query
- run_inline_query
- run_look
- run_query
- search_folders
- model_fieldname_suggestions

## Deployment

The process above describes how to run the extension for development. Once you're done developing and ready to deploy, the production version of the extension may be deployed as follows:

1. In the extension project directory build the extension by running `yarn build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify the `manifest.lkml` to use `file` instead of `url`:

   ```
   project_name: "vis-filter-integration"
   application: vis-filter-integration {
    label: "Visualization and Filter Components (TypeScript)"
    file: "bundle.js"
      entitlements: {
         core_api_methods: ["all_connections", "all_looks", "create_query", "dashboard", "lookml_model_explore", "query_for_slug", "query", "run_inline_query", "run_look", "run_query", "search_folders", "model_fieldname_suggestions"]
      }
   }
   ```

## Notes

- Webpack's module splitting is not currently supported.
- This template uses Looker's [component library](https://components.looker.com) and [styled components](https://styled-components.com/). Neither of these libraries are required, and you may remove and replace them with a component library of your own choice or simply build your UI from scratch.

## Related Projects

- [Looker Extension SDK React](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk-react)
- [Looker Extension SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/extension-sdk)
- [Looker SDK](https://github.com/looker-open-source/sdk-codegen/tree/main/packages/sdk)
- [Looker Embed SDK](https://github.com/looker-open-source/embed-sdk)
- [Looker Components](https://components.looker.com/)
- [Looker Visualization Components](https://docs.looker.com/data-modeling/extension-framework/vis-components)
- [Looker Data Components](https://github.com/looker-open-source/components/tree/main/packages/components-data) - [Looker Filter Components](https://docs.looker.com/data-modeling/extension-framework/filter-components)
