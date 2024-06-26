const axios = require("axios");
const fs = require('fs');
const cheerio = require('cheerio');
const XLSX = require("xlsx");

const pageUrl = "https://www.amazon.com/s?k=mobile+phone&crid=3GPJE7WVLSGHK&sprefix=mobile+phone%2Caps%2C296&ref=nb_sb_noss_1";

const getPageData = async () => {
    try {
        const response = await axios.get(pageUrl);
        const data = response.data;

        // Load HTML content into Cheerio
        const $ = cheerio.load(data);

        // Arrays to store extracted data
        const titlesData = [];
        const pricesData = [];
        const ratingsData = [];
        const availabilityData = [];

        // Extracting titles
        const titles = $(".a-size-medium.a-color-base.a-text-normal");
        titles.each((index, element) => {
            const title = $(element).text().trim();
            titlesData.push(title);
        });

        // Extracting prices
        const prices = $(".a-price-whole");
        prices.each((index, element) => {
            const price = $(element).text().trim();
            pricesData.push(price);
        });

        // Extracting ratings
        const ratings = $(".a-icon-star-small .a-icon-alt");
        ratings.each((index, element) => {
            const rating = $(element).text().trim();
            ratingsData.push(rating);
        });

        // Extracting availability
        const availability = $(".a-color-price");
        availability.each((index, element) => {
            const avail = $(element).text().trim();
            availabilityData.push(avail);
        });

        // Combining data into products array
        const products = titlesData.map((title, index) => ({
            title,
            price: pricesData[index],
            rating: ratingsData[index],
            availability: availabilityData[index]
        }));

        // Write to JSON file
        fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

        // Write to Excel file
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(products);
        XLSX.utils.book_append_sheet(workbook, sheet, "Products");
        XLSX.writeFile(workbook, "products.xlsx");

        console.log("Data extraction and file creation completed successfully.");
    } catch (err) {
        console.log("Error fetching data:", err);
    }
}

getPageData();










     // const axios = require('axios');
// const fs = require('fs');
// const cheerio = require('cheerio');
// const ExcelJS = require('exceljs');

// // Read the HTML data from file (you mentioned data.txt)
// const pageData = fs.readFileSync("data.txt");

// // Load HTML data using Cheerio
// const $ = cheerio.load(pageData.toString());

// // Arrays to store extracted data
// const products = [];

// // Extract product name, price, availability, and rating (if available)
// $('.a-size-medium.a-color-base.a-text-normal').each((index, element) => {
//     const productName = $(element).text().trim();
//     const priceElement = $(element).closest('.sg-col-inner').find('.a-price-whole');
//     const price = priceElement.length > 0 ? priceElement.text().trim() : 'Price not available'; // Handling if price is not found
//     const availabilityElement = $(element).closest('.sg-col-inner').find('.a-color-price');
//     const availability = availabilityElement.length > 0 ? 'In Stock' : 'Out of Stock'; // Checking if availability element exists
//     const ratingElement = $(element).closest('.sg-col-inner').find('.a-icon-star-small');
//     const rating = ratingElement.length > 0 ? ratingElement.text().trim() : 'Rating not available'; // Handling if rating is not found

//     products.push({
//         productName,
//         price,
//         availability,
//         rating
//     });
// });

// // Save data to Excel file using ExcelJS
// const workbook = new ExcelJS.Workbook();
// const worksheet = workbook.addWorksheet('Products');

// // Define headers for Excel sheet
// worksheet.columns = [
//     { header: 'Product Name', key: 'productName' },
//     { header: 'Price', key: 'price' },
//     { header: 'Availability', key: 'availability' },
//     { header: 'Rating', key: 'rating' }
// ];

// // Add data to Excel sheet
// products.forEach(product => {
//     worksheet.addRow(product);
// });

// // Save Excel file
// workbook.xlsx.writeFile('products.xlsx')
//     .then(() => {
//         console.log('Excel file saved successfully!');
//     })
//     .catch(err => {
//         console.error('Error saving Excel file:', err);
//     });
