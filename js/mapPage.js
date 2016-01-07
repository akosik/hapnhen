window.onload = function(){
  var map = document.getElementById('map');
  navigator.geolocation.getCurrentPosition(showpos);
}

function showpos(pos){
    var myLatLng = {lat: pos.coords.latitude, lng: pos.coords.longitude};

    var options = {
      center: myLatLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
disableDefaultUI: true,
disableDoubleClickZoom: true,
      navigationControl: false,
      draggable: false,
      scrollwheel: true,
      };

    var mapObject = new google.maps.Map(map, options);

/* write function to create marker for each event for */
    var marker_options = {
      position: new google.maps.LatLng(myLatLng),
      map: mapObject,
      title: 'Click me'
      };
var marker = new google.maps.Marker(marker_options);

  mapObject.addListener('dblclick', function( event ){
  var eventlat = event.latLng.lat();
  var eventlng = event.latLng.lng();
  var eventLatLng = {lat: eventlat, lng: eventlng};
      try {
      eventMarker.setMap(null);
      eventMarker = null;
      }
      catch (ReferenceError) {}
      eventMarker = new google.maps.Marker({
      map: mapObject,
      position: eventLatLng,
      title: 'event'
      });
      });

}
