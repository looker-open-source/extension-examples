# Looker Extension Framework Examples

This repository indexes several examples of Extensions built using the [Looker Extension Framework](https://docs.looker.com/data-modeling/extension-framework/extension-framework-intro). Folder structure is organized first by framework, then language.

Previously `yarn` and `lerna` were used to install, build and run the examples. `npm` and `npm workspaces` has made great strides over the years, to the point that it is the preferred package manner. To this end all of the examples have been updated to use `npm`. `yarn` should still work but it has not been tested.

## What's the Extension Framework?

The Looker extension framework is a development framework that significantly reduces the effort and complexity of building custom JavaScript data applications and tools, such as:

- Internal platform applications for your company
- External platforms for your customers, such as customer portals for Powered By Looker (PBL) applications built with data in Looker
- Targeted internal tools
- Applications to embed in external applications

![extension image](https://docs.looker.com/assets/images/dev-ef-full-screen-712.png)

Custom applications and tools created with the extension framework can be accessed from within Looker, allowing Looker to handle functions such as authentication, access control and permission management, and API access. This also lets you leverage other common developer resources, such as third-party API endpoints, within Looker.

## Examples

We currently have examples for:

- [React](https://github.com/looker-open-source/extension-examples/tree/master/react)
  - [Typescript](https://github.com/looker-open-source/extension-examples/tree/main/react/typescript)
  - [Javascript](https://github.com/looker-open-source/extension-examples/tree/main/javascript)
  - [Typescript & Redux](https://github.com/looker-open-source/extension-examples/tree/main/react/typescript/looks-query-redux)
- [Vanilla (no react)](https://github.com/looker-open-source/extension-examples/tree/main/vanilla)
  - [Javascript](https://github.com/looker-open-source/extension-examples/tree/main/vanilla/counter)
  - [Typescript](https://github.com/looker-open-source/extension-examples/tree/main/vanilla/counter-ts)

There are different types of examples present. Each language/framework has a very simple "Hello World" style example that is meant to be used as a template or starting point to make your initial configuration easier.

For React the "[Demo Extension SDK](https://github.com/looker-open-source/extension-examples/tree/master/react/javascript/demo-extension-sdk)" example demonstrates basic extension functionality.

For React & Typescript, there are some more complex examples present including a "[Kitchen Sink](https://github.com/looker-open-source/extension-examples/tree/master/react/typescript/kitchensink)" example intended to be a reference implementation for nearly all possible Extension functionality. It should not be used as a starting point or template, rather as an encyclopedia.

For those seeking to build monetized or otherwise gated extensions, the [access-key-demo](https://github.com/looker-open-source/extension-examples/tree/master/react/typescript/access-key-demo) extension will be of interest!

## Running the examples

### Individual examples

Each example directory has a README.md that details how to run that specific example. You should follow the specific examples for each, but the general workflow is:

0. `git clone git@github.com:looker-open-source/extension-examples.git` to clone this entire repository.
1. `cd` to the relevant directory.
2. `npm install` to get all necessary packages.
3. `npm run develop` to begin serving the bundle
4. Configure a Looker project with a `manifest.lkml` that listens to that bundle.
5. Open the extension from the Browse menu in your Looker instance.

Again, make sure to read the specific instructions in each directory's README.md.

### Creating an "uber" extension block

This repo contains a script, `npm run uberext`, that will build an extension block that will be populated with compiled versions of all of the examples. Some examples may still require that sample services be ran separately but all extensions will launch. The script provides defaults for all its options but these can be overridden. Run `npm run uberext --help` for more information.

To build the uber extension block follow the following instructions:

1. Create a directory adjacent to the directory this repo resides in called `uberext` (you can use a different directory name but you need to use the `-t` option when running the script).
2. Run `git init` in the directory.
3. Create a remote repo and associate the repo created in step 2 with it.
4. Run `npm install` in this repo's root directory. This will initialize all of the example projects.
5. Run `npm run build` in this repo's root directory. This will build all of the example projects.
6. Run `npm run uberext` in this repo's root directory. This will create the extension block in the directory created in step 1.
7. Navigate to the `uberext` directory.
8. Run `git add .` to stage the files.
9. Run `git commit -m "init"`to commit the files.
10. Run `git push` to add the files to the remote repo.
11. In Looker, create a new project and initialize with the remote repo created in step 3.
12. Deploy the project.

At this point the extensions will appear in the Looker instance browse menu (you may have to reload the page).

## Support

Support is able to help confirm the Extension Framework itself and the Looker SDK endpoints are working as intended; however, the Support team is not equipped to review or comment on the custom code written in your application.
For any questions beyond the scope of Support, please engage with our [**Looker Community**](https://community.looker.com/).

## Please contribute

All are welcome to submit examples. Please refer to the [CONTRIBUTING.md](https://github.com/looker-open-source/extension-examples/tree/main/CONTRIBUTING.md).
