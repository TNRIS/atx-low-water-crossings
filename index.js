
var request = require('request');
var xml2js = require('xml2js');
var toGeojson = require('geojson');

var CLOSURES_XML_URL = 'http://www.atxfloods.com/dashboard/phpsqlajax_genxml.php';

module.exports = {
  getCrossingData: getCrossingData
};

if (require.main === module) {
  getCrossingData(true, function (err, markers) {
    if (err) {
      console.error(err.toString());
    }
    process.stdout.write(JSON.stringify(markers));
  });
}

/**
* Retreives latest Austin low water road crossing data
* and returns it as GeoJSON.
* If addStyle is true, adds simple-style properties to the Point features
*/
/**
 * Retreives latest Austin low water road crossing data and reformats it as GeoJSON.
 *
 * @param {Boolean} addStyle - if true, adds simple-style properties to the Point features
 * @param {Function} callback - node-style callback
 */
function getCrossingData (addStyle, callback) {
  request(CLOSURES_XML_URL, function (err, response, body) {
    if (err) {
      return callback(err);
    }

    xml2js.parseString(body, function (err, result) {
      if (err) {
        return callback(err);
      }

      if (!result.markers || !result.markers.marker) {
        return callback(new Error('No markers in parsed closures XML'));
      }

      var markers = result.markers.marker.map(function (m) {
        var attributes = m.$;
        attributes.lat = parseFloat(attributes.lat);
        attributes.lng = parseFloat(attributes.lng);

        if (addStyle) {
          var isClosed = attributes.type === 'off';
          attributes['marker-size'] = 'small';
          attributes['marker-color'] = isClosed ? '#f00' : '#0f0';
        }

        return attributes;
      });

      var markerGeoJson = toGeojson.parse(markers, {Point: ['lat', 'lng']});
      callback(null, markerGeoJson);
    });
  });  
}