require('dotenv').config();
module.exports = {
    PORT: process.env.PORT,
    PLAID_ENV: 'sandbox',
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_COUNTRY_CODES: ['US'],
    PLAID_PRODUCTS: ['transactions'],
    CORS_ORIGIN: process.env.CORS_ORIGIN
}
  