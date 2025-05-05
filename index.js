const express = require('express');
const connection = require('./db/dbconnect');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
connection.connect((err) => {
    if (err) {
        console.log("Error connecting to database: ", err);

    } else {
        console.log("Connected to database");
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
})

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS formdata (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

connection.query(createTableSQL, (err) => {
    if (err) {
        console.log("Error creating table: ", err);
    } else {
        console.log("Table created or already exists");

    }
});

app.get('/', (req, res) => {
    connection.query('SELECT * FROM formdata', (err, results) => {
        if (err) {
            console.log("Error fetching data: ", err);
            res.status(500).send("Error fetching data");
        } else {
            res.send(results)
            // console.log("Table Data: ", results);
        }
    });
})
app.post('/submit', (req, res) => {
    const formData = req.body;
    const columns = [
        'login_process',
        'remove_pop',
        'report_url',
        'click_download_button',
        'report_download_data'
    ];
    const dbRow = {};
    columns.forEach(col => dbRow[col] = null);


    if (formData.login_process) {
        dbRow.login_process = JSON.stringify(formData.login_process);
    }
    if (formData.remove_pop) {
        dbRow.remove_pop = JSON.stringify(formData.remove_pop);
    }
    if (formData.report_url) {
        dbRow.report_url = formData.report_url;
    }
    if (formData.click_download_button) {
        dbRow.click_download_button = JSON.stringify(formData.click_download_button);
    }
    if( formData.report_download_data) {
        dbRow.report_download_data = JSON.stringify(formData.report_download_data);
    }

    const insertSQL = `INSERT INTO formdata (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`;
    const values = columns.map(col => dbRow[col]);

    connection.query(insertSQL, values, (err, results) => {
        if (err) {
            console.log("Error inserting data: ", err);
            res.status(500).json({ message: "Error inserting data" }); // <-- respond with JSON
        } else {
            console.log("Data inserted successfully");
            res.status(200).json({ message: "Form submitted successfully" }); // <-- respond with JSON
        }
    });
});


// const insertSQL = `INSERT INTO formdata (data) VALUES (?)`;
// connection.query(insertSQL, [JSON.stringify(formData)], (err, results) => {
//     if (err) {
//         console.log("Error inserting data: ", err);
//         res.status(500).send("Error inserting data");
//     } else {
//         console.log("Data inserted successfully");
//         res.status(200).send("Form submitted successfully");
//     }
// });



