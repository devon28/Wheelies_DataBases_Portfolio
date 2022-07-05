function deleteDriverLocation(drivers_has_locations_id) {
    // Put our data we want to send in a javascript object
    let data = {
        drivers_has_locations_id: drivers_has_locations_id
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-driver_location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Add the new data to the table
            deleteRow(drivers_has_locations_id);
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(drivers_has_locations_id){

    let table = document.getElementById("driver-location-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == drivers_has_locations_id)  {
            table.deleteRow(i);
            break;
       }
    }
}