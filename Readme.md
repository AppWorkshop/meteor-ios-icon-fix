# Meteor iOS Icon Fix

A really simple little cordova plugin for meteor iOS apps that removes old cordova icons, which would otherwise result in [App Store review rejection](https://forums.meteor.com/t/unable-to-publish-ios-app-because-of-missing-icon/34835).

It also adds the 1024x1024 marketing icon, which meteor currently doesn't allow you to add via `mobile-config.js`.

### Installation

```
meteor add cordova:meteor-ios-icon-fix@1.0.0
```

### Illustration

<img width="1287" alt="meteor_1 4 4 4_noplugin" src="https://user-images.githubusercontent.com/1751645/31778270-d17d3efc-b522-11e7-9f10-aeded7b5c665.png">

Meteor 1.4.4.4 with this plugin:
<img width="1246" alt="meteor_1 4 4 4_withplugin" src="https://user-images.githubusercontent.com/1751645/31778282-d443f8ec-b522-11e7-821d-7a8d5e11cd53.png">

Meteor 1.5.2.2 without this plugin, with all iOS icons specified:
<img width="1315" alt="meteor_1 5 2 2_noplugin" src="https://user-images.githubusercontent.com/1751645/31778289-d695e2cc-b522-11e7-8d6c-e0a50c6753d6.png">

Meteor 1.5.2.2 with this plugin (with all iOS icons specified - some get removed):
<img width="1289" alt="meteor_1 5 2 2_withplugin" src="https://user-images.githubusercontent.com/1751645/31778293-d9301502-b522-11e7-8666-4418d200f4ba.png">

### Configuration

You can specify which icons to remove in your mobile-config.js file :

```js
App.setPreference("ICONS_TO_REMOVE","icon-50.png,icon-50@2x.png,icon-72.png,icon-72@2x.png,icon.png,icon@2x.png,icon-1024.png,icon-small@3x.png"); // this is the default.
App.setPreference("MARKETING_ICON_FILENAME","marketing_icon_1024x1024.png"); // this is the default.
```

You also need to add your iOS marketing icon in your meteor project in a `cordova-build-override` folder, with the filename of `marketing_icon_1024x1024.png` and size of 1024x1024 pixels.
