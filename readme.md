**A RESTful API using Node.js, Express.js, and MySQL to manage school data. The system allows users to:**

Add new schools with location information

and Retrieve a list of schools sorted by proximity to a user location based on lattude and longitude inputs (used Haversine formula for distance calculation)


**Project Structure**
Clone the repo as it is to maintain the project structure, and follow next steps


**Installation**

Clone the repository:

git clone https://github.com/pranay-sa/School_ManagementAPI_Educase/

cd SCHOOLMANAGEMENTAPI

Install dependencies:

npm install

**Configure environment variables:**

Edit the .env file in the root directory with your following credentials

DB_HOST=localhost

DB_USER=your_mysql_username

DB_PASSWORD=your_mysql_password

DB_NAME=school_management

PORT=3000



**Start the server:**

node app.js

The server will run on http://localhost:3000 by default, or on the port specified in your environment variables.


Database Setup

Using MySQL Command Line or Run the below commands on MySQL workbench

Log in to MySQL:

mysql -u root -p

Create the database and table:

CREATE DATABASE school_management;

USE school_management;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Using MySQL Workbench

Open MySQL Workbench

Connect to your MySQL server

Create a new schema named school_management

**Run the SQL scripts:**

USE school_management;

CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


**API Documentation**
1. Add School

Endpoint: /addSchool
Method: POST
Description: Add a new school to the database
Request Body:
json{
  "name": "ABC School",
  "address": "123 Main Street, City",
  "latitude": 40.7128,
  "longitude": -74.0060
}

Success Response:

Code: 201 Created
Content:
json{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "ABC School",
    "address": "123 Main Street, City",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}


Error Response :

Code: 400 Bad Request
Content:
json{
  "success": false,
  "message": "All fields (name, address, latitude, longitude) are required"
}




**2. List Schools**

Endpoint: /listSchools

Method: GET

Description: Get a list of schools sorted by proximity using latitude/longitude

Query Parameters:

latitude: User's latitude (required)

longitude: User's longitude (required)


Example: /listSchools?latitude=40.7128&longitude=-74.0060

Success Response:

Code: 200 OK
Content:
json{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ABC School",
      "address": "123 Main Street, City",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "distance": 0
    },
    {
      "id": 2,
      "name": "XYZ School",
      "address": "456 Park Avenue, City",
      "latitude": 40.7500,
      "longitude": -73.9800,
      "distance": 4.23
    }
  ]
}



Error Response:

Code: 400 Bad Request
Content:
json{
  "success": false,
  "message": "Latitude and longitude parameters are required"
}




Testing with Postman

A Postman collection is included in this repository. To use it:

Import the School Management API.postman_collection.json file into Postman, and

Set up an environment variable baseUrl with value http://localhost:3000 (or your deployment URL)

Test the endpoints:

Add School: Send a POST request to {{baseUrl}}/addSchool

List Schools: Send a GET request to {{baseUrl}}/listSchools?latitude=40.7128&longitude=-74.0060

or use custom JSON inputs 
