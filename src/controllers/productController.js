import Product from '../models/productModel.js'
import {
    uploadFile
} from '../aws/index.js'
import mongoose from 'mongoose'
import {
    validateString,
} from '../utils/index.js'


export const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            currencyId,
            currencyFormat,
            isFreeShipping,
            productImage,
            availableSizes,
        } = req.body

        if (!title || !description || !price || !currencyId || !currencyFormat) return res.status(400).json({
            status: false,
            message: "Please enter all the required fields"
        })


        const validSizes = ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']

        if (!Array.isArray(availableSizes) || availableSizes.length === 0 || !availableSizes.every((size) => validSizes.includes(size))
        ) {
            return res.status(400).json({
                status: false,
                message: 'Please provide at least one valid size from the available options',
            });
        }

        const files = req.files

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.body.productImage = uploadedFileURL
        }else{
            return res.status(400).json({status : false, message : "Incorrect Image"})
        }


        if (availableSizes.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'At least one size must be specified',
            });
        }

        // if(typeof(price) !== 'number'){
        //     return res.status(400).json({status : false, message : "Please enter correct number"})
        // }


        const product = await Product.create(req.body)

        res.status(201).json({
            status: true,
            message: "Success",
            data: product
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}



export const getProductQuery = async (req, res) => {
    try {
        const {
            size,
            name,
            priceGreaterThan,
            priceLessThan,
            priceSort
        } = req.query


        let filter = {
            isDeleted : false,
        }

        if (size) {
            filter.availableSizes = size
        }

        if (name) {
            filter.title = {
                $regex: name,
                $options: "i"
            }
        }

        if (priceGreaterThan || priceLessThan) {
            filter.price = {}

            if (priceGreaterThan) {
                filter.price.$gt = Number(priceGreaterThan)
            }

            if (priceLessThan) {
                filter.price.$lt = Number(priceLessThan);
            }
        }

        let sort = {};
        if (priceSort) {
            sort.price = Number(priceSort);
        }


        const products = await Product.find(filter).sort(sort);

        res.status(200).json({
            status: true,
            message: "Success",
            data: products
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}





export const getProductById = async (req, res) => {
    try {
        const {
            productId
        } = req.params

        if (!productId) return res.status(400).json({
            status: false,
            message: "Please Send ID"
        })

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if(!product) return res.status(404).json({status : false, message : "Product not found"})

        res.status(200).json({
            status: true,
            message: "Success",
            data: product
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}






export const updateProduct = async (req, res) => {
    try {
        const {
            productId
        } = req.params

        const {
            title,
            description,
            price,
            currencyId,
            currencyFormat,
            availableSizes,
        } = req.body

        if (!title || !description || !price || !currencyId || !currencyFormat) return res.status(400).json({
            status: false,
            message: "Please enter all the required fields"
        })


        const validSizes = ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'];

        if (!Array.isArray(availableSizes) || availableSizes.length === 0 || !availableSizes.every((size) => validSizes.includes(size))
        ) {
            return res.status(400).json({
                status: false,
                message: 'Please provide at least one valid size from the available options',
            });
        }

        const files = req.files

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.body.productImage = uploadedFileURL
        }else{
            return res.status(400).json({status : false, message : "Incorrect Image"})
        }

        if (!productId) return res.status(400).json({
            status: false,
            message: "Please Send ID"
        })

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid product ID"
            });
        }

        const isProduct = await Product.findById(productId)

        if (!isProduct) return res.status(404).json({
            status: false,
            message: "Product Not Found"
        })

        if (isProduct.isDeleted) {
            return res.status(400).json({
                status: false,
                message: "Product is already deleted"
            });
        }

        const product = await Product.findByIdAndUpdate(productId, req.body, {
            new: true
        });

        res.status(200).json({
            status: true,
            message: "Success",
            data: product
        })


    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}



export const deleteProduct = async (req, res) => {
    try {
        const {
            productId
        } = req.params


        if (!productId) return res.status(400).json({
            status: false,
            message: "Please Send ID"
        })

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid product ID"
            });
        }


        const isProduct = await Product.findById(productId)

        if (!isProduct) return res.status(404).json({
            status: false,
            message: "Product Not Found"
        })

        if (isProduct.isDeleted) {
            return res.status(400).json({
                status: false,
                message: "Product is already deleted"
            });
        }


        const product = await Product.findByIdAndUpdate(productId, {
            isDeleted: true,
            deletedAt: new Date
        }, {
            new: true
        })


        res.status(200).json({
            status: true,
            message: "Success",
            data: product
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}