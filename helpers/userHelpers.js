const bcrypt = require('bcrypt')
const users = require("../models/userdb");
module.exports={
    doLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        let response = {}
        let loginStatus = false; 
        let user = await users.findOne({email:userData.email})
        if (user && user.access){
            bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                 console.log('LOGIN SUCCESS.');
                    response.user = user
                    response.status = true
                    resolve(response)
                }
                else{
                    console.log('LOGIN FAILED.');
                    resolve({status: false})
                }
            })
        }
        else {
            console.log('Login Failed.');
            resolve({status:false})
        }
    })
},

}
