function deleteSyndicate(syndicate_id) {
    // Put our data we want to send in a javascript object
    let data = {
        syndicate_id: syndicate_id
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-syndicate-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(syndicate_id)
            window.location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(syndicate_id){
    let table = document.getElementById("syndicate-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == syndicate_id) {
            table.deleteRow(i);
            deleteDropDownMenu(syndicate_id);
            break;
       }
    }
}

function deleteDropDownMenu(syndicate_id){
  let selectMenu = document.getElementById("mySelect");
  for (let i = 0; i < selectMenu.length; i++){
    if (Number(selectMenu.options[i].value) === Number(syndicate_id)){
      selectMenu[i].remove();
      break;
    } 
  }
}