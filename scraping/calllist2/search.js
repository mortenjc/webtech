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
    
    myAlert("Success");
    
    $(".list").empty();
    
    $(".list").append("name, address, postcode, phone, mobile phone<br>");
    
    page_size = result.search.wp.pageSize;
    page_hits = result.search.wp.hits;
    total_hits = result.search.wp.totalHits;
    
    myAlert("pagesize: " + page_size + ", hits: " + page_hits + ", total: " + total_hits)
    
    /* Now generate the call list */
    for (i = 0; i < page_hits; i += 1) {
        feature = result.search.wp.features[i];
        name = feature.name;
        addr = feature.addresses[0].label;
        post = feature.addresses[0].postcode + " " + feature.addresses[0].area;

        /* Not all have public phone numbers */
        if ("phoneNumbers" in feature) {
            tele = feature.phoneNumbers[0];
            //alert(feature.phoneNumbersExtended[0].type);
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
function query(text) {
    var URI, URL, address;
    address = text;
    URI = "http://map01.eniro.no/search/search.json?index=wp&profile=dk_dgs&version=4";
    URL = URI + "&pageSize=" + Pagesize + "&offset=" + Offset + "&q=" + address;
    myAlert(URL);
    $.ajax({ url : URL, dataType: "jsonp", error: ajaxerror, success: ajaxsuccess });
    //myAlert("test")
}