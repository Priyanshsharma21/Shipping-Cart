import Cart from '../models/cartModel.js'
import User from '../models/userModel.js'
import Product from '../models/productModel.js'
import mongoose from 'mongoose'



export const getCart = async (req, res) => {
    try {
        const {
            userId
        } = req.params


        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid UserId',
            });
        }

        const isUser = await User.findById(userId)

        if (!isUser) return res.status(404).json({
            status: false,
            message: "User Not Found!!!"
        })

        const cart = await Cart.findOne({
            userId: userId
        })

        if (!cart) return res.status(404).json({
            status: false,
            message: "Cannot found Cart !!!"
        })

        res.status(200).json({
            status: true,
            message: "Success",
            data: cart
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}







export const postCart = async (req, res) => {
    try {
        const {
            userId
        } = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid UserId',
            });
        }

        const {
            items,
        } = req.body

        const {
            productId,
            quantity
        } = items

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid productId',
            });
        }

        const isCart = await Cart.findOne({
            userId: userId
        })

        const isProduct = await Product.findById(productId)


        const isUser = await User.findById(userId)

        if (!isUser) return res.status(404).json({
            status: false,
            message: "User Not Found!!!"
        })

        if (!isProduct || isProduct.isDeleted) return res.status(404).json({
            status: false,
            message: "Product Not Found or deleted !!!"
        })


        if (!isCart) {
            const cart = new Cart({
                userId,
                items: [{ productId, quantity }],
                totalPrice : isProduct.price * quantity,
                totalItems : quantity
            })
            await cart.save()

            res.status(201).json({
                status: true,
                message: "Success",
                data: cart
            })

        } else {
            const existingItem = isCart.items.find((item) => item.productId.toString() === productId)

            if (existingItem) {
                existingItem.quantity += Number(quantity)
            } else {
                isCart.items.push({
                    productId,
                    quantity
                })
            }

            isCart.totalPrice += Number(isProduct.price) * quantity
            isCart.totalItems += Number(quantity)

            await isCart.save()

            res.status(201).json({
                status: true,
                message: "Success",
                data: isCart
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}




export const updateCart = async (req, res) => {
    try {
        const {
            userId
        } = req.params
        const {
            productId,
            cartId,
            removeProduct
        } = req.body

        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid userId',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid productId',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid cartId',
            });
        }


        const isUser = await User.findById(userId)

        if (!isUser) return res.status(404).json({
            status: false,
            message: "No User Found !!!"
        })

        const isCart = await Cart.findById(cartId)

        if (!isCart) return res.status(404).json({
            status: false,
            message: "No Cart Found !!!"
        })


        const existingItem = isCart.items.find((item) => item.productId.toString() === productId)

        if (!existingItem) {
            return res.status(404).json({
                status: false,
                message: "Product Not Found in Cart!!!"
            });
        }

        const productToReduce = await Product.findById(existingItem.productId.toString())

        if (removeProduct) {
            isCart.items = isCart.items.filter((item) => item.productId.toString() !== productId);

        } else {

            if(existingItem.quantity <= 1){
                isCart.items = isCart.items.filter((item) => item.productId.toString() !== productId)
            }else{
                if (existingItem.quantity > 0) {
                    existingItem.quantity -= 1
                    if(isCart.totalPrice > 0){
                        isCart.totalPrice -= Number(productToReduce.price)
                    }
                    if(isCart.totalItems  > 0){
                        isCart.totalItems -= 1
                    }
                }
            }
            
        }

        await isCart.save()

        return res.status(200).json({
            status: true,
            isCart
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}




export const deleteCart = async (req, res) => {
    try {
        const {
            userId
        } = req.params

        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid userId',
            });
        }

        const isUser = await User.findById(userId)

        if (!isUser) return res.status(404).json({
            status: false,
            message: "No User Found !!!"
        })

        const isCart = await Cart.findOne({
            userId: userId
        })

        if (!isCart) return res.status(404).json({
            status: false,
            message: "No Cart Found !!!"
        })

        isCart.items = [];
        isCart.totalPrice = 0
        isCart.totalItems = 0

        await isCart.save()

        res.status(200).json({
            status: true,
            message: "Success",
            data: isCart
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}