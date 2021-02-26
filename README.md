# Looker Extension Framework Examples
This repository indexes several examples of Extensions built using the [Looker Extension Framework](https://docs.looker.com/data-modeling/extension-framework/extension-framework-intro). Folder structure is organized first by framework, then language.

## What's the Extension Framework?
The Looker extension framework is a development framework that significantly reduces the effort and complexity of building custom JavaScript data applications and tools, such as:

 * Internal platform applications for your company
 * External platforms for your customers, such as customer portals for Powered By Looker (PBL) applications built with data in Looker
 * Targeted internal tools
 * Applications to embed in external applications

![extension image](https://docs.looker.com/assets/images/dev-ef-full-screen-712.png )

Custom applications and tools created with the extension framework can be accessed from within Looker, allowing Looker to handle functions such as authentication, access control and permission management, and API access. This also lets you leverage other common developer resources, such as third-party API endpoints, within Looker.

## Examples
We currently have examples for:
* [React](https://github.com/looker-open-source/extension-examples/tree/master/react)
    * [Typescript](https://github.com/looker-open-source/extension-examples/tree/master/react/typescript)
    * [Javascript](https://github.com/looker-open-source/extension-examples/tree/master/javascript)
    * [Typescript & Redux](https://github.com/looker-open-source/extension-examples/tree/master/react/typescript/looks-query-redux)
* [Vanilla (no react)](https://github.com/looker-open-source/extension-examples/tree/master/vanilla)
    * [Javascript](https://github.com/looker-open-source/extension-examples/tree/master/vanilla/counter-js)
    * [Typescript](https://github.com/looker-open-source/extension-examples/tree/master/vanilla/counter-ts)

There are different types of examples present. Each language/framework has a very simple "Hello World" style example that is meant to be used as a template or starting point to make your initial configuration easier.

For React & Typescript, there are some more complex examples present including a "[Kitchen Sink](https://github.com/looker-open-source/extension-examples/tree/master/react/typescript/kitchensink)" example intended to be a reference implementation for nearly all possible Extension functionality. It should not be used as a starting point or template, rather as an encyclopedia.

For those seeking to build monetized or otherwise gated extensions, the [access-key-demo]((https://github.com/looker-open-source/extension-examples/tree/master/react/typescript/access-key-demo)) extension will be of interest!

## Running the examples
Each example directory has a README.md that details how to run that specific example. You should follow the specific examples for each, but the general workflow is:
1. `cd` to the relevant directory.
2. `yarn install` to get all necessary packages.
3. `yarn start` to begin serving the bundle
4. Configure a Looker project with a `manifest.lkml` that listens to that bundle.
5. Open the extension from the Browse menu in your Looker instance.

Again, make sure to read the specific instructions in each directory's README.md.

## Please contribute

All are welcome to submit examples. Please feel free to submit a PR for any examples you want to share.

If you notice an example that is not working, a package that is out of date, or any other bug, please open an issue and let us know.  Thank you!