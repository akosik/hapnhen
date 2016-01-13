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
        styleMap(mapObject);

        //current location marker
        var myMarker = new google.maps.Marker({map: mapObject, position: myLatLng, title: "Your Location"});
        var infowindow = new google.maps.InfoWindow({content: "Your Current Location"});
        myMarker.addListener('click', function()
                                {
                                    infowindow.open(mapObject, myMarker);
                                });
        //Collect query data
        var event_data =
                {
                    "lat":pos.coords.latitude,
                    "lng":pos.coords.longitude,
                    "radius":2
                };
        findEvents(event_data, mapObject);
        setInterval(update, 1000*60, mapObject);
        function update(mapObject) {
            navigator.geolocation.getCurrentPosition(function(pos) {
                var event_data =
                        {
                            "lat":pos.coords.latitude,
                            "lng":pos.coords.longitude,
                            "radius":2
                        };
                var myLatLng = {lat: pos.coords.latitude, lng: pos.coords.longitude};
                findEvents(event_data, mapObject);
                mapObject.panTo(myLatLng);
            });
        }
    }
};

function findEvents(query_info, mapObject) {
        $.ajax(
            {
                type: 'POST',
                url:'/findEvents',
                data: JSON.stringify(query_info),
                dataType: 'json',
                success: function(result,status)
                {
                    var list=result.hits;
                    var oldEvents = document.getElementsByClassName("bubbledLeft");
                    for (var i=oldEvents.length - 1; i>=0; i--) {
                        if (oldEvents[i].parentNode) {
                            oldEvents[i].parentNode.removeChild(oldEvents[i]);
                        }
                    }
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
