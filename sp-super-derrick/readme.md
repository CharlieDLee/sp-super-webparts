## Derrick SharePoint Framework

This solution allows you to run Derrick on SharePoint page. You can simply change his settings directly from web part properties.

### Prerequisites

You will need the following:

* Node.js (v4 or above)
* NPM (v3 or above)
* Visual Studio Code (recommended)

### Using the samples

To build and start using this project, you'll need to clone and build it. 

Clone this repo by executing the following command in your console:

```bash
git clone https://github.com/CieloCosta/sp-super-derrick.git
```

Navigate to the cloned repo folder which should be the same as the repo name:

```
cd sp-super-derrick
```


Now run the following command to install the npm packages:

```
npm install
```

This will install the required npm packages and dependencies to build and run the client-side project.


Once the npm packages are installed, run the following command to preview your web parts in SharePoint Workbench:

```
gulp serve
```

### Building for production

To build for production, use

```
gulp clean
gulp build --ship
gulp bundle --ship
gulp package-solution --ship
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.
