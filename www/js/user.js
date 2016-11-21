angular.module('finly.user', [])
.factory('User', function($http, $q) {

  var apiUrl   = 'http://52.66.147.226/finlyApi/public/index.php';
  var mobile = window.localStorage.getItem("LOCAL_MOBILE");
  var firstname = window.localStorage.getItem("firstname");
  var loggedIn = false;
  var password = window.localStorage.getItem("PASSWORD");


  function loadUserCredentials() {
    var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
      if (token) {
        useCredentials(token);
    }
   }

   function storeUserCredentials(token) {
     window.localStorage.setItem("LOCAL_TOKEN_KEY", token);
      useCredentials(token);
    }

    function useCredentials(token) {
      loggedIn = true;
      $http.defaults.headers.common.Authorization = 'Bearer' + token;
    }

    function destroyUserCredentials() {
    loggedIn = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem("LOCAL_TOKEN_KEY");
    window.localStorage.removeItem("LOCAL_MOBILE");
    window.localStorage.removeItem("firstname");
    }

    var login = function(credentials) {
      return $http({
    url : apiUrl + '/auth/login',
    method : "POST",
    headers: { "Content-Type" : "application/x-www-form-urlencoded" },
    data : [
        'mobile_number=' + encodeURIComponent(credentials.mobile_number),
        'password=' + encodeURIComponent(credentials.password)
           ].join('&')
    })
      .then(function(response) {
        window.localStorage.setItem("LOCAL_MOBILE", credentials.mobile_number);
        var token = response.data.token;
        storeUserCredentials(token);
        var mobile = window.localStorage.getItem("LOCAL_MOBILE");
        return $http({
      url : 'http://52.66.147.226/coreapi/user.php?mobile='+mobile,
      method : "GET",
      headers: { "Content-Type" : "application/x-www-form-urlencoded" }
      }).then(function(response) {
        console.log(response);
        window.localStorage.setItem("firstname", response.data.name[0].firstname);
      });
      });
    };

    isLoggedIn = function() {
      var mobile = window.localStorage.getItem("LOCAL_MOBILE");
      if(mobile !== null)
      return loggedIn = true;
      else {
        return loggedIn = false;
      }
    };

    var logout = function() {
    destroyUserCredentials();
    };

    function persist(mobile, password) {
      window.localStorage.setItem("LOCAL_MOBILE", mobile);
      window.localStorage.setItem("PASSWORD", password);
    }

    function destroyPersist() {
      //window.localStorage.removeItem("LOCAL_MOBILE");
      window.localStorage.removeItem("PASSWORD");
    }

    function registerDevice(token, device_id, platform, mobile_number) {
      var deferred = $q.defer();

      return $http({
    url : apiUrl + '/registerDevice/' + mobile_number,
    method : "PUT",
    headers: { "Content-Type" : "application/x-www-form-urlencoded" },
    data : [
        'token=' + encodeURIComponent(token),
        'device_id=' + encodeURIComponent(device_id),
        'platform=' + encodeURIComponent(platform)
           ].join('&')
    })
        .success(function (data) {

          deferred.resolve(data);
        })
        .error(function () {
          deferred.reject('error');
        });

        return deferred.promise;
    }


    var forgotPass = function(forgot) {
        return $http.post(apiUrl + '/forgotpass', forgot);
    };

    var register = function(user, regID, uuid, platform) {
        persist(user.mobile_number, user.password);
        window.localStorage.setItem("firstname", user.firstname);
        return $http({
      url : apiUrl + '/register',
      method : "POST",
      headers: { "Content-Type" : "application/x-www-form-urlencoded" },
      data : [
          'firstname=' + encodeURIComponent(user.firstname),
          'lastname=' + encodeURIComponent(user.lastname),
          'mobile_number=' + encodeURIComponent(user.mobile_number),
          'email=' + encodeURIComponent(user.email),
          'password=' + encodeURIComponent(user.password),
          'regID=' + encodeURIComponent(regID),
          'uuid=' + encodeURIComponent(uuid),
          'platform=' + encodeURIComponent(platform),
             ].join('&')
      });
    };


    var resendOTP = function(user) {
      user.mobile_number = window.localStorage.getItem("LOCAL_MOBILE");
        return $http({
      url : apiUrl + '/resendOTP/' + user.mobile_number,
      method : "PUT",
      headers: { "Content-Type" : "application/x-www-form-urlencoded" }
      });
    };


    var subChannel = function(channelid,mobile) {
        return $http({
      url : 'http://localhost/coreapi/sub_channel.php?channelid='+channelid+'&&mobile'+mobile,
      method : "GET",
      headers: { "Content-Type" : "application/x-www-form-urlencoded" }
      });
    };

    var otpVerify = function(otp) {
        otp.mobile = window.localStorage.getItem("LOCAL_MOBILE");
        otp.password = window.localStorage.getItem("PASSWORD");
        return $http({
      url : apiUrl + '/auth/otp',
      method : "POST",
      headers: { "Content-Type" : "application/x-www-form-urlencoded" },
      data : [
          'mobile_number=' + encodeURIComponent(otp.mobile),
          'otpnum=' + encodeURIComponent(otp.otpnum),
          'password=' + encodeURIComponent(otp.password)
             ].join('&')
      }).then(function(response) {
        var token = response.data.token;
        storeUserCredentials(token);
        return $http({
      url : apiUrl + '/otpverify/' + otp.mobile,
      method : "PUT",
      headers: { "Content-Type" : "application/x-www-form-urlencoded" }
      }).then(function(response) {
        destroyPersist();
      });
      });
    };


  return {
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    register: register,
    subChannel : subChannel,
    forgotPass: forgotPass,
    otpVerify: otpVerify,
    resendOTP: resendOTP,
    registerDevice: registerDevice
  };
});
