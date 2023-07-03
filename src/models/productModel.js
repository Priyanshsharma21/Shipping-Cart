import mongoose from 'mongoose'
const { Schema,model } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return !isNaN(value) && isFinite(value);
      },
      message: 'Price must be a valid number'
    }
  },

  currencyId: {
    type: String,
    required: true,
    enum: ['INR']
  },

  currencyFormat: {
    type: String,
    required: true,
    enum: ['₹']
  },

  isFreeShipping: {
    type: Boolean,
    default: false
  },

  productImage: {
    type: String,
    required: true
  },

  style: {
    type: String
  },

  availableSizes: {
    type: [String],
    required: true,
    validate: {
      validator: function(value) {
        return value.length > 0
      },
      message: 'At least one size must be specified'
    },
    enum: ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']
  },

  installments: {
    type: Number
  },
  deletedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
},{timestamp : true});

const Product = model('Product', productSchema);

export default Product
