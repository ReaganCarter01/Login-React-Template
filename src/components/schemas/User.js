const mongoose = require('mongoose');
const passPort = require("passport-local-mongoose")
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required:true,
        unique:true
    },



    email: {
        type: String,
        required:true,
        unique:true
    },



    password: {
        type: String,
        required:true
    }

});
userSchema.pre(
    'save',
    async function(next){
        const user = this;
        const hash = await bcrypt.hashSync(this.password,10);
        this.password  = hash;
        next();
    }
)
userSchema.plugin(passPort);
mongoose.model('users',userSchema);
module.exports = mongoose.model('users',userSchema);