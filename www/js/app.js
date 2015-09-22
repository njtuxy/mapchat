// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mapChat', ['ionic', 'mapChat.controller','leaflet-directive', 'ngCordova', 'igTruncate', 'ngAnimate'])

  .run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        window.cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      $rootScope.otherUsersLocations = new Array();
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html"
      })

      .state('app.map', {
        url: "/map",
        views: {
          'menuContent' :{
            templateUrl: "templates/map.html",
            controller: "MapController"
          }
        }
      })

      .state('app.login', {
        url: "/login",
        views: {
          'menuContent' :{
            templateUrl: "templates/login.html",
            controller: 'AccountCtrl'
          }
        }
      });

      //.state('app.addLocation', {
      //  url: "/addLocation",
      //  views: {
      //    'menuContent' :{
      //      templateUrl: "templates/temp_input_location.html",
      //      controller: 'AddLocationCtrl'
      //    }
      //  }
      //});



    $urlRouterProvider.otherwise('/app/login');

  });
