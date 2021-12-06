const { i18n } = require('./next-i18next.config');

module.exports = {
    future: {
        webpack5: true,
    },
    env: {
        API_URL: process.env.API_URL || 'https://dev.slivepay.com/api/v1',
    },
    i18n,
}
