const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({



    firstName : {
        type : String,
        required : true
    },
    mac :{
        type: Number,
    }
    // lastName : {
    //     type : String,
    //     required : true
    // },
    // email : {
    //     type : String,
    //     required : true
    // },
    // password : {
    //     type : String,
    //     required : true
    // },
});

UserSchema.methods.testMethod = function(){
    console.log('this is the schema method');
}

module.exports = mongoose.model('macs',UserSchema);