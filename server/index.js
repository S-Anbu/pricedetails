const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dotenv = require('dotenv');
dotenv.config();
const dbConnect  = require('./db.js')
const PORT = process.env.PORT || 4000;
const pricRroute= require('./Routes/priceRoutes.js');
const login= require('./Routes/adminRoutes.js');
dbConnect()

app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  credentials: true // Allow cookies
}));
app.use('/api', pricRroute);
app.use('/api', login);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});