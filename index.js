const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// listen on the port
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});