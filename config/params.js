/**
 * Created by Jose on 27/04/2016.
 */

module.exports = {
    mongoUrl: process.env.DB || "mongodb://admin:admin$1234@ds023078.mlab.com:23078/xltec",
    port: 8080,
    jwt: 'authorization sign, change it if you consider this risky'
};