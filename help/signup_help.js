var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')

module.exports = {
    doSignup: (signupData) => {
        return new Promise(async (resolve, reject) => {
            if (signupData.Password==signupData.rePassword){
                delete signupData.rePassword; 
                signupData.Password = await bcrypt.hash(signupData.Password, 10)
                db.get().collection(collection.SIGNUP).insertOne(signupData).then((data) => {
                    resolve({status:true})
                })
            }
            else{
                resolve({status:false})
            }
        })
    },

    doLogin: (loginData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let customer = await db.get().collection(collection.SIGNUP).findOne({ email: loginData.email })
            if (customer) {
                bcrypt.compare(loginData.Password, customer.Password).then((status) => {
                    if (status) {
                        console.log("Login Success")
                        response.customer = customer
                        response.status = true
                        resolve(response)
                    }
                    else {
                        console.log("Login failed")
                        resolve({ status: false })
                    }

                })
            }
            else {
                console.log("No account found")
                resolve({ status: false })
            }
        })
    }
}