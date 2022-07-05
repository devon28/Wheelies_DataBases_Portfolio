-- These are some Database Manipulation queries for group 88


-----------------------------------------
-- populate dropdowns
-----------------------------------------

-- get all location IDs and areas to populate the locations dropdown
SELECT location_id, area FROM locations;

-- get all syndicate IDs and names to populate the syndicates dropdown
SELECT syndicate_id, name FROM syndicates;

-- get all driver IDs and aliases to populate the drivers dropdown
SELECT driver_id, alias FROM drivers;

-----------------------------------------
-- inserts
-----------------------------------------
-- add a new syndicate to syndicates table
INSERT INTO `syndicates` (`name`, `member_count`) VALUES (:name_input, :member_count_input);

-- add a new driver to drivers table
INSERT INTO `drivers` ( 
    `alias`, 
    `birth_year`, 
    `criminal_record`, 
    `base_pay`, 
    `total_job_count`, 
    `succesful_job_count`, 
    `syndicate_id`)
VALUES (
    :alias_input,
    :birth_year_input, 
    :criminal_record_from_dropdown_yes_no, 
    :base_pay_input,
    :total_job_count_input, 
    :succesful_job_count_input,
    :syndicate_id_from_dropdown_input);

-- add a new car to cars table
INSERT INTO `cars` (
    `type`,
    `make`, 
    `model`, 
    `color`, 
    `seat_count`, 
    `driver_id`) 
VALUES (
    :type_input,
    :make_input,
    :model_input,
    :color_input,
    :seat_count_input,
    :driver_id_from_dropdown_input);

-- add a new location to location table
INSERT INTO `locations` ( 
    `bank_count`, 
    `jewelry_store_count`, 
    `museum_count`, 
    `police_station_count`, 
    `garage_count`, 
    `safehouse_count`, 
    `area`) 
VALUES (
    :bank_count_input, 
    :jewelry_store_count_input, 
    :museum_count_input, 
    :police_station_count_input, 
    :garage_count_input, 
    :safehouse_count_input, 
    :area_input); 

-- add a new job to jobs table
INSERT INTO `jobs` (
    `job_type`, 
    `status`, 
    `cargo_kg`, 
    `crew_count`, 
    `bonus_pay`, 
    `car_type_needed`, 
    `syndicate_id`, 
    `driver_id`) 
VALUES
    :job_type_input,  
    :status_from_dropdown_input, 
    :cargo_kg_input, 
    :crew_count_input, 
    :bonus_pay_input, 
    :car_type_needed_input, 
    :syndicate_id_from_dropdown_input, 
    driver_id_from_dropdown_input);

-- associate a driver to a location 
INSERT INTO `drivers_has_locations` (
    `driver_id`,
    `location_id`)
VALUES (
    :driver_id_from_dropdown_input, 
    :location_id_from_dropdown_input);

-- associate a syndicate to a location
INSERT INTO `syndicates_has_locations` (
    `syndicate_id`,
    `location_id`)
VALUES (
    :syndicate_id_from_dropdown_input,
    :location_id_from_dropdown_input);

-----------------------------------------
-- selects with search/filter where applicable
-----------------------------------------
-- show syndicates data
SELECT * FROM syndicates;

-- show drivers data
SELECT drivers.driver_id, alias, birth_year, criminal_record, base_pay, total_job_count, succesful_job_count, 
syndicates.name FROM drivers 
LEFT JOIN syndicates ON syndicates.syndicate_id = drivers.syndicate_id;

-- show cars data
SELECT cars.car_id, type, make, model, color, seat_count,
drivers.alias FROM cars
INNER JOIN drivers ON drivers.driver_id = cars.driver_id;

-- show locations data
SELECT * FROM locations;

-- show drivers_has_locations (intersection table) data
SELECT drivers_has_locations.drivers_has_locations_id, drivers.alias, locations.area FROM drivers_has_locations
INNER JOIN locations ON locations.location_id = drivers_has_locations.location_id
INNER JOIN drivers ON drivers.driver_id = drivers_has_locations.driver_id
ORDER BY drivers_has_locations.driver_id;

-- show syndicates_has_locations (intersection table) data
SELECT syndicates_has_locations.syndicates_has_locations_id, syndicates.name, locations.area FROM syndicates_has_locations
INNER JOIN locations ON locations.location_id = syndicates_has_locations.location_id
INNER JOIN syndicates ON syndicates.syndicate_id = syndicates_has_locations.syndicate_id
ORDER BY syndicates_has_locations.syndicate_id;

-----------------------------------------
-- select with search/filter, dynamically populated list.
-----------------------------------------
SELECT * FROM cars
WHERE driver_id = driver_id_from_dropdown_input;

-----------------------------------------
-- delete (M:M)
-----------------------------------------
-- delete a relationship in drivers_has_locations (intersction table)
DELETE FROM drivers_has_locations
WHERE driver_id = :driver_id_from_form_button_input AND location_id = :location_id_from_form_button_input;

-----------------------------------------
-- update (M:M)
-----------------------------------------
-- update an existing drivers_has_locations relationship (intersection table) 
UPDATE drivers_has_locations 
SET driver_id = :driver_id_from_dropdown_input, location_id = :location_id_from_dropdown_input
WHERE driver_id = :driver_id_from_form_button_input AND location_id = :location_id_from_form_button_input;

-----------------------------------------
-- NULLable relationship update
-----------------------------------------
UPDATE drivers SET
    alias = :alias_input,
    birth_year = :birth_year_input, 
    criminal_record = :criminal_record_from_dropdown_yes_no, 
    base_pay = :base_pay_input,
    total_job_count = :total_job_count_input, 
    succesful_job_count = :succesful_job_count_input,
    syndicate_id = :syndicate_id_from_dropdown_input
WHERE driver_id = :driver_id_from_the_update_form;


-----------------------------------------------------------------
-- usefull but not required functions (as per the project guide) 
-- to be implemented if time permits
-----------------------------------------------------------------
-- delete a relationship in syndicates_has_locations (intersction table)
DELETE FROM syndicates_has_locations
WHERE syndicate_id = :syndicate_id_from_form_button_input AND location_id = :location_id_from_form_button_input;

-- delete syndicate
DELETE FROM syndicates
WHERE syndicate_id = :syndicate_id_from_form_button_input;

-- delete driver
DELETE FROM drivers
WHERE driver_id = :driver_id_from_form_button_input;

--delete cars
DELETE FROM cars
WHERE car_id = :car_id_from_form_button_input;

-- delete location
DELETE FROM locations
WHERE location_id = :location_id_from_form_button_input;

-- delete job
DELETE FROM jobs
WHERE job_id = :job_id_from_form_button_input;

-- rest of update queries to go here.