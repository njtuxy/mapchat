/**
 * Created by yxia on 9/8/15.
 */
angular.module('firebase.helper', ['firebase', 'firebase.utils', 'angularGeoFire'])
  .factory('Auth', function ($firebaseAuth, fbutil) {
    return $firebaseAuth(fbutil.ref());
  })

  .service('geoFireService', function (fbutil, $geofire) {
    var geo = $geofire(fbutil.ref('users'));

    this.set = function (key, location) {
      return geo.$set(key, location);
    };

    this.get = function(key){
      return geo.$get(key);
    };
  })
;
