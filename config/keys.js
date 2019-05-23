dbPassword = 'mongodb+srv://${MONGO_USER}:'+ encodeURIComponent('${MONGO_PASSWORD}') + '${MONGO_PATH}';

module.exports = {
    mongoURI: dbPassword
};