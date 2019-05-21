dbPassword = 'mongodb+srv://process.env.DB_USER:'+ encodeURIComponent('process.env.DB_PASS') + '@cluster0-guqco.mongodb.net/login_logout?retryWrites=true';

module.exports = {
    mongoURI: dbPassword
};