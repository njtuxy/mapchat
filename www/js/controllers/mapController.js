angular.module('mapChat').controller('MapController',
  ['$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'LocationsService',
    'getCurrentLocation',
    'InstructionsService',
    '$rootScope',
    function ($scope,
              $cordovaGeolocation,
              $stateParams,
              $ionicModal,
              $ionicPopup,
              LocationsService,
              getCurrentLocation,
              InstructionsService) {

      /**
       * Once state loaded, get put map on scope.
       */
      $scope.$on("$stateChangeSuccess", function () {



        //$scope.locations = LocationsService.savedLocations;
        //$scope.newLocation;

        //if (!InstructionsService.instructions.newLocations.seen) {
        //
        //  var instructionsPopup = $ionicPopup.alert({
        //    title: 'Add Locations',
        //    template: InstructionsService.instructions.newLocations.text
        //  });
        //  instructionsPopup.then(function (res) {
        //    InstructionsService.instructions.newLocations.seen = true;
        //  });
        //
        //}


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

        //getCurrentLocation.then(function (current_position) {
        //  //var location = LocationsService.savedLocations[locationKey];
        //  var location = current_position.coords;
        //  console.log(current_position);
        //
        //  $scope.map.center = {
        //    lat: location.latitude,
        //    lng: location.longitude,
        //    zoom: 12
        //  };
        //
        //  $scope.map.markers = {
        //    lat: location.latitude,
        //    lng: location.longitude,
        //    message: "I am a message",
        //    focus: true,
        //    draggable: false
        //  };
        //
        //});


        $scope.goToCurrentLocation();
        //$scope.locate();

      });

      var Location = function () {
        if (!(this instanceof Location)) return new Location();
        this.lat = "";
        this.lng = "";
        this.name = "";
      };

      $ionicModal.fromTemplateUrl('templates/addLocation.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });

      /**
       * Detect user long-pressing on map to add new location
       */
      $scope.$on('leafletDirectiveMap.contextmenu', function (event, locationEvent) {
        $scope.newLocation = new Location();
        $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
        $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
        $scope.modal.show();
      });

      $scope.saveLocation = function () {
        LocationsService.savedLocations.push($scope.newLocation);
        $scope.modal.hide();
        $scope.goToCurrentLocation(LocationsService.savedLocations.length - 1);
      };

      /**
       * Center map on specific saved location
       * @param locationKey
       */
      $scope.goToCurrentLocation = function () {

        getCurrentLocation.then(function (current_position) {
          //var location = LocationsService.savedLocations[locationKey];
          var location = current_position.coords;

          $scope.map.center = {
            lat: location.latitude,
            lng: location.longitude,
            zoom: 16
          };

          $scope.map.markers[0] = {
            lat: location.latitude,
            lng: location.longitude,
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

      /**
       * Center map on user's current position
       */
      $scope.locate = function () {
        $cordovaGeolocation
          .getCurrentPosition()
          .then(function (position) {
            $scope.map.center.lat = position.coords.latitude;
            $scope.map.center.lng = position.coords.longitude;
            $scope.map.center.zoom = 15;

            $scope.map.markers.now = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              message: "You Are Here",
              focus: true,
              draggable: false
            };

          }, function (err) {
            // error
            console.log("Location error!");
            console.log(err);
          });

      };

      $scope.toggleMenu = function () {
        $scope.sideMenuController.toggleLeft();
      }

    }])

  .controller('AccountCtrl', function ($scope, $state, Auth) {
    $scope.settings = {
      enableFriends: true
    };

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
