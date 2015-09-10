angular.module('mapChat')
  .factory('getCurrentLocation', function ($cordovaGeolocation, $q) {
    var def = $q.defer();
    $cordovaGeolocation.getCurrentPosition()
      .then(function (position) {
        def.resolve(position)
      });

    return def.promise;
  });

  //.factory('saveLocationToFirebase', function () {
  //
  //})
