/**
 * Created by Jose on 27/04/2016.
 */
require('dotenv').config();

const {DB_USER, DB_PASS, DB_HOST, DB_NAME} = process.env;
module.exports = {
    mongoUrl: process.env.DB,
    mongoUrl: `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
    port: 8000,
    jwt: 'authorization sign, change it if you consider this risky'
};