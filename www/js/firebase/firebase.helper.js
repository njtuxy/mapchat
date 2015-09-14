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
    this.set = function (auth, location) {
      var authData = auth.$getAuth();
      console.log(authData.uid.toString());
      var geo = $geofire(fbutil.ref("locations/"));
      geo.$set(authData.uid.toString(), location);
    };

    this.get = function(auth){
      var authData = auth.$getAuth();
      var geo = $geofire(fbutil.ref("locations/"));
      geo.$get(authData.uid.toString()).then(function(location){
        if (location === null) {
          console.log("Provided key is not in GeoFire");
        }
        else {
          console.log("Provided key has a location of " + location);
        }
      }, function(error) {
        console.log("Error: " + error);
      });
    };

    //this.queryR = function (auth) {
    //  var authData = auth.$getAuth();
    //  var geo = $geofire(fbutil.ref("users/" + authData.uid));
    //  var query = geo.$query({
    //    center: [37.785583, 122.399219],
    //    radius: 20
    //  });
    //
    //  console.log(query);
    //
    //  query.on("key_entered", function (key, location, distance) {
    //    console.log(key + " entered query at " + location + " (" + distance + " km from center)");
    //  });
    //
    //  query.on("key_moved", function (key, location) {
    //    console.log(key + " entered query at " + location);
    //  });
    //
    //  return query;
    //}


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
