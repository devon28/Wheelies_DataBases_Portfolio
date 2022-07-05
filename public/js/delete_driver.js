function deleteDriver(driver_id) {
    // Put our data we want to send in a javascript object
    let data = {
        driver_id: driver_id
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-driver-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(driver_id)
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(driver_id){

    let table = document.getElementById("driver-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == driver_id) {
            table.deleteRow(i);
            deleteDropDownMenu(driver_id);
            location.reload();
            break;
       }
    }
}


function deleteDropDownMenu(driver_id){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(driver_id)){
      selectMenu[i].remove();
      location.reload();
      break;
    } 

  }
  
}