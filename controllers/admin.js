const { response } = require('express');
const express = require('express'),
    mongoose = require('mongoose');
const router = express.Router();
var ObjectId = require("mongodb").ObjectID

const educatorModel = mongoose.model('educators')
const courseModel = mongoose.model('courses')



// dashboard
router.get('/dashboard/:wh', (req, res) => {
    if(req.session.admin) {
        if (req.params.wh != 'courseDetails') {
            req.session.adminCourseId = ''
            req.session.admincoursecat = ''
            req.session.courseEducator = ''
        }
        if (req.session.adminCourseId)
            var active = 'Y'
        else
            var active = 'N'
        res.render('admin/dashboard', { 'active': active, 'wh': req.params.wh })    
    } else {
        res.render('OEcontroller', {'msg': 'noLogin'})
    }
})




// educators
router.get('/educators', (req, res) => {
    educatorModel.find({}, { 'educatorName': 1, 'educatorEmail': 1, 'dp': 1, 'courses': 1 }, (err, docs) => {
        if (err) console.log(err)
        else {
            for (var i = 0; i < docs.length; i++) {
                var cn = 0
                for (ct in docs[i]['courses']) {
                    for (cs in docs[i]['courses'][ct]) {
                        cn = cn + 1
                    }
                }
                docs[i]['total'] = cn
            }
            res.render('admin/educatorsList', { 'users': docs })
        }
    })
})
router.get('/setEduId/:id', (req, res) => {
    console.log(req.params.id)
    educatorModel.findOne({ '_id': req.params.id }, (err, user) => {
        if (err) console.log(err)
        else {
            console.log(user)
            res.render('admin/educatorDetails', { 'user': user })
        }
    })
})
router.get('/setEduIdforCourses/:edu', (req, res) => {
    req.session.eduIdforCourse = req.params.edu
    res.redirect('/admin/dashboard/eduCourses')
})
router.get('/releaseEduIdforCourse', (req, res) => {
    req.session.eduIdforCourse = ''
    res.redirect('/admin/dashboard/courses')
})




// blogs
router.get('/blogs', (req, res) => {
    res.send('blogs')
})


// test videos
router.get('/testVideos', (req, res) => {
    educatorModel.find({ 'isVerified': 1 }, { 'educatorEmail': 1, 'educatorName': 1, 'testVideo': 1 }, (err, docs) => {
        if (err) console.log(err)
        else { 
            res.render('admin/giveFeedback', { 'data': docs })
        }
    })
})
router.post('/saveFeedback', (req, res) => {
    console.log(req.body)
    if(req.body.final == 'y') {
        var text = 'Dear Educator<br><br>The feedback of your uploaded test video has been given by our team.<br>As per the feedback, you are now <b>eligible</b> to create courses on our portal.<br>Kindly log in to proceed further.<br><br>Thank You.<br>Team OCera EdTech'
        var newValues = { $set: { isVerified: 2, feedback: { 'audQual': req.body.audQual, 'vidQual': req.body.vidQual, 'vidEditing': req.body.vidEditing, 'ppt': req.body.ppt, 'remarks': req.body.remarks, 'final': 'y' } } };
    }
    else {
        var text = 'Dear Educator<br><br>The feedback of your uploaded test video has been given by our team.<br>As per the feedback, you are <b>not eligible</b> to proceed further.<br>You are therefore required to upload improved test video. Kindly log in to know more.<br><br>Thank You.<br>Team OCera EdTech'
        var newValues = { $set: { isVerified: 0, feedback: { 'audQual': req.body.audQual, 'vidQual': req.body.vidQual, 'vidEditing': req.body.vidEditing, 'ppt': req.body.ppt, 'remarks': req.body.remarks, 'final': 'n' } } };
    }
    educatorModel.updateOne({ 'educatorEmail': req.body.email }, newValues, (err, user) => {
        if (err) {
            res.send(err)
        } else {
            console.log(user)
            sendMail(req.body.email, 'Test Video Feedback', text, res)
            res.send('success');
        }
    })
})






// courses
router.get('/courses', (req, res) => {
    if (req.session.eduIdforCourse)
        courseModel.find({ 'educator.email': req.session.eduIdforCourse }, { "educator": 1, "courseCategory": 1, "courseUploadDate": 1, "courseTitle": 1, "courseStatus": 1, "pricing": 1 }, (err, docs) => {
            if (err) console.log(err)
            else {
                console.log(docs)
                var edu = '@' + req.session.eduIdforCourse.split("@")[0]
                res.render('admin/courses', { 'courses': docs, 'edu': edu })
            }
        })
    else {
        courseModel.find({}, { "educator": 1, "courseCategory": 1, "courseUploadDate": 1, "courseTitle": 1, "courseStatus": 1, "pricing": 1 }, (err, docs) => {
            if (err) console.log(err)
            else {
                console.log(docs)
                res.render('admin/courses', { 'courses': docs, 'edu': 'null' })
            }
        })

    }
})
router.get('/setCourseId/:cid', (req, res) => {
    console.log(req.params.cid)
    req.session.adminCourseId = ObjectId(req.params.cid)
    console.log(req.session.adminCourseId)
    courseModel.findOne({ '_id': req.session.adminCourseId }, (err, user) => {
        if (err) console.log(err)
        else {
            console.log(user)
            req.session.admincoursecat = user.courseCategory.replace(/ /g, "_")
            req.session.courseEducator = user.educator.email
            res.redirect('/admin/dashboard/courseDetails')
        }
    })
})
router.get('/courseBasicDetails', (req, res) => {
    courseModel.findOne({ '_id': req.session.adminCourseId }, { "syllabus": 0 }, (err, doc) => {
        if (err)
            console.log(err)
        else {
            console.log(doc)
            res.render('admin/courseBasicDetails', { 'course': doc })
        }
    })
})
router.get('/courseEducator', (req, res) => {
    var cat = req.session.admincoursecat.replace(/_/g, " ")
    var ctitle = 'courses.' + cat + '.' + req.session.adminCourseId + '.title'
    educatorModel.findOne({ 'educatorEmail': req.session.courseEducator }, { 'educatorName': 1, 'educatorEmail': 1, 'dp': 1, 'about': 1 }, (err, user) => {
        if (err) console.log(err)
        else {
            console.log(user)
            courseModel.findOne({ '_id': req.session.adminCourseId }, { "courseStatus": 1 }, (err, doc) => {
                if (err)
                    console.log(err)
                else {
                    console.log(doc)
                    res.render('admin/courseEducator', { 'user': user, 'status': doc['courseStatus'] })
                }
            })
        }
    })

})
router.get('/courseMaterial', (req, res) => {
    console.log(req.session.adminCourseId)
    courseModel.findOne({ '_id': req.session.adminCourseId }, (err, user) => {
        if (err)
            console.log(err)
        else {
            var coursetitle = user['courseTitle']
            var baseObj = user['syllabus']
            var syll = []
            for (week in baseObj)
                if (week.includes('week'))
                    if (baseObj[week]['status']) {
                        var x = week + '::Yes'
                        syll.push(x)
                    } else {
                        var x = week + '::No'
                        syll.push(x)
                    }
            res.render('admin/courseMaterial', { 'cid': req.session.adminCourseId, 'coursetitle': coursetitle, 'cat': req.session.admincoursecat, 'syll': syll })
        }
    })

})
router.get('/get/weekDetails/:week', (req, res) => {
    courseModel.findOne({ '_id': req.session.adminCourseId }, (err, user) => {
        baseObj = user['syllabus'][req.params.week]
        if (baseObj['title'])
            var title = baseObj['title']
        else
            var title = ''
        var time = 0
        for (var module in baseObj) {
            if (module.includes('module'))
                for (var lec in baseObj[module]) {
                    if (lec.includes('lec'))
                        time += baseObj[module][lec]['time']
                }
        }
        var hours = Math.floor(time / 60);
        var min = time - (hours * 60)
        var weekTime = ''
        if (hours == 1) {
            weekTime += '1 Hour '
        } else if (hours > 1) {
            weekTime += hours + ' Hours '
        }
        if (min == 1) {
            weekTime += min + ' Minute'
        } else if (min > 1) {
            weekTime += min + ' Minutes'
        }
        console.log(time + '=' + weekTime)
        res.json({ 'time': weekTime, 'title': title })
    })
})
router.get('/get/modules/:week', (req, res) => {
    courseModel.findOne({ '_id': req.session.adminCourseId }, (err, user) => {
        if (err)
            console.log(err)
        else {
            baseObj = user['syllabus'][req.params.week]
            res.json(baseObj)
        }
    })
})
router.get('/get/lectureDetails/:week/:module', (req, res) => {
    courseModel.findOne({ '_id': req.session.adminCourseId }, (err, user) => {
        baseObj = user['syllabus'][req.params.week][req.params.module]
        console.log(user['syllabus'][req.params.week])
        console.log(baseObj)
        res.json(baseObj)
    })
})
router.get('/get/quizDetails/:week', (req, res) => {
    courseModel.findOne({'_id': req.session.adminCourseId}, (err, doc) => {
        if(err) {
            res.json({'resp': err})
        } else {
            var quiz = doc['syllabus'][req.params.week]['quiz']
            if(quiz) {
                res.json({'resp': 'suc', 'quiz': quiz})
            } else {
                res.json({'resp': 'suc'})
            }
        }
    })
})
router.get('/get/allAdditions/:week', (req, res) => {
    courseModel.findOne({ '_id': req.session.adminCourseId }, (err, user) => {
        if (err)
            console.log(err)
        else {
            var baseObj = user['syllabus'][req.params.week]
            res.json(baseObj)
        }
    })
})
router.get('/downloadMaterial/:week/:name', (req, res) => {
    console.log('called')
    var path = __basedir + "/uploads/courseVideos/" + req.session.admincoursecat + "/" + req.session.adminCourseId + "/" + req.params.week + "/" + req.params.name;
    res.download(path)
})
router.get('/approveTheCourse', (req, res) => {
    var newK = {}
    var cat = req.session.admincoursecat.replace(/_/g, " ")
    var key = 'courses.' + cat + '.' + req.session.adminCourseId + '.courseStatus'
    newK[key] = 'Live'
    var newVal = { $set: newK }
    educatorModel.updateOne({ 'educatorEmail': req.session.courseEducator }, newVal, (err, u1) => {
        if (err) res.send('Something went wrong')
        else {
            if (u1['ok'] == 1) {
                var cnewVal = { $set: { 'courseStatus': 'Live' } }
                courseModel.updateOne({ '_id': req.session.adminCourseId }, cnewVal, (err, u) => {
                    if (err) res.send('Something went wrong')
                    else {
                        if (u['ok'] == 1) {
                            courseModel.findOne({ '_id': req.session.adminCourseId }, { 'courseTitle': 1 }, (err, tit) => {
                                if (err) res.send('Something went wrong')
                                var mssg = 'Dear Educator,<br><br>Congratulations ! Our team has reviewed your course and we are glad to inform you that your course entitled "' + tit['courseTitle'] + '" is now <i>Live</i>.<br><br>Thank You for joining with us.<br>Team OCera EdTech'
                                sendMail(req.session.email, 'Review Successfull', mssg, res)
                            })
                        }
                    }
                })
            }
        }
    })
})

const nodemailer = require('nodemailer');

function sendMail(to, subject, text, res) {
    console.log('reached')
    var trans = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'agarwalriya0101@gmail.com',
            pass: 'riya01012000'
        }
    });

    const mailOpt = {
        from: 'agarwalriya0101',
        to: to,
        // bcc: 'oceraedtech@gmail.com',
        subject: subject,
        html: text
    };

    trans.sendMail(mailOpt, function(error, info) {
        console.log('ok');
        if (error) res.send('Something went wrong')
        else {
            console.log('message sent: ' + info.response);
            res.send('success')
        }
    });
}





module.exports = router;