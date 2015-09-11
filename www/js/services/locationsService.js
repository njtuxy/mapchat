angular.module('mapChat')

  .factory('getCurrentLocation', function ($cordovaGeolocation, $q) {
    var def = $q.defer();
    $cordovaGeolocation.getCurrentPosition()
      .then(function (position) {
        def.resolve(position)
      });

    return def.promise;
  })

  .factory('geoWatchLocationService', function ($cordovaGeolocation, $q) {
    var watchOptions = {
      frequency: 1000,
      timeout: 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var def = $q.defer();

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      function () {
      },
      function (err) {
        console.log(err);
      },
      function (position) {
        def.resolve(position)
      });

    return def.promise;

  });
