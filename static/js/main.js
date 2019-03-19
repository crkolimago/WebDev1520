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