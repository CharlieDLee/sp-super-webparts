## Super Derrick

### Summary

This solution allows you to run our Microsoft Cognitive Services powered digital assistant, Derrick, on SharePoint page. He appears as a discrete image on the bottom right of the page with a summary introduction message as follows:

![Derrick web part 01](./assets/preview01.JPG)

When clicked on, he can be asked questions. He is pre-loaded with 1000's of Office 365 knowledge base items. Additionally, you can add your own Microsoft Azure Cognitive services knowledge base items to his knowledge using the web part properties.

![Derrick web part 02](./assets/preview02.JPG)

### Features

Some features of this web part:

* Use our existing knowledge base of Microsoft Office related knowledge (contains approx. 1000 FAQs).
* Add your own knowledge bases in the web part properties.
* Customize Derrick's colours to match your corporate branding.
* Dictate your questions to Derrick rather than typing.
* Allow Derrick to speak rather than just text responses.
* Boost particular categories of knowledge base items depending on context of the web part location.
* Adjust his level of accuracy confidence (if he's not sure, he will give a choice of 3 nearest matches).
* Show a customizable welcome pop-up message.

### Prerequisites

You will need the following:

* Node.js (v4 or above)
* NPM (v3 or above)
* Visual Studio Code (recommended)

### Using SharePoint Framework Version 

![drop](https://img.shields.io/badge/drop-1.6.0-green.svg)

### Building Derrick

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

### Building Derrick for production

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
