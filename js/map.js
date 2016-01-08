function openpad(title,timestamp,message)
{
    $("#MAPVIEW").hide();
    $("#LISTVIEW").hide();
    $("#gloopad").show();
    $("#gloopad").text(title + timestamp + message);
}

var eventLatLng = null;

window.onload = function()
{
    $("#LISTVIEW").hide();
    $("#NEWEVENT").hide();
    $("#gloopad").hide();
    var mapDiv = document.getElementById('map');
    navigator.geolocation.getCurrentPosition(showpos);
    function showpos(pos)
    {
        //Setup map
        var myLatLng = {lat: pos.coords.latitude, lng: pos.coords.longitude};
        var options =
                {
                    center: myLatLng,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    disableDoubleClickZoom: true,
                    navigationControl: false,
                    draggable: true,
                    scrollwheel: true
                };
        var mapObject = new google.maps.Map(mapDiv, options);

        //current location marker
        var myMarker = new google.maps.Marker({map: mapObject, position: myLatLng, title: "Your Location"});

        //Control Double click point capture
        var eventMarker;
        mapObject.addListener('dblclick', function( event ){
            var eventlat = event.latLng.lat();
            var eventlng = event.latLng.lng();
            eventLatLng = {lat: eventlat, lng: eventlng};
            try {
                eventMarker.setMap(null);
                eventMarker = null;
            }
            catch (ReferenceError) {}
            eventMarker = new google.maps.Marker({
                map: mapObject,
                position: eventLatLng,
                title: "Your Event Location"
            });
            var infowindow = new google.maps.InfoWindow({content: "Your Event Location"});
            eventMarker.addListener('click', function()
                                          {
                                              infowindow.open(mapObject, eventMarker);
                                          });
        });

        //Collect query data
        var event_data =
                {
                    "lat":pos.coords.latitude,
                    "lng":pos.coords.longitude,
                    "radius":2
                };
        $.ajax(
            {
                type: 'POST',
                url:'/findEvents',
                data: JSON.stringify(event_data),
                dataType: 'json',
                success: function(result,status)
                {
                    var list=result.hits;
                    list.forEach(function(e)
                                 {
                                     var title = e.title;
                                     var time = e.startTime;
                                     var message = e.description;
                                     var location = e.location.coordinates;
                                     var minutes = 1000 * 60;
                                     var hours = minutes * 60;
                                     var days = hours * 24;
                                     var years = days * 365;
                                     var d = new Date();
                                     var current_time = d.getTime();
                                     var time_since = current_time - time;
                                     var days_since = Math.floor(time_since / days);
                                     var hrs_since = Math.floor(time_since/ hours);
                                     var min_since = Math.floor(time_since / minutes);
                                     var timestamp = "";
                                     if (days_since>0)
                                     {
                                         timestamp = +days_since+' days, '+ (hrs_since-(days_since*24))+' hrs, '+ (min_since-(hrs_since*60)) +' minutes ago';
                                     }
                                     else if (hrs_since>0)
                                     {
                                         timestamp = +hrs_since+' hrs, '+ (min_since-(hrs_since*60)) +' minutes ago';
                                     }
                                     else
                                     {
                                         timestamp = + min_since +' minutes ago';
                                     }

                                     $("#list").prepend
                                     ($(
                                         '<div class="bubbledLeft">'
                                             +'<b>'+title+'</b>'+'<br>'
                                             +'<div class="message">'
                                             +message
                                             +'<div class="timestamp">'
                                             +timestamp
                                             +'</div>'
                                             +'</div>'
                                             +'</div>'
                                     ).click(function(e){
                                         openpad(title,timestamp,message);
                                     })
                                     );
                                     var marker_options =
                                             {
                                                 position: new google.maps.LatLng(location[1],location[0]),
                                                 map: mapObject
                                             };
                                     var marker = new google.maps.Marker(marker_options);
                                     var infowindow_options =
                                             {
                                                 content: title + '<br>' + timestamp
                                             };
                                     var infowindow = new google.maps.InfoWindow(infowindow_options);
                                     google.maps.event.addListener(marker, 'click', function()
                                                                   {
                                                                       infowindow.open(mapObject, marker);
                                                                   });
                                 });
                },
                error: function(jqXHR,textStatus,errorThrown)
                {
                    console.log(textStatus,errorThrown);
                    alert("There was an error finding events in your area.");
                }
            });
    };
};

$(document).ready(function()
                  {
                      $(".btn1").click(function()
                                       {
                                           $("#LISTVIEW").show();
                                           $("#MAPVIEW").hide();
                                       });
                      $(".btn3").click(function()
                                       {
                                           $("#MAPVIEW").show();
                                           $("#LISTVIEW").hide();
                                       });
                      $(".btn2").click(function()
                                       {
                                           if(eventLatLng) {
                                               $("#MAPVIEW").hide();
                                               $("#LISTVIEW").hide();
                                               $("#NEWEVENT").show();
                                           }
                                           else alert("Please specify a location for your event first");
                                       });
                      $("#btnBack").click(function()
                                              {
                                                  $("#MAPVIEW").show();
                                                  $("#NEWEVENT").hide();
                                              });
                  });
