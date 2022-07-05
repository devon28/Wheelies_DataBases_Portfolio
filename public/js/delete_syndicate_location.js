function deleteSyndicateLocation(syndicates_has_locations_id) {
    // Put our data we want to send in a javascript object
    let data = {
      syndicates_has_locations_id: syndicates_has_locations_id
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-syndicate_location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(syndicates_has_locations_id)
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(syndicates_has_locations_id){

    let table = document.getElementById("syndicate-location-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == syndicates_has_locations_id) {
            table.deleteRow(i);
            break;
       }
    }
}