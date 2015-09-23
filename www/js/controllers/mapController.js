angular.module('mapChat.controller', ['firebase.helper', 'firebase.utils'])

  .controller('MapController',
  function ($scope,
            $cordovaGeolocation,
            $stateParams,
            $ionicModal,
            $ionicPopup,
            $timeout,
            getCurrentLocation,
            $rootScope,
            fbGeoService,
            Auth,
            fbutil) {

    var center = [37.953757, -122.076692];
    var radius = 10;
    var maxDistance = 12;

    fbGeoService.queryLocation(center, radius, maxDistance);


    //MAP VIEW ENTERY POINT
    $scope.$on("$stateChangeSuccess", function () {
      $scope.initMap = function () {
        getCurrentLocation.then(function (current_position) {
          var location = current_position.coords;
          $scope.lat = location.latitude;
          $scope.lng = location.longitude;
          $scope.addMarkers(location);
          $scope.setMap();
        });
      };

      $scope.initMap();
    });

    $scope.listenToNewMessage = function () {
      console.log('in listent to new message scope');
      var messageRef = fbutil.ref("users/" + Auth.$getAuth().uid + "/messages");
      messageRef.limitToLast(1).on('child_added', function (snapshot) {
        var data = snapshot.val();
        $scope.incomingMessageFound = true;
        $scope.sender = data.sender;
        $scope.incomingMessage = data.message;

        //$timeout(function () {
        //  $scope.incomingMessageFound = false; //close the popup after 3 seconds for some reason
        //  console.log('setting to false');
        //}, 3000);
      });
    };

    //$scope.$watch('message', function(newValue, oldValue) {
    //  console.log('GOT NEW MESSAGE ' + newValue);
    //  $scope.message = newValue;
    //});

    $scope.watchCurrentPosition = function () {
      var watchOptions = {
        frequency: 1000,
        timeout: 3000,
        enableHighAccuracy: false // may cause errors if true
      };

      var watch = $cordovaGeolocation.watchPosition(watchOptions);

      watch.then(
        function () {
        },
        function (err) {
          console.log(err);
        },
        function (location) {
          console.log('getting current location');
          location = location.coords;
          console.log(location);
          $scope.debuglat = location.latitude;
          $scope.debuglng = location.longitude;
        });

      //geoWatchLocation.clearWatch();

      //var options = {
      //  enableHighAccuracy: true,
      //  timeout: 5000,
      //  maximumAge: 0
      //};
      //
      //function success(pos) {
      //  var location = pos.coords;
      //  console.log('getting current location:');
      //  console.log(location)
      //}
      //
      //function error(err) {
      //  console.warn('ERROR(' + err.code + '): ' + err.message);
      //}
      //
      //id = navigator.geolocation.watchPosition(success, error, options);
    };


    $scope.listenToNewMessage();
    $scope.watchCurrentPosition();

    $scope.setMap = function () {
      $scope.map = {
        defaults: {
          tileLayer: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
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
          zoom: 8
        }
      };
    };

    $scope.centerMarkIcon = {
      iconUrl: 'img/ping.png',
      //iconSize:     [38, 95], // size of the icon
      iconAnchor: [28, 13] // point of the icon which will
      //type: 'awesomeMarker',
      //icon: 'coffee',
      //markerColor: 'red'
      //markerColor: 'red'
    };


    $scope.addMarkers = function (current_location) {
      //Read other users' locations, and create markers on their locations.
      //Can be extended, more features can be added to this function.
      var otherUsers = $rootScope.otherUsersLocations;
      var markers = {};
      for (i = 0; i < otherUsers.length; i++) {
        var key = 'm' + i;
        var location = otherUsers[i].location;
        var userId = otherUsers[i].userId;
        markers[key] = {
          lat: location[0],
          lng: location[1],
          message: "<div ng-include=\"'templates/marker/marker_popup.html'\" onload=\"userId = " + "'" + userId + "'" + "\"></div>",
          icon: {
            type: 'awesomeMarker',
            icon: 'ion-person',
            prefix: 'ion',
            markerColor: 'darkgreen'
          }

        };
      }
      //add center marker's icon
      markers['center'] = {
        lat: current_location.latitude,
        lng: current_location.longitude,
        message: "I am very upset",
        icon: {
          type: 'awesomeMarker',
          icon: 'ion-sad',
          prefix: 'ion',
          markerColor: 'orange'
        }
      };
      $scope.markers = markers;
    };


    $scope.locate = function () {
      $scope.setMap();
    };

    $scope.centerMapToCurrentLocation = function () {
      getCurrentLocation.then(function (current_position) {
        var location = current_position.coords;
        setMap(location);
      })
    };
  })


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

  .controller('MarkerController', function ($scope, $ionicPopup, $timeout, fbMessageService, Auth) {
    $scope.greet = function (user) {
      alert("Greet");
    };

    //Triggered on a button click, or some other target
    $scope.showPopup = function () {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/ionicPopup/chatPopup.html',
        title: $scope.userId,
        subTitle: 'Send a message',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Send</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.message) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.message;
              }
            }
          }
        ]
      });
      myPopup.then(function (res) {
        //console.log($scope.messageToBeSent);
        fbMessageService.sendMessage(Auth, $scope.userId, res);
        console.log('Tapped!' + $scope.userId, res);
      });

      $timeout(function () {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 10000);
    };
  });

//.controller('AddLocationCtrl', function ($rootScope, $scope, Auth, fbGeoService) {
//  //var center = [37.785584, -122.39923];
//
//  var center = [37.953757, -122.076692];
//  var radius = 10;
//  var maxDistance = 12;
//
//  fbGeoService.queryLocation(center, radius, maxDistance);
//
//  //DEBUG PURPOSE, REMOVE WHOLE SECTION LATER!
//  var authData = Auth.$getAuth();
//  $scope.currentLoginAs = authData.uid;
//  if (authData) {
//    $scope.currentLoginAs = authData.uid;
//    $scope.addLocation = function (lat, lng) {
//      fbGeoService.set(Auth, [parseFloat(lat), parseFloat(lng)]);
//      console.log('location added!');
//    };
//    $scope.getLocation = function () {
//      fbGeoService.get(Auth);
//    };
//  }
//});



