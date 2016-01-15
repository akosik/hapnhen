/*Bit of a wierd one: on load, we setup the map based on our position
                      along with the spiderfy mumbo-jumbo. then we call
                      findEvents once and then set it to run in a loop.
                      I chose setInterval over a self-invoking function
                      that uses setTimeout because we want regular updates
                      that the user can expect, whereas setTimeout sets a
                      delay after however long it took for the function to
                      run that time, which can vary over the network, especially
                      on mobile devices.*/

window.onload = function()
{
    var mapDiv = document.getElementById('map');
    navigator.geolocation.getCurrentPosition(showpos);
    function showpos(pos)
    {
        //Setup map
        var myLatLng = {lat: pos.coords.latitude, lng:  pos.coords.longitude};
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
        var markers = [];

        //spiderfy setup
        var oms = new OverlappingMarkerSpiderfier(mapObject, {keepSpiderfied: true});
        var iw = new google.maps.InfoWindow();
        oms.addListener('click', function(marker, event) {
            iw.setContent(marker.desc);
            iw.open(mapObject, marker);
        });
        oms.addListener('spiderfy', function(markers) {
            iw.close();
        });

        //Collect query data
        var event_data = myLatLng;
        event_data.radius = 2;

        //call first
        findEvents(event_data, mapObject, oms, markers, myLatLng);

        //then repeat
        setInterval((mapObject, oms, markers, myLatLng) => {
            navigator.geolocation.getCurrentPosition(function(pos) {
                var myLatLng = {lat: pos.coords.latitude, lng:pos.coords.longitude};
                mapObject.panTo(myLatLng);
                var event_data = myLatLng;
                event_data.radius = 2;
                findEvents(event_data, mapObject, oms, markers, myLatLng);
            });
        }, 1000*60, mapObject, oms, markers, myLatLng);
    }
};

function findEvents(query_info, mapObject, oms, markers, myLatLng) {
        $.ajax(
            {
                type: 'POST',
                url:'/findEvents',
                data: JSON.stringify(query_info),
                dataType: 'json',
                success: function(result,status)
                {
                    var list=result.hits;

                    //Clear List
                    var oldEvents = document.getElementsByClassName("event");
                    for (var i=oldEvents.length - 1; i>=0; i--) {
                        if (oldEvents[i].parentNode) {
                            oldEvents[i].parentNode.removeChild(oldEvents[i]);
                        }
                    }

                    //Clear map
                    oms.clearMarkers();
                    for (var i = markers.length - 1; i >= 0; i--) {
                        markers[i].setMap(null);
                        markers.pop();
                    }

                    //current location marker
                    var myMarker = new google.maps.Marker({map: mapObject, position: myLatLng, title: "Your Location"});
                    myMarker.desc = "Your Current Location";
                    oms.addMarker(myMarker);
                    markers.push(myMarker);

                    var num = 0;
                    list.forEach(function(e)
                                 {
                                     //Extract response info
                                     var title = e.title;
                                     var time = e.startTime;
                                     var message = e.description;
                                     var location = e.location.coordinates;
                                     var locationHint = e.locationHint;
                                     var type = e.eventType;
                                     var iAmGoing = e.iAmGoing;
                                     var going = e.going;
                                     if(going == undefined)  going = 0;
                                     var gloopad = e.gloopad;

                                     //Calculate time
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

                                     //Populate List View
                                     $("#events").prepend
                                     (
                                         '<li>'
                                         +'<span id="panel' + num + '" class="event">'
                                             +'<b>'+title+'</b>'+'<br>'
                                             +'<div class="listType">'
                                             +type
                                             +'</div>'
                                             +'<div class="message">'
                                             +message
                                             +'</div>'
                                             +'<div class="listPlace">'
                                             +locationHint
                                             +'</div>'
                                             +'<div class="timestamp">'
                                             +timestamp
                                             +'</div>'
                                             +'<div class="going" id="numGoing' + num + '">'
                                             +going
                                             +'</div>'
                                             +'<input type="checkbox" id="check' + num  + '">'
                                             +'<div id="btn' + num + '" class="commentButton black">'
                                             +'<h2 class="btnheadings">'
                                             +'Comment'
                                             +'</h2>'
                                             +'</div>'
                                             +'</span>'
                                         +'</li>'
                                     );
                                     //Setup voting for events and comments, see vote.js and comments.js
                                     setupVoting({title:title}, num);
                                     setupPad(gloopad, num, title);
                                     if(iAmGoing) document.getElementById("check" + num).checked = true;
                                     num++;

                                     var marker = new google.maps.Marker({ position: new google.maps.LatLng(location[1],location[0]),
                                                                           map: mapObject
                                                                         });
                                     marker.desc = title + '<br>' + timestamp;
                                     oms.addMarker(marker);
                                     markers.push(marker);
                                 });
                },
                error: function(jqXHR,textStatus,errorThrown)
                {
                    console.log(textStatus,errorThrown);
                    alert("There was an error finding events in your area.");
                }
            });
};
