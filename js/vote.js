var checkchecker;
function setupVoting(event_info, checknum) {
    var check = document.getElementById("check" + checknum);
    check.onmouseenter = function() {
        checkchecker = check.checked;
    };
    check.onclick = function() {
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
                        var v = document.createAttribute("voted");
                        v.value = true;
                        check.setAttributeNode(v);
                    },
                    error:  function(jqXHR,textStatus,errorThrown)
                    {
                        alert("Sorry, we were unable to update your status to 'going'.");
                        check.checked = false;
                    }
                }
            );
        }
        else check.checked = true;
    };
}
