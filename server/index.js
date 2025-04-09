const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 4000;
const pricRroute= require('./Routes/priceRoutes');


app.use('/api', pricRroute);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});