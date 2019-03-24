//main
function initMap() {
  var fuku = {lat: 40.4414846, lng: -79.9567473};
  var sushi = {lat: 40.4415281, lng:-79.974257};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: fuku
  });
  
  var marker = new google.maps.Marker({
  position: fuku,
  map: map
  });
  
  var sushi_marker = new google.maps.Marker({
    position: sushi,
    map: map
  });
}
function onSuccess(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tokenSignIn');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
    };
    xhr.send('idtoken=' + id_token);
}
function signOut(){
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        console.log('User signed out.');
         var xhr = new XMLHttpRequest();
        xhr.open('POST', '/tokenSignOut');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
        };
        });
}