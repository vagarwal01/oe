const mongoose = require('mongoose')

var adminSchema = new mongoose.Schema({
    password: String,
    notifications: Object,
    slots: Object,
})

mongoose.model('admin', adminSchema)