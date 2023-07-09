import mongoose from 'mongoose'


const {
    Schema,
    model
} = mongoose


const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    }, ],
    totalPrice: {
        type: Number,
        required: true,
        comment: 'Holds total price of all the items in the cart',
    },
    totalItems: {
        type: Number,
        required: true,
        comment: 'Holds total number of items in the cart',
    },
    totalQuantity: {
        type: Number,
        required: true,
        comment: 'Holds total number of quantity in the cart',
    },
    cancellable: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'cancelled'],
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

const Order = model('Order', orderSchema)

export default Order