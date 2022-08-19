const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  info: {
    name: String,
   
  
  },
 
});

module.exports = mongoose.model('Product', productSchema);