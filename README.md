# atx-low-water-crossings
Retrieves latest Austin, TX low water road crossing data from the [City of Austin atxfloods application](http://www.atxfloods.com) and returns it as GeoJSON. The package function takes 2 parameters, addStyle and callback.
 * @param {Boolean} addStyle - if true, adds simple-style properties to the Point features
 * @param {Function} callback - node-style callback

```javascript
var atxCrossingData = require('atx-low-water-crossings')
atxCrossingData.getCrossingData(true, function(err, result) {
  if (err) {
    console.error(err.toString())
  }
  process.stdout.write(JSON.stringify(result))
})
```
