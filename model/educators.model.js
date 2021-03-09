const mongoose = require('mongoose')

var educatorSchema = new mongoose.Schema({
    educatorName: String,
    educatorEmail: String,
    educatorProfile: String,
    isActivated: Boolean,
    regDate: Date,
    isVerified: Number,
    educatorPassword: String,
    organisation: String,
    qualification: String,
    experience: String,
    basicQuestions: {
        online_course: String,
        time_investment: String,
        camera_pro: String
    },
    proComp: String,
    about: String,
    dp: String,
    testVideo: String,
    feedback: Object,
    courses: Object
})

mongoose.model('educators', educatorSchema)