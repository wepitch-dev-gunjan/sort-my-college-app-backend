const { Schema, model } = require('mongoose');

const homePageBanner = new Schema({
  url: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
}, {
  strict: false,
});

module.exports = model('HomePageBanner', homePageBanner);
