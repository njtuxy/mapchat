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

    this.get = function (key) {
      return geo.$get(key);
    };

    this.query = function (center, radius) {
      return geo.$query(center, radius)
    }
  })

  .service('fbGeoService', function (fbutil, $firebaseArray, $geofire) {
    this.set = function (auth, key, location) {
      var authData = auth.$getAuth();
      var geo = $geofire(fbutil.ref("users/" + authData.uid));
      geo.$set(key, location);
    };


  })
  //.controller('AddLocationCtrl', function ($scope, Auth, fbutil, $firebaseArray, $geofire) {
  //  $scope.addLocation = function (lat, lng) {
  //    var lat_i = parseInt(lat);
  //    var lng_i = parseInt(lng);
  //    var authData = Auth.$getAuth();
  //    if (authData) {
  //      var geo = $geofire(fbutil.ref("users/" + authData.uid));
  //      //var userReference = fbutil.ref("users/" + authData.uid);
  //      //var syncArray = $firebaseArray(userReference.child("messages"));
  //      geo.$set('location', [lat_i, lng_i])
  //    }
  //  }

;
