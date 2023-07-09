import mongoose from 'mongoose'

const {
    Schema,
    model
} = mongoose

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        comment: "Holds total price of all the items in the cart"
    },
    totalItems: {
        type: Number,
        required: true,
        comment: "Holds total number of items in the cart"
    },
},{timestamp : true})


const Cart = model('Cart', cartSchema)

export default Cart