const mongoose = require('mongoose')

var blogSchema = new mongoose.Schema({
    btitle: String,
    authorName: String,
    authorEmail: String,
    bcontent: String,
    bimage: String,
    bdate: Date,
    comments: Object
})

mongoose.model('blogs', blogSchema)