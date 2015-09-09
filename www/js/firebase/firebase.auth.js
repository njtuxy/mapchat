/**
 * Created by yxia on 9/8/15.
 */
angular.module('firebase.auth', ['firebase', 'firebase.utils'])
  .factory('Auth', function ($firebaseAuth, fbutil) {
    return $firebaseAuth(fbutil.ref());
  });
