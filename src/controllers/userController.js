import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { uploadFile } from '../aws/index.js'
 

export const register = async (req, res) => {
    try {
        let {
            fname,
            lname,
            phone,
            email,
            password,
            address
        } = req.body

        const files = req.files

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.body.profileImage = uploadedFileURL
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const requestBody = {
            ...req.body,
            password: hashedPassword
        }

        const user = await User.create(requestBody)

        res.status(201).json({
            status: true,
            message: 'Success',
            data: user
        })


    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })

    }
}






export const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body


        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please Enter Email and Password"
            })
        }

        const user = await User.findOne({
            email: email
        })

        if (!user) return res.status(404).json({
            status: false,
            message: "No User Found with this name, please signup first"
        })

        bcrypt.compare(password, user.password, function (err, isPassword) {
            if (err || !isPassword) {
                return res.status(400).json({
                    status: false,
                    message: 'Passwords do not match'
                });
            }

            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: '3d',
            })


            res.status(200).json({
                status: true,
                data: {
                    token: token
                }
            })

        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}







export const getUserProfile = async (req, res) => {
    try {
        const {userId} = req.params

        if(!userId) res.status(400).json({status : false, message : "No userId found"})

        const user = await User.findById(userId)

        res.status(200).json({status : true, message : "Success", data : user})
    } catch (error) {
        res.status(500).json({status : false, message : error.message})
    }
}






export const updateUser = async (req, res) => {
    try {
        const {userId} = req.params
        const files = req.files

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.body.profileImage = uploadedFileURL
        }

        if(!userId) res.status(400).json({status : false, message : "No userId found"})

        const user = await User.findByIdAndUpdate(userId, req.body, {
            new : true
        })

        res.status(200).json({status : true, message : "Success", data : user})

    } catch (error) {
        res.status(500).json({status : false, message : error.message})
    }
}