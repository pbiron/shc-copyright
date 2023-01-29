# Copyright Block #

**Contributors:** [pbiron](https://profiles.wordpress.org/pbiron)  
**Tags:** copyright  
**Requires at least:** 6.1  
**Tested up to:** 6.1.1  
**Stable tag:** 0.9.0  
**License:** GPL-2.0-or-later  
**License URI:** https://www.gnu.org/licenses/gpl-2.0.html  

Block that outputs copyright statement, with years

## Description ##

This plugin defines a simple block type that can be used to output a copyright statement, with years.

## Installation ##

From your WordPress dashboard

1. Go to _Plugins > Add New_ and click on _Upload Plugin_
2. Upload the zip file
3. Activate the plugin

### Build from sources ###

1. clone the global repo to your local machine
2. install node.js and npm ([instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
3. install composer ([instructions](https://getcomposer.org/download/))
4. run `npm install`
5. run `composer install`
6. run `grunt build`

Useful tasks that are defined in Gruntfile.js

1. `grunt precomit`
    * runs phpcs (with modified WPCS) and jshint
    * always run this...and correct any errors...before committing anything
2. `grunt package`
    * builds a new release package
    * this will minify CSS/JS, update the plugin version number/description/name/etc from the info in package.js and then produce a zip package
3. `grunt autoload`
    * rebuilds the Composer autoloader.  Useful if/when you add a new PHP class to the plugin

## Changelog ##

### 0.9.0 (2023-01-29) ###

* init commit
