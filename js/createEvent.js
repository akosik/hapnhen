//variable name evntLatLng referenced from map.js file
var btn = document.getElementById("btn");
btn.onclick = function()
      {
          var myLat= eventLatLng.lat;
          var myLng= eventLatLng.lng;
          var title= document.getElementById("title").value;
          var description = document.getElementById("description").value;
          var type = document.getElementById("type").value;
          var lhint = document.getElementById("location").value;
          var msg = {"title": title, "location": {"type": "Point", "coordinates":[ myLng, myLat ]}, "description": description,
                     "eventType": type, "startTime":Date.now(),"locationHint": lhint};
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
                      console.log(textStatus,errorThrown);
                      alert("Your event could not be created at this time.");
                  }
              });
      };
