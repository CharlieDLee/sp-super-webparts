## Super Search SharePoint Framework

This solution provides three web parts that you can use for search in your page. It contains Search Box, Search Filters and Search Results.

### Prerequisites

You will need the following:

* Node.js (v4 or above)
* NPM (v3 or above)
* Visual Studio Code (recommended)

### Using SharePoint Framework Version 

![drop](https://img.shields.io/badge/drop-1.6.0-green.svg)

### Buiding the Super Search web parts

To build and start using this project, you'll need to clone and build it. 

Clone this repo by executing the following command in your console:

```bash
git clone https://github.com/CieloCosta/sp-super-search.git
```

Navigate to the cloned repo folder which should be the same as the repo name:

```
cd sp-super-search
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

### Additional resources 

* [Overview of the SharePoint Framework](http://dev.office.com/sharepoint/docs/spfx/sharepoint-framework-overview)
* [SharePoint Framework development tools and libraries](http://dev.office.com/sharepoint/docs/spfx/tools-and-libraries)
* [SharePoint Framework Reference](https://sharepoint.github.io/)
* [Cielo Costa Blog](https://cielocosta.com/our-blog)

Blog posts of using building these samples will soon be created at the link above - keep posted.

Please feel free to get in touch on Twitter [@CieloCostaUK](https://twitter.com/CieloCostaUK).

> Sharing is caring!

###  Disclaimer

THIS CODE IS PROVIDED AS IS WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.
