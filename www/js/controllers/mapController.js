angular.module('mapChat.controller', ['firebase.helper'])

  .controller('MapController',
  function ($scope,
            $cordovaGeolocation,
            $stateParams,
            $ionicModal,
            $ionicPopup,
            getCurrentLocation,
            geoWatchLocationService,
            geoFireService) {

    /**
     * Once state loaded, get put map on scope.
     */

    $scope.$on("$stateChangeSuccess", function () {
      $scope.map = {
        defaults: {
          tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 18,
          zoomControlPosition: 'bottomleft'
        },
        markers: {},
        events: {
          map: {
            enable: ['context'],
            logic: 'emit'
          }
        },
        center: {}
      };

      //$scope.centerMapToCurrentLocation();
      $scope.watchCurrentPosition();
    });

    function setMap(location) {
      var lat = location.latitude;
      var lng = location.longitude;
      geoFireService.set('location', [lat, lng]);

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
          $state.go('app.map');
        }, function (err) {
          $scope.err = errMessage(err);
        });
    };

    $scope.logout = function () {
      Auth.$unauth();
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
  });
