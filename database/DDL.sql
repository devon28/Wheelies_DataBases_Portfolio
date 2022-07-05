SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table `syndicates`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `syndicates` (
    `syndicate_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `member_count` INT,
    PRIMARY KEY (`syndicate_id`)
  );


-- -----------------------------------------------------
-- Table `drivers`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `drivers` (
    `driver_id` INT NOT NULL AUTO_INCREMENT,
    `alias` VARCHAR(255) NOT NULL,
    `birth_year` INT NOT NULL,
    `criminal_record` TINYINT(1) NOT NULL DEFAULT 0,
    `base_pay` INT NOT NULL,
    `total_job_count` INT,
    `successful_job_count` INT,
    `syndicate_id` INT,
    PRIMARY KEY (`driver_id`),
    FOREIGN KEY (`syndicate_id`) REFERENCES `syndicates`(`syndicate_id`)
    ON DELETE SET NULL
  );


-- -----------------------------------------------------
-- Table `cars`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `cars` (
    `car_id` INT NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(255) NOT NULL,
    `make` VARCHAR(255) NOT NULL,
    `model` VARCHAR(255) NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `seat_count` INT NOT NULL,
    `driver_id` INT NOT NULL,
    PRIMARY KEY (`car_id`),
    FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`driver_id`)
    ON DELETE CASCADE
  );


-- -----------------------------------------------------
-- Table `locations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `locations` (
    `location_id` INT NOT NULL AUTO_INCREMENT,
    `area` VARCHAR(255) NOT NULL UNIQUE,
    `bank_count` INT,
    `jewelry_store_count` INT,
    `museum_count` INT,
    `police_station_count` INT,
    `garage_count` INT,
    `safehouse_count` INT,
    PRIMARY KEY (`location_id`)
);


-- -----------------------------------------------------
-- Table `jobs`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `jobs` (
    `job_id` INT NOT NULL AUTO_INCREMENT,
    `job_type` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `cargo_kg` INT,
    `crew_count` INT,
    `bonus_pay` INT,
    `car_type_needed` VARCHAR(255) NOT NULL,
    `syndicate_id` INT,
    `driver_id` INT,
    PRIMARY KEY (`job_id`),
    FOREIGN KEY (`syndicate_id`) REFERENCES `syndicates`(`syndicate_id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`driver_id`)
    ON DELETE SET NULL
);


-- -----------------------------------------------------
-- Intersection Table `drivers_has_locations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `drivers_has_locations` (
    `drivers_has_locations_id` INT NOT NULL AUTO_INCREMENT,
    `driver_id` INT,
    `location_id` INT,
    FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`driver_id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`location_id`) REFERENCES `locations`(`location_id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`drivers_has_locations_id`)
);

-- -----------------------------------------------------
-- Intersection Table `syndicates_has_locations`
-- -----------------------------------------------------
CREATE OR REPLACE TABLE `syndicates_has_locations` (
    `syndicates_has_locations_id` INT NOT NULL AUTO_INCREMENT,
    `syndicate_id` INT,
    `location_id` INT,
    FOREIGN KEY (`syndicate_id`) REFERENCES `syndicates` (`syndicate_id`)
    ON DELETE CASCADE,
    FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`)
    ON DELETE CASCADE,
    PRIMARY KEY (`syndicates_has_locations_id`)
);


-- -----------------------------------------------------
-- Data for `syndicates`
-- -----------------------------------------------------
INSERT INTO `syndicates` (
    `name`, 
    `member_count`) 
VALUES
    ('The Laundry Boys', 5),
    ('West Side Stories', 9),
    ('Juggalos', 2),
    ('The Plumbers Union', 78),
    ('Davids Bad Crew', 7);


-- -----------------------------------------------------
-- Data for `drivers`
-- -----------------------------------------------------
INSERT INTO `drivers` ( 
    `alias`, 
    `birth_year`, 
    `criminal_record`, 
    `base_pay`, 
    `total_job_count`, 
    `successful_job_count`, 
    `syndicate_id`)
VALUES
    ('Kevin', 1990, 1, 2100, 4, 1, NULL),
    ('Jimmy the beanstalk', 1942, 1, 230, 54, 3, 1),
    ('The Barbarian', 1988, 1, 1000, 8, 8, NULL),
    ('Johana', 2001, 1, 700, 7, 6, NULL),
    ('Bubbles', 1983, 1, 3000, 54, 53, NULL);


-- -----------------------------------------------------
-- Data for `cars`
-- -----------------------------------------------------
INSERT INTO `cars` (
    `type`,
    `make`, 
    `model`, 
    `color`, 
    `seat_count`, 
    `driver_id`) 
VALUES
    ('sedan', 'toyota', 'prius', 'baby blue', 4, 1),
    ('sedan', 'subaru', 'crosstrek', 'smoke', 6, 3),
    ('sedan', 'subaru', 'outback', 'smoke', 6, 3),
    ('suv', 'chevy', 'roadrunner', 'blue', 6, 2),
    ('bus', 'volkswagon', 'bus', 'smoke', 6, 4);


-- -----------------------------------------------------
-- Data for `locations`
-- -----------------------------------------------------
INSERT INTO `locations` ( 
    `bank_count`, 
    `jewelry_store_count`, 
    `museum_count`, 
    `police_station_count`, 
    `garage_count`, 
    `safehouse_count`, 
    `area`) 
VALUES
    (4, 2, 1, 1, 5, 1, 'northwest'),
    (0, 2, 1, 5, 1, 0, 'police alley'),
    (5, 4, 7, 1, 0, 4, 'robbery alley'),
    (1, 1, 1, 1, 0, 1, 'lower east side'),
    (5, 4, 5, 3, 1, 2, 'central central');


-- -----------------------------------------------------
-- Data for `jobs`
-- -----------------------------------------------------
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
    ('assasination', 'available', 100, 4, 2000, 'any', 1, NULL),
    ('robbery', 'available', 300, 6, 5000, 'suv', 1, NULL),
    ('heist', 'available', 400, 4, 2000, 'suv', 5, NULL),
    ('smuggling', 'tasked', 300, 2, 5000, 'sedan', 4, 2),
    ('kidnapping', 'completed', 400, 3, 4000, 'any', 2, 3);


-- -----------------------------------------------------
-- Data for Intersection Table `drivers_has_locations`
-- -----------------------------------------------------
INSERT INTO `drivers_has_locations` (
    `driver_id`,
    `location_id`)
VALUES
    (1, 3),
    (1, 1),
    (3, 4),
    (5, 5),
    (4, 2),
    (2, 4);


-- -----------------------------------------------------
-- Data for Intersection Table `syndicates_has_locations`
-- -----------------------------------------------------
INSERT INTO `syndicates_has_locations` (
    `syndicate_id`,
    `location_id`)
VALUES
    (5, 1),
    (3, 2),
    (2, 3),
    (4, 1),
    (5, 2);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;