var btn = document.getElementById("btn");
btn.onclick = function()
{
  navigator.geolocation.getCurrentPosition(function(pos)
  {
      var myLat= pos.coords.latitude;
      var myLng= pos.coords.longitude;
      var title= document.getElementById("title").value;
      var description = document.getElementById("description").value;
      var type = document.getElementById("type").value;
    var msg = {"title": title, "location": {"type": "Point", "coordinates":[ myLng, myLat ]}, "description": description,
      "eventType": type, "startTime":Date.now(),"locationHint": "Library Lobby"};
    $.ajax(
      {
        type: 'POST',
        url:'/createEvent',
        data: JSON.stringify(msg),
        dataType: 'json',
        success: function(result,status)
        {
            location.href='/pages/mapPage.html';
        },
        error: function(jqXHR,textStatus,errorThrown)
          {
              location.href='/pages/mapPage.html';
              console.log(textStatus,errorThrown);
              alert("Your event could not be created at this time.");
        }
      });
  });
};
