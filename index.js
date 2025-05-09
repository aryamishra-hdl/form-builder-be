const express = require('express');
const connection = require('./db/dbconnect');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to database: ", err);

    } else {
        console.log("Connected to database");
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
})


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
    console.log("Form Data: ", formData);
    const columns = [
        'login_process',
        'remove_pop',
        'report_url',
        'click_download_button',
        'report_download_data',
        'frequency',
        'sync_date_range',
        'status',
        'media_type',
        'client_name',
        'account_name',
        'account_id',
        'platform_id',
        'report_type',
        'segment',
        'platform'
    ];
    const dbRow = {};
    columns.forEach(col => dbRow[col] = null);
    
    ['login_process', 'remove_pop', 'click_download_button', 'report_download_data'].forEach(col => {
        if (formData && typeof formData[col] === 'object' && formData[col] !== null) {
            dbRow[col] = JSON.stringify(formData[col]);
        }
    });
    [
        'frequency', 'report_url', 'sync_date_range', 'status',
        'media_type', 'client_name', 'account_name', 'account_id',
        'platform_id', 'report_type', 'segment', 'platform'
    ].forEach(col => {
        if (formData && formData[col] !== undefined) {
            dbRow[col] = formData[col];
        }
    });
    // if (formData.frequency) dbRow.frequency = formData.frequency;
    // if (formData.report_url) dbRow.report_url = formData.report_url;
    // if (formData.sync_date_range) dbRow.sync_date_range = formData.sync_date_range;
    // if (formData.status) dbRow.status = formData.status;
    
    console.log("DB Row: ", dbRow);
    const insertSQL = `INSERT INTO formdata (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`;
    const values = columns.map(col => dbRow[col]);
    
    connection.query(insertSQL, values, (err, results) => {
        if (err) {
            console.error("Error inserting data: ", err);
            res.status(500).json({ message: "Error inserting data" });
        } else {
            console.log("Data inserted successfully");
            res.status(200).json({ message: "Form submitted successfully" });
        }
    });
}
);


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
            
            
            //create table if not exists
            
            // const createTableSQL = `
            //       CREATE TABLE IF NOT EXISTS formdata (
            //         id INT AUTO_INCREMENT PRIMARY KEY,
            //         login_process JSON,
            //         remove_pop JSON,
            //         report_url VARCHAR(255),
            //         click_download_button JSON,
            //         report_download_data JSON,
            //         frequency JSON,
            //         sync_date_range JSON,
            //         status JSON,
            //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            //       );
            // `;
            
            // connection.query(createTableSQL, (err) => {
            //     if (err) {
            //         console.log("Error creating table: ", err);
            //     } else {
            //         console.log("Table created or already exists");
            
            //     }
            // });