const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    role: { type: String, default: 'user', enum: ['admin', 'user'] },
    regno: { type: String, default: '', unique: true },
    name: { type: String, default: '' },
    branch: { type: String, default: '' },
    specialization: { type: String, default: '' },
    semester: { type: String, default: '' },
    section: { type: String, default: '' },
    batch: { type: String, default: '' },
    image: { type: String, default: '' },
    subcode: { type: [String], default: [] }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);