require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const zip_codes = process.env.ZIPKEY

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/location', (req, res) => {
    const zip = req.body.zipcode;
    const country = req.body.country;
    const headers = {
        "apikey": zip_codes,
        "Accept": "application/json"
    }

    axios.get(`https://api.zipcodestack.com/v1/search?codes=${zip}&country=${country}`, {
        headers
    }).then((response) => {
        const val = Object.values(response.data.results)[0];
        console.log(val[0].longitude, val[0].latitude)
        res.status(201).json(
            {
                longitude: val[0].longitude, 
                latitude: val[0].latitude
            });
    }).catch((error) => {
        // console.log(error);
        res.status(500).send(error);
    });

})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});