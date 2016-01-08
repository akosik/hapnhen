function openpad(title,timestamp,message)
{
    $("#MAPVIEW").hide();
    $("#LISTVIEW").hide();
    $("#gloopad").show();
    $("#gloopad").text(title + timestamp + message);
}
window.onload = function()
{
    $("#LISTVIEW").hide();
    $("#NEWEVENT").hide();
    $("#gloopad").hide();
    var mapDiv = document.getElementById('map');
    navigator.geolocation.getCurrentPosition(showpos);
    function showpos(pos)
    {
        var myLatLng = {lat: pos.coords.latitude, lng: pos.coords.longitude};

        var options =
                {
                    center: myLatLng,
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    navigationControl: false,
                    draggable: false,
                    scrollwheel: false
                };

        var mapObject = new google.maps.Map(mapDiv, options);


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
                                           $("#MAPVIEW").hide();
                                           $("#LISTVIEW").hide();
                                           $("#NEWEVENT").show();
                                       });
                      $("#btnBack").click(function()
                                          {
                                              $("#MAPVIEW").show();
                                              $("#NEWEVENT").hide();
                                          });
                  });
