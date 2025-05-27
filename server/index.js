const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const dbConnect  = require('./db.js')
const PORT = process.env.PORT || 4000;
const pricRroute= require('./Routes/priceRoutes.js');
const login= require('./Routes/adminRoutes.js');

app.use(cors({
  //  httpOnly:true,
  // origin: "http://localhost:5173", // Your frontend URL
  origin: "https://aadhi-engineering-works.onrender.com", // Your frontend URL
  credentials: true // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect()
app.use('/api', pricRroute);
app.use('/api', login);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});