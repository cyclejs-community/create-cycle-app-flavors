# Create Cycle App Flavors

## Usage

Flavors allow generating starting projects to fulfil specific needs.
They can be published to npm, or being used locally via the [create-cycle-app CLI](https://github.com/cyclejs-community/create-cycle-app).

When creating a project, you can inform which flavor you want to use with the `--flavor` flag:

```sh
$ create-cycle-app <name> --flavor <flavor>
```

## Flavor usage

The `--flavor` option value can either be: 
- a local path such as `./my-flavors/es6-webpack-magic` or 
- the name of a published `npm` package such as `cycle-scripts-one-fits-all`

A package name may further specify version identifier `@` such as: 
`cycle-scripts-one-fits-all@1.0.0`

Example `--flavor` use

```bash
$ create-cycle-app my-app --flavor cycle-scripts-one-fits-all

$ create-cycle-app my-app2 --flavor cycle-scripts-one-fits-all@x.y.z

$ create-cycle-app my-magic-app --flavor ./my-flavors/es6-webpack-magic
```

## Flavor development and registration

When you are developing a new flavor, try it out by using the local path `flavor` option variant.

When you are done with your flavor simply `npm publish` it on npm to make it globally accessible.

## Available Flavors

The following flavors are currently available for reference. We recommend using `one-fits-all` which you can use as a base line for developing your own.

| Flavor | Language | Bundler | CLI compatibility | Status |
|---------|:--------------------------:|:--------------:|:-------------:|:-------------:|
| [cycle-scripts-one-fits-all](https://github.com/cyclejs-community/create-cycle-app-flavors/tree/master/packages/cycle-scripts-one-fits-all) | TypeScript or ES6 | Webpack2 | v3 | ✅ Active |
| [cycle-scripts-ts-webpack](https://github.com/cyclejs-community/create-cycle-app-flavors/tree/master/packages/cycle-scripts-ts-webpack) | TypeScript | Webpack1 | v2 | :no_good_man: Deprecated |
| [cycle-scripts-ts-browserify](https://github.com/cyclejs-community/create-cycle-app-flavors/tree/master/packages/cycle-scripts-ts-browserify) | TypeScript | Browserify | v2 | :no_good_man: Deprecated |
| [cycle-scripts-es-browserify](https://github.com/cyclejs-community/create-cycle-app-flavors/tree/master/packages/cycle-scripts-es-browserify) | ES6 | Browserify | v2 | :no_good_man: Deprecated |



## How to create a custom flavor
A flavor is a npm module with a set of scripts and template files that are used to configure a new Cycle.js project.

Take a look at [cycle-scripts](https://github.com/cyclejs-community/create-cycle-app/tree/master/packages/cycle-scripts) as an example.

### Basic structure

```
.
├── index.js
├── package.json
├── scripts
│   ├── build.js
│   ├── init.js
│   ├── start.js
│   ├── eject.js
│   └── test.js
└── template
    ├── gitignore
    ├── public
    │   ├── favicon.ico
    │   └── index.html
    └── src
        ├── app.js
        ├── app.test.js
        └── index.js

4 directories, 13 files
```

`package.json` is used to declare dependencies for this particular flavor, that acts as devDependencies to the target project. It declares the `cycle-scripts` command script (generally `index.js`), from where each underlying scripts is called.

`index.js` is the entry point for each command exposed to the target project. It could be really simple, just calling the next script file without ceremony.

`scripts/` directory holds each script used in the project. The `start.js` script is used to start a development server. `test.js`, as the name suggests, call the test tool. `build.js` is used to bundle the target project to a deliverable set of files, production-ready. `eject.js` is mostly a copy-and-paste tool, that adapts the target project to reproduce the same commands from the flavor. Last, but not least, `init.js` is the script called by `create-cycle-app` command, in order to install development dependencies and copy initial files.

`templates/` directory holds template files for the target project. This is optional, and unlike other files, could have any structure you desire.

Each flavor has great freedom to choose it's own dependencies, configuration, tools and file structure, as the user will choose which is the best (desired) flavor.
