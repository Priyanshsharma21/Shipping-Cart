export const isValidIndianMobileNumber = (phone) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
}

export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}



export const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 15;
};

export const validatePincode = (pincode) => {
    const regex = /^[0-9]+$/;
    return regex.test(pincode);
  };

export const isValidReqBody = (value)=>{
    return Object.keys(value).length > 0
}


export const validateString = (input)=>{
    return /^[a-zA-Z\s]+$/.test(input)
}
