import User from '../models/userModel.js'
import Order from '../models/orderModel.js'
import Cart from '../models/cartModel.js'
import mongoose from 'mongoose'




export const createOrder = async (req, res) => {
    try {
        const {
            userId
        } = req.params

        const {
            cartId
        } = req.body

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
              status: false,
              message: 'Invalid UserId',
            });
          }


          if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).json({
              status: false,
              message: 'Invalid CartId',
            });
          }


        const isUser = await User.findById(userId)
        const cart = await Cart.findById(cartId)

        if (!isUser) return res.status(404).json({
            status: false,
            message: "User Not Found!!!"
        })
        if (!cart) return res.status(404).json({
            status: false,
            message: "Cart Not Found!!!"
        })


        const order = new Order({
            userId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            totalItems: cart.totalItems,
            totalQuantity: cart.items[0]?.quantity,
        })


        await order.save();

        res.status(201).json({
            status: true,
            message: "Success",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


export const updateOrder = async (req, res) => {
    try {
        const {
            userId
        } = req.params;
        const {
            orderId,
            status
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
              status: false,
              message: 'Invalid UserId',
            });
          }


          if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
              status: false,
              message: 'Invalid orderId',
            });
          }



        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        if (order.userId.toString() !== userId) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            });
        }

        if (status === "cancelled" && !order.cancellable) {
            return res.status(400).json({
                status: false,
                message: "Order cannot be cancelled"
            });
        }


        order.status = status;
        await order.save();

        res.status(200).json({
            status: true,
            message : "Success",
            data : order
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}