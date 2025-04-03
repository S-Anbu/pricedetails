const express = require('express');
const router = express.Router();
const  admin  = require('../Controllers/adminController');



router.get('/scrape-table', admin.getPriceDetails )



module.exports = router;