angular.module('mapChat.controller', ['firebase.helper'])

  .controller('MapController',
  function ($scope,
            $cordovaGeolocation,
            $stateParams,
            $ionicModal,
            $ionicPopup,
            getCurrentLocation,
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

      $scope.centerMapToCurrentLocation();
    });

    $scope.centerMapToCurrentLocation = function () {
      getCurrentLocation.then(function (current_position) {
        var location = current_position.coords;
        var lat = location.latitude;
        var lng = location.longitude;

        geoFireService.set('location', [lat,lng]);

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

        };

      })
    };
  })

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
