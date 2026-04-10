const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: {type:String, default: "", required: true },
    password: {type:String, default: "" },
    regno: {type:String, default: "" },
    email: { type: String, unique: true },
    googleId: String,
    image: String },
    {
        timestamps: true
});

module.exports = mongoose.model('Admin', AdminSchema);