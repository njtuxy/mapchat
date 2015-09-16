angular.module('mapChat.controller', ['firebase.helper', 'firebase.utils'])

  .controller('MapController',
  function ($scope,
            $cordovaGeolocation,
            $stateParams,
            $ionicModal,
            $ionicPopup,
            getCurrentLocation,
            $rootScope) {

    /**
     * Once state loaded, get put map on scope.
     */

      //angular.extend($scope, {
      //  defaults: {
      //    tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      //    maxZoom: 18,
      //    zoomControlPosition: 'bottomleft'
      //  },
      //
      //  kabam: {
      //    lat: 37.782287,
      //    lng: -122.400634,
      //    zoom: 15
      //  },
      //  markers: {}
      //});

      $scope.addMarkers = function () {
        console.log('in add Marker function');
        //Read other users' locations, and create markers on their locations.
        //Can be extended, more features can be added to this function.
        var otherUsers = $rootScope.otherUsersLocations;
        var markers = {};
        for (i = 0; i < otherUsers.length; i++) {
          var key = 'm' + i;
          var location = otherUsers[i].location;
          markers[key] = {lat: location[0], lng: location[1], message: "I am " + key};
        }
        $scope.markers = markers;
      };
      //
      //$scope.addMarkers();

    $scope.$on("$stateChangeSuccess", function () {
      //angular.extend($scope, {
      //  defaults: {
      //    tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      //    maxZoom: 18,
      //    zoomControlPosition: 'bottomleft'
      //  },
      //
      //  kabam: {
      //    lat: 37.782287,
      //    lng: -122.400634,
      //    zoom: 15
      //  },
      //  markers: {}
      //});

      //$scope.addMarkers = function () {
      //  //Read other users' locations, and create markers on their locations.
      //  //Can be extended, more features can be added to this function.
      //  var otherUsers = $rootScope.otherUsersLocations;
      //  var markers = {};
      //  for (i = 0; i < otherUsers.length; i++) {
      //    var key = 'm' + i;
      //    var location = otherUsers[i].location;
      //    markers[key] = {lat: location[0], lng: location[1], message: "I am " + key};
      //  }
      //  $scope.markers = markers;
      //
      //};
      //
      //$scope.addMarkers();

      //var lat, lng;

      $scope.getCurrentPosition1 = function () {
        getCurrentLocation.then(function (current_position) {
          var location = current_position.coords;
          $scope.lat = location.latitude;
          $scope.lng = location.longitude;
          $scope.addMarkers();
          setMap1();
        });
      };

      $scope.getCurrentPosition1();
      function setMap1() {
        $scope.map = {
          defaults: {
            tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            maxZoom: 18,
            zoomControlPosition: 'bottomleft'
          },
          markers: $scope.markers,
          events: {
            map: {
              enable: ['context'],
              logic: 'emit'
            }
          },
          center: {
            lat: $scope.lat,
            lng: $scope.lng,
            zoom: 16
          }
        };
      }


      //$scope.centerMapToCurrentLocation();
      //$scope.watchCurrentPosition();
    });

    function setMap(location) {
      var lat = location.latitude;
      var lng = location.longitude;

      //Need to update the service to new one!
      //geoFireService.set('location', [lat, lng]);

      $scope.map.center = {
        lat: lat,
        lng: lng,
        zoom: 16
      };

      $scope.map.markers[0] = {
        lat: lat,
        lng: lng,
        message: "<div ng-include src=\"'templates/marker/marker_popup.html'\"></div>",
        focus: true,
        draggable: false,
        icon: {
          iconUrl: 'img/ping.png',
          //iconSize:     [38, 95], // size of the icon
          iconAnchor: [28, 13] // point of the icon which will
          //type: 'awesomeMarker',
          //icon: 'coffee',
          //markerColor: 'red'
          //markerColor: 'red'
        }
      }
    }

    $scope.centerMapToCurrentLocation = function () {
      getCurrentLocation.then(function (current_position) {
        var location = current_position.coords;
        setMap(location);
      })
    };

    $scope.watchCurrentPosition = function () {
      //  var watchOptions = {
      //    frequency: 1000,
      //    timeout: 3000,
      //    enableHighAccuracy: false // may cause errors if true
      //  };
      //
      //  var watch = $cordovaGeolocation.watchPosition(watchOptions);
      //
      //  watch.then(
      //    function () {
      //    },
      //    function (err) {
      //      console.log("++++++++++++++++++++++++++++++++++++++++");
      //      console.log(err);
      //      console.log("++++++++++++++++++++++++++++++++++++++++");
      //    },
      //    function (position) {
      //      console.log(position);
      //      setMap(position.coords);
      //    });
      //
      //  //geoWatchLocation.clearWatch();

      //  var options = {
      //    enableHighAccuracy: true,
      //    timeout: 5000,
      //    maximumAge: 0
      //  };
      //
      //  function success(pos) {
      //    var crd = pos.coords;
      //    console.log('Your current position is:');
      //    console.log('Latitude : ' + crd.latitude);
      //    console.log('Longitude: ' + crd.longitude);
      //    console.log('More or less ' + crd.accuracy + ' meters.');
      //  };
      //
      //  function error(err) {
      //    console.warn('ERROR(' + err.code + '): ' + err.message);
      //  };
      //
      //  console.log(navigator.geolocation.getCurrentPosition(success, error, options));
      //}

      var id, options;

      function success(pos) {
        var crd = pos.coords;
        console.log("getting to new location!");
        setMap(crd);
      }

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }

      options = {
        enableHighAccuracy: false,
        timeout: 1000,
        maximumAge: 0
      };

      id = navigator.geolocation.watchPosition(success, error, options);

      console.log(id);
    }
  }
)

  .controller('AccountCtrl', function ($scope, $state, Auth) {
    $scope.login = function (email, pass) {
      $scope.err = null;
      Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true})
        .then(function (/* user */) {
          console.log('logged in!');
          $state.go('app.map');
        }, function (err) {
          console.log(err);
          //$scope.err = errMessage(err);
        });
    };

    $scope.logout = function () {
      Auth.$unauth();
      console.log('logged out!')
    }
  })

  .controller('MarkerController', function ($scope, $ionicPopup, $timeout) {
    $scope.greet = function (user) {
      alert("Greet");
    };

    //Triggered on a button click, or some other target
    $scope.showPopup = function () {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="data.wifi">',
        title: 'Enter Wi-Fi Password',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.wifi;
              }
            }
          }
        ]
      });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
      $timeout(function () {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);
    };
  })

  .controller('AddLocationCtrl', function ($rootScope, $scope, Auth, fbGeoService) {

    //var center = [37.785584, -122.39923];

    var center = [37.953757,-122.076692];
    var radius = 10;
    var maxDistance = 12;

    fbGeoService.queryLocation(center, radius, maxDistance);

    fbGeoService.get(Auth);

    //DEBUG PURPOSE, REMOVE WHOLE SECTION LATER!
    var authData = Auth.$getAuth();
    $scope.currentLoginAs = authData.uid;
    if (authData) {
      $scope.currentLoginAs = authData.uid;
      $scope.addLocation = function (lat, lng) {
        fbGeoService.set(Auth, [parseFloat(lat), parseFloat(lng)]);
        console.log('location added!');
      };
      $scope.getLocation = function () {
        fbGeoService.get(Auth);
      };
    }
  })
;
