import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {
    uploadFile
} from '../aws/index.js'
import {
    validateString,
    isValidIndianMobileNumber,
    isValidEmail,
    validatePassword,
    validatePincode,
    isValidReqBody
} from '../utils/index.js'


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


        if (!fname || !lname || !phone || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Please Enter All Required Fields"
            })
        }


        const isStringFname = validateString(fname)
        const isStringLname = validateString(lname)

        if (!isStringFname || !isStringLname) return res.status(400).json({
            status: false,
            message: "Invalid Fname or Lname"
        })


        const validPhoneNumber = isValidIndianMobileNumber(phone);
        if (!validPhoneNumber) {
            return res.status(400).json({
                status: false,
                message: 'Please enter a valid Indian phone number',
            });
        }

        // Validate email 
        const validEmail = isValidEmail(email);
        if (!validEmail) {
            return res.status(400).json({
                status: false,
                message: 'Please enter a valid email address',
            });
        }


        const validPassword = validatePassword(password);
        if (!validPassword) {
            return res.status(400).json({
                status: false,
                message: 'Password must be between 8 and 15 characters long',
            });
        }


        const validShippingPincode = validatePincode((address.shipping.pincode));
        const validBillingPincode = validatePincode((address.billing.pincode));

        if (!validShippingPincode || !validBillingPincode) {
            return res.status(400).json({
                status: false,
                message: 'Pincode must be a number',
            });
        }


        const files = req.files

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.body.profileImage = uploadedFileURL
        } else {
            return res.status(400).json({
                status: false,
                message: "Please send the file"
            })
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

        const validEmail = isValidEmail(email);
        if (!validEmail) {
            return res.status(400).json({
                status: false,
                message: 'Please enter a valid email address',
            });
        }


        const validPassword = validatePassword(password);
        if (!validPassword) {
            return res.status(400).json({
                status: false,
                message: 'Password must be between 8 and 15 characters long',
            });
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
        const {
            userId
        } = req.params

        if (!userId) res.status(400).json({
            status: false,
            message: "No userId found"
        })

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid UserId',
            });
        }

        const user = await User.findById(userId)

        if (!user) return res.status(404).json({
            status: false,
            message: "User not found !!!"
        })

        res.status(200).json({
            status: true,
            message: "Success",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}




export const updateUser = async (req, res) => {
    try {
        const {
            userId
        } = req.params
        let {
            fname,
            lname,
            phone,
            email,
            address
        } = req.body

        if (!fname || !lname || !phone || !email) {
            return res.status(400).json({
                status: false,
                message: "Please Enter All Required Fields"
            })
        }

        const isStringFname = validateString(fname)
        const isStringLname = validateString(lname)

        if (!isStringFname || !isStringLname) return res.status(400).json({
            status: false,
            message: "Invalid Fname or Lname"
        })


        const validPhoneNumber = isValidIndianMobileNumber(phone);
        if (!validPhoneNumber) {
            return res.status(400).json({
                status: false,
                message: 'Please enter a valid Indian phone number',
            });
        }

        // Validate email 
        const validEmail = isValidEmail(email);
        if (!validEmail) {
            return res.status(400).json({
                status: false,
                message: 'Please enter a valid email address',
            });
        }


        const validShippingPincode = validatePincode((address.shipping.pincode));
        const validBillingPincode = validatePincode((address.billing.pincode));

        if (!validShippingPincode || !validBillingPincode) {
            return res.status(400).json({
                status: false,
                message: 'Pincode must be a number',
            });
        }


        const files = req.files

        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            req.body.profileImage = uploadedFileURL
        } else {
            return res.status(400).json({
                status: false,
                message: "Please send the file"
            })
        }

        if (!userId) res.status(400).json({
            status: false,
            message: "No userId found"
        })

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid UserId',
            });
        }


        const user = await User.findByIdAndUpdate(userId, req.body, {
            new: true
        })

        

        if (!user) return res.status(404).json({
            status: false,
            message: "User not found !!!"
        })

        res.status(200).json({
            status: true,
            message: "Success",
            data: user
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}