/*global $     */
/*global alert */
/*global Blob  */
"use strict";

var Offset = 0;
var Pagesize = 25;

/* Called when the AJAX query succeeds */
function ajaxsuccess(result, status, xhr) {
    var i, name, feature, addr, post, tele, blob, mob;
    var page_size, page_hits, total_hits;
    var postcodes = [];
    
    $(".list").empty();
    $(".stat").empty();
    
    $(".list").append("name, address, postcode, phone, mobile phone<br>");
    
    page_size = result.search.wp.pageSize;
    page_hits = result.search.wp.hits;
    total_hits = result.search.wp.totalHits;

    if (page_hits === 0) {
        $(".stat").append("query for \"" + $(".addr").val() + "\" returned no results");
        return;
    }

    if (page_hits < total_hits) {
        $(".stat").append("Displaying " + (Offset + 1) + " to " + Math.min((Offset + Pagesize), total_hits) + " of " + total_hits);
        $(".next").show();
    }
    
    /* Now generate the call list */
    for (i = 0; i < page_hits; i += 1) {
        feature = result.search.wp.features[i];
        name = feature.name;
        addr = feature.addresses[0].label;
        post = feature.addresses[0].postcode + " " + feature.addresses[0].area;

        /* Not all have public phone numbers */
        if ("phoneNumbers" in feature) {
            tele = feature.phoneNumbers[0];
            alert(feature.phoneNumbersExtended[0].type);
            if (feature.phoneNumbersExtended[0].type === "mob") {
                
                mob = feature.phoneNumbersExtended[0].phoneNumber;
            }
        } else {
            continue;
        }
        
        $(".list").append(name + ", ");
        $(".list").append(addr + ", ");
        $(".list").append(post + ", ");
        $(".list").append(tele + ", ");
        $(".list").append(mob);
        $(".list").append("<br>\r\n");
    }
}

/* Called is AJAX query fails */
function ajaxerror(jqxhr, status, error) {
    alert("error: jqxhr: " + jqxhr + ", status:" + status + ", error " + error);
}

/* Called when button pressed */
function query() {
    var URI, address, URL;
    Pagesize = parseInt($(".pgsz").val());
    URI = "http://map01.eniro.no/search/search.json?index=wp&profile=dk_dgs&version=4";
    address = $(".addr").val();
    URL = URI + "&pageSize=" + Pagesize + "&offset=" + Offset + "&q=" + address;
    //alert(URL);
    $.ajax({ url : URL, dataType: "jsonp", error: ajaxerror, success: ajaxsuccess });
}

function saveToFile() {
    var node, textToWrite, textFileAsBlob, fileNameToSaveAs, downloadLink;
    
    node = document.getElementsByClassName("list");
	textToWrite = node[0].textContent;
	textFileAsBlob = new Blob([textToWrite], {type: 'text/csv'});
	fileNameToSaveAs = "myfile.csv";

	downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL !== null) {
		// Chrome allows the link to be clicked without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	} else {
		// Firefox requires the link to be added to the DOM before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

/* Main entry */
$(document).ready(function () {
    $(".next").hide();
    
    $(".next").click(function () {
        Offset += Pagesize;
        query();
    });
    
    $(".search").click(function () {
        Offset = 0;
        query();
    });
    
    $(".save").click(saveToFile);
});
