const path = require('path');

const locales = [
  'vi',
  'en',
];

module.exports = {
  i18n: {
    defaultLocale: 'vi',
    load: 'all',
    localeDetection: false,
    localePath: path.resolve('./public/locales'),
    locales,
    lowerCaseLng: true,
    nonExplicitWhitelist: true,
  },
  locales,
};