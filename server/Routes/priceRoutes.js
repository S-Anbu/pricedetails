const express = require('express');
const router = express.Router();
const  peiceTable  = require('../Controllers/priceTableController');



router.get('/scrape-table', peiceTable.getPriceDetails )



module.exports = router;