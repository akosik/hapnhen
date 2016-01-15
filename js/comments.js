function setupPad(pad, eventnum, title) {
    var btnComment = document.getElementById("btn" + eventnum);
    btnComment.onclick = function(event) {
        event.stopPropagation();
        $("#MAPVIEW").show();
        $("#btnList").hide();
        $("#btnMap").hide();
        $(".btnCreate").hide();
        $("#LISTVIEW").hide();
        $("#NEWEVENT").hide();
        $("#GLOOPADVIEW").show();
        document.getElementById("gloopad").src = 'http://gloopen.com/Pad.html?id=' + pad + '&title=' + encodeURIComponent(title);
    };
}
