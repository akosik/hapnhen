var checkchecker;
function setupVoting(event_info, checknum) {
    var check = document.getElementById("check" + checknum);
    var panel = document.getElementById("panel" + checknum);
    panel.onmouseenter = function() {
        checkchecker = check.checked;
    };
    panel.onclick = function() {
        if(!checkchecker) {
            $.ajax(
                {
                    type: 'POST',
                    url:'/vote',
                    data: JSON.stringify(event_info),
                    datatype: 'json',
                    success: function(result,status)
                    {
                        check.checked = true;
                        var numGoing = document.getElementById("numGoing" + checknum).textContent;
                        var numGoing = Number(numGoing) + 1;
                        document.getElementById("numGoing" + checknum).textContent = numGoing;
                    },
                    error:  function(jqXHR,textStatus,errorThrown)
                    {
                        if(errorThrown == "Conflict") {
                            alert("You already said you were going");
                            check.checked = true;
                        }
                        else {
                            alert("Sorry, we were unable to update your status to 'going'.");
                            check.checked = false;
                        }
                    }
                }
            );
        }
        else {
            check.checked = true;
            alert("You already said you were going");
        }
    };
}
