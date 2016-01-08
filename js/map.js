window.onload = function()
{
  $("#LISTVIEW").hide();
  $("#NEWEVENT").hide();
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
      draggable: true,
      scrollwheel: true,
      };

    var mapObject = new google.maps.Map(mapDiv, options);

  /* write function to create marker for each event for */
    var marker_options =
      {
      position: new google.maps.LatLng(myLatLng),
      map: mapObject,
      title: 'Your Location'
      };
    var marker = new google.maps.Marker(marker_options);

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
            var title = e.title
            var time = e.startTime
            var message = e.description
            var location = e.location.coordinates
            var minutes = 1000 * 60;
            var hours = minutes * 60;
            var days = hours * 24;
            var years = days * 365;
            var d = new Date();
            var current_time = d.getTime();
            var time_since = current_time - time
            var days_since = Math.round(time_since / days);
            var hrs_since = Math.round(time_since / hours);
            var min_since = Math.round(time_since / minutes)
            $("#list").prepend
              ($(
                '<div class="bubbledLeft">'
                  +'<b>'+title+'</b>'+'<br>'
                    +'<div class="message">'
                      +message
                      +'<div class="timestamp">'
                        +'<br>'+days_since+' days, '+hrs_since+' hrs, '+ min_since +' minutes ago'
                          /*if (days_since>0)
                          {
                            +days_since+' days, '+hrs_since+' hrs, '+ min_since +' minutes ago'
                          } else if (hrs_since>0)
                          {
                            +hrs_since+' hrs, '+ min_since +' minutes ago'
                          } else {
                            + min_since +' minutes ago'
                          }*/
                      +'</div>'
                    +'</div>'
                +'</div>'
                )
              )
            var marker_options =
              {
                position: new google.maps.LatLng(location[1],location[0]),
                map: mapObject,
                title: title
              };
            var marker = new google.maps.Marker(marker_options);
            var infowindow_options =
              {
content: "title: " + title
              };
            var infowindow = new google.maps.InfoWindow(infowindow_options);
            marker.addListener('click', function()
                {
                  infowindow.open(mapObject, marker);
                });
          });
        },
        error: function(jqXHR,textStatus,errorThrown)
        {
          console.log(textStatus,errorThrown)
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
