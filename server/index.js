const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());

// Route to scrape table data
app.get('/scrape-table', async (req, res) => {
    try {
        const  url = process.env.URL;
        const selector = 'table'
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Fetch the HTML content
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML into Cheerio
        const $ = cheerio.load(html);

        // Find all tables (or specific table if selector provided)
        const tables = [];

        $(selector).each((tableIndex, tableElement) => {
            const tableData = {
                caption: $(tableElement).find('caption').text().trim(),
                headers: [],
                rows: []
            };

            // Get headers (th cells)
            $(tableElement).find('tr').first().find('th').each((i, cell) => {
                tableData.headers.push($(cell).text().trim());
            });

            // If no th headers found, use first row as headers
            if (tableData.headers.length === 0) {
                $(tableElement).find('tr').first().find('td').each((i, cell) => {
                    tableData.headers.push($(cell).text().trim() || `Column ${i + 1}`);
                });
            }

            // Get all rows data
            $(tableElement).find('tr').each((rowIndex, rowElement) => {
                // Skip header row if we already processed th cells
                if (rowIndex === 0 && $(rowElement).find('th').length > 0) return;

                const rowData = {};
                $(rowElement).find('td').each((cellIndex, cellElement) => {
                    const header = tableData.headers[cellIndex] || `Column ${cellIndex + 1}`;
                    rowData[header] = $(cellElement).text().trim();
                });

                if (Object.keys(rowData).length > 0) {
                    tableData.rows.push(rowData);
                }
            });

            tables.push(tableData);
        });

        res.json({
            success: true,
            tablesCount: tables.length,
            tables:tables[0].rows
        });

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || 'No additional error details'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});