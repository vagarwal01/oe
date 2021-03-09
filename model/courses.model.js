const mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    educator: Object,
    courseTitle: String,
    courseLanguage: String,
    courseCategory: String,
    courseSubCat: String,
    courseOverview: String,
    targetAudience: String,
    courseUploadDate: Date,
    courseType: String,
    courseNature: String,
    courseObjective: String,
    courseDescription: String,
    courseCurriculum: String,
    courseIntroVideo: String,
    coursePrereq: String,
    primarilyTaught: String,
    level: String,
    intendedAudience: String,
    courseDuration: String,
    learningOutcomes: Array,
    assessmentPlan: String,
    mouDetails: Object,
    clpage: String,
    courseThumbnail: String,
    courseVideo: String,
    courseStatus: String,
    syllabus: Object,
    pricing: Object
})

mongoose.model('courses', courseSchema)