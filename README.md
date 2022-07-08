# WP Rest API Filter plugin
-------------------------
A customizable filter/search plugin supports custom **Team** / **Post** filter and search

## Installation
-------------------------
1. Click on the `Download ZIP` button at the right to download the plugin.
2. Go to Plugins > Add New in your WordPress admin. Click on `Upload Plugin` and browse for the zip file.
3. Activate the plugin.

## Structure
-------------------------

```bash
├── app
│   ├── Shortcodes
│   │   ├── **_Shortcode.php
│   │   ├── Shortcode_Loader.php
│   ├── EnqueueScripts.php
│   ├── Helpers.php
│   ├── Plugin.php
├── assets (or build)
│   ├── js
│   │   ├──  **.js
│   ├── css
│   │   ├──  **.css
├── node_modules
├── src
│   ├── components
│   │   ├──  **.js
│   │   ├──  **.css
│   ├── main.js
│   ├── main.scss
├── vendor
├── README.md
├── package.json
├── config.js
├── plugin.json
├── prettier.config.js
├── vite.config.js
└── wprestapifilter.php
```
### app
- `Plugin.php` The main plugin class.
- `EnqueueScripts.php` This file is used to enqueue **CSS** and **JavaScripts** into WordPress.
- `Shortcodes` - This directory contains all the shortcodes.
### src
- `components` - The pre-configured components
- `main.js` - The main JavaScripts file that will be processed into `assets/js/**.js`
- `main.scss` - The main SCSS file that will be processed into `assets/css/**.css`


## Browser compatibility
-------------------------
* Chrome
* Firefox
* Safari