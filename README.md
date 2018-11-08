# Neighborhood Map

## Table of Contents
* [Overview](#overview)
* [View Page](#view-page)
* [Dependencies](#dependencies)
* [Resources](#resources)
* [Browsers Support](#browsers-support)
* [Contributions](#contributions)
* [License](#license)

## Overview
This app has been developed for the [Udacity Frontend Nanodegree Project 7](rubric.pdf).

I chose [google-maps-react](npmjs.com/package/google-maps-react) for development. Over the course of developing this project, I sampled several different packages that had strong documentation. Initially, I used another popular package [react-google-maps](npmjs.com/package/react-google-maps). That project was abandoned after markers were implemented. Upon inspection of the [react-devtools](npmjs.com/packages/react-devtools), I discovered cryptic messages: `__secret_marker_do_not_use_or_you_will_be_fired` and `__secret_map_do_not_use_or_you_will_be_fired` instead of expected DOM elements. I believe this to be use the heavy usage of [legacy lifecycles](https://reactjs.org/blog/2018/03/29/react-v-16-3.html) used within the package.

For one version, I did not use a package. Ultimately, I decided the additional documentation, lifecycle handling, error handling, fallback UI's that packages had to offer created a stronger version than I could produce without significantly relying on external code. While [google-maps-react](npmjs.com/packages/google-maps-react) does use `componentWillReceiveProps` within `dist/GoogleApiComponent.js` and `src/GoogleApiComponent.js`, it does not encrypt the same warning in the DOM.

I relied on the Doug Brown walkthrough for most of the lifecycle handling and handling state between the two components. Then I integrated the parts I had already figured out to bring back the project to being my own. The good news is I learned a lot and did some extra research along the way. 

## View Page
### Online
Not available at this time, will deploy from [react-gh-pages](https://github.com/gitname/react-gh-pages) in the future.

### localhost
  1) ```clone https://github.com/CrystalYungwirth/fend-p7-neighborhood-map.git```
  2) ```cd fend-p7-neighborhood-map```
  3) ```npm i```
  4) ```npm start```

  App must be shown on localhost:3000 I have the Google API Key restricted.
  
### Offline
  The serviceWorker is only available in production mode.
  1) ```clone https://github.com/CrystalYungwirth/fend-p7-neighborhood-map.git```
  2) ```cd fend-p7-neighborhood-map```
  3) ```npm i```
  4) ```npm run build```
  5) Open in ```localhost:3000```


## [Dependencies](./package.json)
 * This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Resources
 * [Get Lat Long from Address](https://www.latlong.net/convert-address-to-lat-long.html)
 * [Doug Brown Walkthrough](https://youtu.be/NVAVLCJwAAo)

## Contributions
I'm not likely to accept contributions since it's a class project.

## License
[MIT License](LICENSE)
