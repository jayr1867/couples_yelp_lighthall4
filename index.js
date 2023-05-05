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
const fusion = process.env.FUSION

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/top-cuisine-restaurants', async (req, res) => {
    const zip = req.body.zipcode;
    const country = req.body.country;
    const cuisine = req.body.cuisine;
    var headers = {
        "apikey": zip_codes,
        "Accept": "application/json"
    }
    var lat;
    var long;

    await axios.get(`https://api.zipcodestack.com/v1/search?codes=${zip}&country=${country}`, {
        headers
    }).then((response) => {
        const val = Object.values(response.data.results)[0];
        lat = val[0].latitude;
        long = val[0].longitude;
    }).catch((error) => {
        res.status(500).send(error);
        return;
    });

    const endpoint = 'https://api.yelp.com/v3/businesses/search';

    const params = {
    term: 'restaurants',
    categories: cuisine,
    latitude: lat,
    longitude: long,
    radius: 10000, // 10 kilometers
    sort_by: 'rating',
    price: '1,2,3',
    // fields: 'name, url, price, rating, image_url, phone, transactions',
    limit: 10, // limit the number of business results to 10
    
    };

    headers = {
        accept: 'application/json',
        Authorization: `Bearer ${fusion}`,
    };


    // Make the API request
    await axios.get(endpoint, 
        { 
            params, 
            headers
        }).then((response) => {
        res.status(201).json(response.data.businesses);
        return;
    }).catch((error) => {
        // console.log(error);
        // console.log(lat, long);
        res.status(410).json({message: error.message});
        return;
    });
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});