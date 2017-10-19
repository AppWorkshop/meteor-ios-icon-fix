module.exports = function (context) {
  var fs = context.requireCordovaModule('fs');
  var path = context.requireCordovaModule('path');
  var _ = context.requireCordovaModule('lodash');

  var cordova_util = context.requireCordovaModule('cordova-lib/src/cordova/util.js');
  var ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser;
  var projectRoot = context.opts.projectRoot;

  // cordova project config
  var configXml = cordova_util.projectConfig(projectRoot);
  var config = new ConfigParser(configXml);
  var projectName = config.name();
  // iOS project config
  var iOSPath = path.join(context.opts.projectRoot, 'platforms', 'ios');
  var iconAssetsPath = path.join(iOSPath, projectName, "Images.xcassets", "AppIcon.appiconset");
  var contentsJSONPath = path.join(iconAssetsPath, "Contents.json");
  var contentsJSON = fs.readFileSync(contentsJSONPath, { 'encoding': 'utf8' });
  var contents = JSON.parse(contentsJSON);

  // cordova preferences.
  var iconsToRemovePreference = config.getPreference("ICONS_TO_REMOVE") || "icon-50.png,icon-50@2x.png,icon-72.png,icon-72@2x.png,icon.png,icon@2x.png,icon-1024.png,icon-small@3x.png";
  var marketingIconFilename = config.getPreference("MARKETING_ICON_FILENAME") || "marketing_icon_1024x1024.png";
  var idiomsToRemovePreference = config.getPreference("IDIOMS_TO_REMOVE") || "ios-marketing"
  var marketingIconPath = path.join(projectRoot, marketingIconFilename);
  var iconsToRemoveArray = iconsToRemovePreference.split(",");
  var idiomsToRemoveArray = idiomsToRemovePreference.split(",");

  /*
  contents looks like:
  { 
    images: [
      {
        "idiom" : "iphone",
        "size" : "29x29",
        "filename" : "icon-small.png",
        "scale" : "1x"
      }, ...
    ]
  }
  */

  var newImages = [];

  _.forEach(contents.images, function (thisIcon, index) {

    if ((_.indexOf(iconsToRemoveArray, thisIcon.filename) > -1) ||
      (_.indexOf(idiomsToRemoveArray, thisIcon.idiom) > -1)) {

      if (thisIcon.filename) {
        // remove the file and don't add this object.
        var imagePath = path.join(iconAssetsPath, thisIcon.filename);
        fs.unlink(imagePath, function (err) {
          if (!err) {
            console.log("removed " + imagePath);
          }
        });
      }
    } else {
      // add this object to the new images array.
      newImages.push(thisIcon);
    }
  }, this);

  // do we have a marketing icon ?
  fs.stat(marketingIconPath, function (err, stats) {
    if (!err) {
      var marketingIcon = {
        "size": "1024x1024",
        "idiom": "ios-marketing",
        "filename": marketingIconFilename,
        "scale": "1x"
      };
      newImages.push(marketingIcon);
      var r = fs.createReadStream(marketingIconPath)
      var w = fs.createWriteStream(path.join(iconAssetsPath, marketingIconFilename));
      r.pipe(w);
      w.on('finish', () => {
        console.log('marketing icon copied.');
        contents.images = newImages;

        var newContentsJSON = JSON.stringify(contents, null, 2);

        fs.writeFileSync(contentsJSONPath, newContentsJSON, 'utf8');
      });
    } else {
      console.error("No marketing icon; you need to create a file cordova-build-override/marketing_icon_1024x1024.png");
      process.exit(1);
    }
  });


}