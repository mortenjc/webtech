/*global $     */
/*global alert */
"use strict";

var debug = 0;

function myAlert(msg) {
    if (debug === 1)
        alert(msg);
}


function search() {
    var text;
    text = document.getElementById("search").value
    myAlert("Query for: "  + text);
    query(text);
    return false;
}

/* Main entry */
$(document).ready(function () {
    document.getElementById("searchform").onsubmit = search;
});