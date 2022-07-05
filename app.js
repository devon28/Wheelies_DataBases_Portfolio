// App.js

/*
Citation for the following project:
    Date retrieved: 15 May 2022
    Adapted from: nodejs-starter-app
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Author: Dr Michael Curry - Oregon State University
*/


/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 3079;                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript



/*
    ROUTES
*/

//-----------------------------------------------------
// home
//-----------------------------------------------------
app.get('/', (req, res) => {
    res.render('index.hbs')
});

// The code for app.js is repetitive, therefore we have provided comments
// for the first entity (cars) only. All other entities follow
// a very similar design.

//------------------------------------------------------
// cars
//------------------------------------------------------
app.get('/cars', function(req, res)
{
    let query1; // Declare Query 1
    if (req.query.driver_id === undefined) // If there is no query string, we just perform a basic SELECT
    {
        query1 = "SELECT * FROM cars;";
    }
    else // If there is a query string, we assume this is a search, and return desired results
    {
        query1 = `SELECT * FROM cars WHERE driver_id LIKE "${req.query.driver_id}%"`
    }
    let query2 = "SELECT * FROM drivers;"; // Query 2 is the same in both cases
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        let cars = rows; // Save the cars
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            let drivers = rows; // Save the drivers
            // Construct an object for reference in the table
            // Use Array.map to do something with each element of an array.
            let drivermap = {}       
            drivers.map(driver => {
                let driver_id = parseInt(driver.driver_id, 10);
                drivermap[driver_id] = driver["alias"];
            })
            // Overwrite the driver ID with the alias of the driver in the cars object
            carss = cars.map(car => {
                return Object.assign(car, {driver_id: drivermap[car.driver_id]})
            })
            return res.render('cars', {data: carss, drivers: drivers});
        })
    })
});              

app.post('/add-car-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query1 = `INSERT INTO cars (type, make, model, color, seat_count, driver_id) VALUES ('${data['input-type']}', '${data['input-make']}', '${data['input-model']}', '${data['input-color']}', '${data['input-seat_count']}', '${data['input-driver_id']}')`;
    db.pool.query(query1, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM cars and
        // presents it on the screen
        else
        {
            res.redirect('/cars');
        }
    })
});

app.delete('/delete-car-ajax/', function(req,res,next){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let id = parseInt(data.car_id);
    // Create the query and run it on the database
    let deleteCar = `DELETE FROM cars WHERE car_id = ?`;
          db.pool.query(deleteCar, [id], function(error, rows, fields){
              if (error) {
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else
              {
                res.sendStatus(204);
              }
})});

app.post('/put-car-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    queryUpdateCar = `UPDATE cars SET type = '${data['input-type']}', model = '${data['input-model']}', make = '${data['input-make']}', color = '${data['input-color']}', seat_count = '${data['input-seat_count']}', driver_id = '${data['input-driver_id']}' WHERE cars.car_id = '${data['input-car_id']}'`;
    db.pool.query(queryUpdateCar, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else
        {
            res.redirect('/cars');
        }
    })
});

//--------------------------------------------------------------------------
// drivers
//---------------------------------------------------------------------------
app.get('/drivers', function(req, res)
{
    let query1;

    if (req.query.syndicate_id === undefined)
    {
        query1 = "SELECT * FROM drivers;";
    }
    else
    {
        query1 = `SELECT * FROM drivers WHERE syndicate_id LIKE "${req.query.syndicate_id}%"`
    }
    let query2 = "SELECT * FROM syndicates;";
    db.pool.query(query1, function(error, rows, fields){
        let drivers = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let syndicates = rows;      
            let syndicatemap = {}       
            syndicates.map(syndicate => {
                let syndicate_id = parseInt(syndicate.syndicate_id, 10);
                syndicatemap[syndicate_id] = syndicate["name"];
            })
            driverss = drivers.map(driver => {
                return Object.assign(driver, {syndicate_id: syndicatemap[driver.syndicate_id]})
            })
            return res.render('drivers', {data: driverss, syndicates: syndicates});
        })
    })
});              

app.post('/add-driver-form', function(req, res){
    let data = req.body;
    let syndicate = parseInt(data['input-syndicate_id']);
    if (isNaN(syndicate))
    {
        syndicate = 'NULL'
    }
    query1 = `INSERT INTO drivers (alias, birth_year, criminal_record, base_pay, total_job_count, successful_job_count, syndicate_id) VALUES ('${data['input-alias']}', '${data['input-birth_year']}', '${data['input-criminal_record']}', '${data['input-base_pay']}', '${data['input-total_job_count']}', '${data['input-successful_job_count']}', ${syndicate})`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/drivers');
        }
    })
});

app.delete('/delete-driver-ajax/', function(req,res,next){
    let data = req.body;
    let id = parseInt(data.driver_id);
    let deleteDriver = `DELETE FROM drivers WHERE driver_id = ?`;
          db.pool.query(deleteDriver, [id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                res.sendStatus(204);
              }
})});

app.post('/put-driver-form', function(req, res){
    let data = req.body;
    let syndicate = parseInt(data['input-syndicate_id']);
    if (isNaN(syndicate))
    {
        syndicate = 'NULL'
    }
    queryUpdateDriver = `UPDATE drivers SET alias = '${data['input-alias']}', birth_year = '${data['input-birth_year']}', criminal_record = '${data['input-criminal_record']}', base_pay = '${data['input-base_pay']}', total_job_count = '${data['input-total_job_count']}', successful_job_count = '${data['input-successful_job_count']}', syndicate_id = ${syndicate} WHERE driver_id = '${data['input-driver_id']}'`;
    db.pool.query(queryUpdateDriver, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/drivers');
        }
    })
});

//-----------------------------------------------------------
// syndicates
//-----------------------------------------------------------
app.get('/syndicates', function(req, res)
    {  
        let query1 = "SELECT * FROM syndicates;"; 
        db.pool.query(query1, function(error, rows, fields){    
            res.render('syndicates', {data: rows});     
        })                                                     
    });                                                         
             
app.post('/add-syndicate-form', function(req, res){
    let data = req.body;
    query1 = `INSERT INTO syndicates (name, member_count) VALUES ('${data['input-name']}', '${data['input-member_count']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/syndicates');
        }
    })
});

app.delete('/delete-syndicate-ajax/', function(req,res,next){
    let data = req.body;
    let id = parseInt(data.syndicate_id);
    let deleteSyndicate = `DELETE FROM syndicates WHERE syndicate_id = ?`;
          db.pool.query(deleteSyndicate, [id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                res.sendStatus(204);
              }
})});

app.post('/put-syndicate-form', function(req, res){
    let data = req.body;
    queryUpdateSyndicate = `UPDATE syndicates SET name = '${data['input-name']}', member_count = '${data['input-member_count']}' WHERE syndicates.syndicate_id = '${data['input-syndicate_id']}'`;
    db.pool.query(queryUpdateSyndicate, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/syndicates');
        }
    })
});

//------------------------------------------------------------------------
// syndicates has locations
//-------------------------------------------------------------------------
app.get('/syndicateshaslocations', function(req, res)
{
    let query1 = "SELECT syndicates_has_locations.syndicates_has_locations_id, syndicates.name, syndicates.syndicate_id, locations.area, locations.location_id FROM syndicates INNER JOIN syndicates_has_locations ON syndicates.syndicate_id = syndicates_has_locations.syndicate_id INNER JOIN locations on syndicates_has_locations.location_id = locations.location_id;";
    let query2 = "SELECT * FROM syndicates;";
    let query3 = "SELECT * FROM locations;";
    db.pool.query(query1, function(error, rows, fields){
        let syndicateslocations = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let syndicates = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let locations = rows;
                return res.render('syndicateshaslocations', {data: syndicateslocations, syndicates: syndicates, locations: locations});
            })
        })
})});

app.post('/add-syndicate_has_location-form', function(req, res){
        let data = req.body;
        query1 = `INSERT INTO syndicates_has_locations (syndicate_id, location_id) VALUES ('${data['input-syndicate']}', '${data['input-location']}')`;
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.redirect('/syndicateshaslocations');
            }
        })
    });
    
app.delete('/delete-syndicate_location-ajax/', function(req,res,next){
        let data = req.body;
        let id = parseInt(data.syndicates_has_locations_id);
        let deleteSyndicateHasLocation = `DELETE FROM syndicates_has_locations WHERE syndicates_has_locations_id = ?`;
              db.pool.query(deleteSyndicateHasLocation, [id], function(error, rows, fields){
                  if (error) {
                  console.log(error);
                  res.sendStatus(400);
                  }
                  else
                  {
                    res.sendStatus(204);
                  }
    })});
   
app.post('/put-syndicate-form', function(req, res){
        let data = req.body;
        queryUpdateSyndicate = `UPDATE syndicates SET name = '${data['input-name']}', member_count = '${data['input-member_count']}' WHERE syndicates.syndicate_id = '${data['input-syndicate_id']}'`;
        db.pool.query(queryUpdateSyndicate, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.redirect('/syndicates');
            }
        })
    });

//---------------------------------------------------------------------
// locations
//---------------------------------------------------------------------
app.get('/locations', function(req, res)
    {  
        let query1 = "SELECT * FROM locations;";            
        db.pool.query(query1, function(error, rows, fields){    
            res.render('locations', {data: rows});                  
        })                                                     
    });     

app.post('/add-location-form', function(req, res){
    let data = req.body;
    query1 = `INSERT INTO locations (area, bank_count, jewelry_store_count, museum_count, police_station_count, garage_count, safehouse_count) VALUES ('${data['input-area']}', '${data['input-bank_count']}', '${data['input-jewelry_store_count']}', '${data['input-museum_count']}', '${data['input-police_station_count']}', '${data['input-garage_count']}', '${data['input-safehouse_count']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/locations');
        }
    })
});

app.delete('/delete-location-ajax/', function(req,res,next){
    let data = req.body;
    let id = parseInt(data.location_id);
    let deleteLocation = `DELETE FROM locations WHERE location_id = ?`;
          db.pool.query(deleteLocation, [id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                res.sendStatus(204);
              }
})});

//---------------------------------------------------------------------
// Jobs
//---------------------------------------------------------------------
app.get('/jobs', function(req, res)
{
    let query1 = "SELECT jobs.job_id, jobs.job_type, jobs.status, jobs.cargo_kg, jobs.crew_count, jobs.bonus_pay, jobs.car_type_needed, syndicates.name, drivers.alias FROM jobs INNER JOIN syndicates on syndicates.syndicate_id = jobs.syndicate_id LEFT JOIN drivers on drivers.driver_id = jobs.driver_id ORDER BY jobs.job_id;";
    let query2 = "SELECT * FROM syndicates;";
    let query3 = "SELECT * FROM drivers;";
    db.pool.query(query1, function(error, rows, fields){ 
        let jobs = rows;
        db.pool.query(query2, function(error, rows, fields){
            let syndicates = rows;
            db.pool.query(query3, function(error, rows, fields){ 
                let drivers = rows;
                return res.render('jobs', {data: jobs, syndicates: syndicates, drivers: drivers});  
            })
        })
})});

app.post('/add-job-form', function(req, res){
    let data = req.body;
    let driver = parseInt(data['input-driver']);
    if (isNaN(driver))
    {
        driver = 'NULL'
    }
    query1 = `INSERT INTO jobs (job_type, status, cargo_kg, crew_count, bonus_pay, car_type_needed, syndicate_id, driver_id) VALUES ('${data['input-job_type']}', '${data['input-status']}', '${data['input-cargo_kg']}', '${data['input-crew_count']}', '${data['input-bonus_pay']}', '${data['input-car_type_needed']}', '${data['input-syndicate']}', ${driver})`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/jobs');
        }
    })
});

app.delete('/delete-job-ajax/', function(req,res,next){
    let data = req.body;
    let id = parseInt(data.job_id);
    let deleteDriver = `DELETE FROM jobs WHERE job_id = ?`;
          db.pool.query(deleteDriver, [id], function(error, rows, fields){
              if (error) {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                res.sendStatus(204);
              }
})});

app.post('/put-job-form', function(req, res){
    let data = req.body;
    let driver = parseInt(data['input-driver']);
    if (isNaN(driver))
    {
        driver = 'NULL'
    }
    queryUpdateDriver = `UPDATE jobs SET job_type = '${data['input-job_type']}', status = '${data['input-status']}', cargo_kg = '${data['input-cargo_kg']}', crew_count = '${data['input-crew_count']}', bonus_pay = '${data['input-bonus_pay']}', car_type_needed = '${data['input-car_type_needed']}', syndicate_id = '${data['input-syndicate']}', driver_id = ${driver} WHERE jobs.job_id = '${data['input-job_id']}'`;
    db.pool.query(queryUpdateDriver, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('/jobs');
        }
    })
});

//---------------------------------------------------------------------
// drivers has locations
//---------------------------------------------------------------------
app.get('/drivershaslocations', function(req, res)
{
    let query1 = "SELECT drivers_has_locations.drivers_has_locations_id, drivers.alias, drivers.driver_id, locations.area, locations.location_id FROM drivers INNER JOIN drivers_has_locations ON drivers.driver_id = drivers_has_locations.driver_id INNER JOIN locations on drivers_has_locations.location_id = locations.location_id;";
    let query2 = "SELECT * FROM drivers;";
    let query3 = "SELECT * FROM locations;";
    db.pool.query(query1, function(error, rows, fields){
        let driverslocations = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let drivers = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let locations = rows;
                return res.render('drivershaslocations', {data: driverslocations, drivers: drivers, locations: locations});
            })
        })
})});

app.post('/add-driver_has_location-form', function(req, res){
        let data = req.body;
        query1 = `INSERT INTO drivers_has_locations (driver_id, location_id) VALUES ('${data['input-driver']}', '${data['input-location']}')`;
        db.pool.query(query1, function(error, rows, fields){
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                res.redirect('/drivershaslocations');
            }
        })
    });
    
app.delete('/delete-driver_location-ajax/', function(req,res,next){
        let data = req.body;
        let id = parseInt(data.drivers_has_locations_id);
        let deleteDriverHasLocation = `DELETE FROM drivers_has_locations WHERE drivers_has_locations_id = ?`;
              db.pool.query(deleteDriverHasLocation, [id], function(error, rows, fields){
                  if (error) {
                  console.log(error);
                  res.sendStatus(400);
                  }
                  else
                  {
                    res.sendStatus(204);
                  }
    })});
//---------------------------------------------------------------------

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});