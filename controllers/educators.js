const { response } = require('express');
const express = require('express'),
    mongoose = require('mongoose');
const router = express.Router();
var ObjectId = require("mongodb").ObjectID

const educatorModel = mongoose.model('educators')
const courseModel = mongoose.model('courses')
const adminModel = mongoose.model('admin')

//file upload handler 
const multer = require('multer');
const fs = require('fs')

// var storage = multer.memoryStorage()
// var upload = multer({ storage: storage });
// module.exports = upload;

var DPstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads/profile_photos/");
    },
    filename: (req, file, cb) => {
        var filename = req.session.email + '.' + file.originalname.split('.')[1]
        cb(null, filename);
    },

})
var uploadDP = multer({ storage: DPstorage });

module.exports = uploadDP

var TVstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads/test_videos/");
    },
    filename: (req, file, cb) => {
        var filename = req.session.email + '.' + file.originalname.split('.')[1]
        cb(null, filename);
    },

})
var uploadTV = multer({ storage: TVstorage });
module.exports = uploadTV;

var AXstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const dir = __basedir + "/uploads/courseVideos/" + req.body.coursecategory + "/" + req.session.courseId
        // if (!fs.existsSync(dir)) {
        //     fs.mkdirSync(dir, { recursive: true })
        // }
        // return cb(null, dir)
        cb(null, __basedir + "/uploads/annexures/");
    },
    filename: (req, file, cb) => {
        var filename = req.session.email + '.' + file.originalname.split('.')[1]
        cb(null, filename);
    },

})
var uploadAX = multer({ storage: AXstorage });
module.exports = uploadAX;

var CVstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('reached')
        const dir = __basedir + "/uploads/courseVideos/" + req.session.category + "/" + req.session.courseId + "/" + req.params.week
        console.log(dir)
        if (!fs.existsSync(dir)) {
            console.log('!fs')
            fs.mkdirSync(dir, { recursive: true })
        }
        console.log('i guess sp')
        return cb(null, dir)
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        console.log(req.params.week + 'hsi')
        cb(null, file.originalname);
    },
})

var CQstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('reached')
        const dir = __basedir + "/uploads/courseVideos/" + req.session.category + "/" + req.session.courseId + "/" + req.params.week + "/quiz/que" + req.params.queno
        console.log(dir)
        if (!fs.existsSync(dir)) {
            console.log('!fs')
            fs.mkdirSync(dir, { recursive: true })
        }
        console.log('i guess sp')
        return cb(null, dir)
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        console.log(req.params.week + 'hsi')
        cb(null, file.originalname);
    },
})

var CIstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = __basedir + "/uploads/courseVideos/" + req.session.category + "/" + req.session.courseId
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        return cb(null, dir)
    },
    filename: (req, file, cb) => {
        var filename = file.fieldname + '.' + file.originalname.split('.')[1]
        cb(null, filename);
    },

})
var uploadCI = multer({ storage: CIstorage });
module.exports = uploadCI;


var MOUstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = __basedir + "/uploads/courseVideos/" + req.session.category + "/" + req.session.courseId + "/signatures"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        return cb(null, dir)
    },
    filename: (req, file, cb) => {
        console.log(req.files)
        if(req.files.length == 1)
            var filename = 'user_signature.' + file.originalname.split('.')[1]
        else if(req.files.length == 2) 
            var filename = 'w1_signature.' + file.originalname.split('.')[1]
        else 
            var filename = 'w2_signature.' + file.originalname.split('.')[1]
        cb(null, filename);
    },

})
// var uploadMOU = multer({ storage: MOUstorage });
// module.exports = uploadMOU;

// EDUCATOR HOME
router.get('/', (req, res) => {
    res.render('be-an-educator')
})

// LOGIN
router.get('/social-login', (req, res) => {
    console.log('called social login')

    let email = req.user ? req.user.emails[0].value : '';
    console.log(email)
    educatorModel.findOne({ 'educatorEmail': email }, (err, user) => {
        if (err) {
            res.send(err)
        }
        if (user) {
            console.log("user found")
            console.log(user)
            req.session.email = user.educatorEmail
            req.session.name = user.educatorName
            if (user.proComp && user.proComp == 'Y')
                res.redirect('/be-an-educator/dashboard/home')
            else {
                eduDetails = { 'email': req.session.email, 'name': req.session.name, }
                res.render('profile', { data: eduDetails })
            }
            // if(user.isActivated == false) {
            //     var newVal = {$set: {isActivated: true, isVerified: 0}}
            //     educatorModel.updateOne({'educatorEmail': email}, newVal, (err, user) => {
            //         if(err) res.send(err)
            //         else {
            //             if (user.proComp && user.proComp == 'Y')
            //                 res.redirect('/be-an-educator/dashboard/home')
            //             else {
            //                 eduDetails = { 'email': req.session.email, 'name': req.session.name, }
            //                 res.render('profile', { data: eduDetails })
            //             }        
            //         }
            //     })
            // } else {
            //     if (user.proComp && user.proComp == 'Y')
            //         res.redirect('/be-an-educator/dashboard/home')
            //     else {
            //         eduDetails = { 'email': req.session.email, 'name': req.session.name, }
            //         res.render('profile', { data: eduDetails })
            //     }        
            // }
        } else {
            console.log('not registered')
            var newEducator = new educatorModel()
            console.log(req.user)
            newEducator.educatorName = req.user.displayName
            newEducator.educatorEmail = req.user.emails[0].value
            newEducator.isVerified = 0
            newEducator.isActivated = true
            newEducator.regDate = new Date()
            newEducator.save((err, doc) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    console.log(doc)
                    console.log(doc.educatorName)
                    req.session.email = doc.educatorEmail
                    req.session.name = doc.educatorName
                    console.log('setting get')
                    eduDetails = { 'email': req.session.email, 'name': req.session.name, }
                    res.render('profile', { data: eduDetails })
                }
            });
        }
    });
})

router.post('/login', uploadTV.single("tryfile"), (req, res) => {

    console.log(req.body)
    console.log(req.body.eduEmail)
    console.log(req.body.eduPwd)
    if(req.body.eduEmail == 'admin') {
        if(req.body.eduPwd == 'OEadmin@*2021') {
            req.session.admin = 'Y'
            res.send('adminSuccess')
        } else {
            res.send('Admin Password does not match')
        }
    } else {
        educatorModel.findOne({ 'educatorEmail': req.body.eduEmail }, (err, user) => {
            if (err) {
                res.send('An unexpected error occured')
            }
            if (user) {
                console.log("user found")
                if (user.educatorPassword == req.body.eduPwd) {
                    req.session.email = user.educatorEmail
                    req.session.name = user.educatorName
                    if (user.proComp && user.proComp == 'Y')
                        res.send('success')
                    else {
                        res.send('profile')
                    }
                } else {
                    res.send('Incorrect Password')
                }

                // if(!user.isActivated) {
                //     console.log('not registered')
                //     res.send('This email is not yet registered.')
                // } else if(user.isActivated == false) { 
                //     console.log('not registered')
                //     res.send('This email is not yet registered.')
                // } else {
                //     if (user.educatorPassword == req.body.eduPwd) {
                //         req.session.email = user.educatorEmail
                //         req.session.name = user.educatorName
                //         if (user.proComp && user.proComp == 'Y')
                //             res.send('success')
                //         else {
                //             res.send('profile')
                //         }
                //     } else {
                //         res.send('Incorrect Password')
                //     }
                // }
            } else {
                console.log('not registered')
                res.send('This email is not yet registered.')
            }
        });    
    }
})

// SIGNUP
router.post('/signup', uploadTV.single("tryfile"), (req, res) => {
    console.log('called signup')
    console.log(req.body)
    educatorModel.findOne({ 'educatorEmail': req.body.eduEmail }, (err, user) => {
        if (err) {
            res.send(err)
        }
        if (user) {
            res.send('This email is already registered.')    
            // if(user.isActivated == true) {
            //     console.log("user found")
            //     console.log(user)
            //     res.send('This email is already registered.')    
            // } else {
            //     var newVal = {$set: { educatorName: req.body.eduName, educatorPassword: req.body.eduPwd, regDate: new Date()}}
            //     educatorModel.updateOne({ 'educatorEmail': req.body.eduEmail }, newVal, (err, user1) => {
            //         if (err) {
            //             console.log(err)
            //             res.send(err)    
            //         } else {
            //             var key = user._id
            //             key = key.toString()
            //             var text = `Hello ${req.body.eduName},<br><br>
            //             Please click on the given link to verify your email for activating your account on OCera EdTech. The link is valid for one day only.<br><br>
            //             http://localhost:8000/be-an-educator/verifyemail/key/${key}<br><br>
            //             Thank You<br>Team OCera EdTech`
            //             sendMail(req.body.eduEmail, 'Email Verification for OCera EdTech Account', text, res, 'imm')
            //             }
            //     })
            // }
        } else {
            console.log('not registered')
            var newEducator = new educatorModel()
            newEducator.educatorName = req.body.eduName
            newEducator.educatorEmail = req.body.eduEmail
            newEducator.educatorPassword = req.body.eduPwd
            newEducator.isActivated = true
            // newEducator.isActivated = false
            newEducator.regDate = new Date()
            newEducator.save((err, doc) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    console.log(doc)
                    var key = doc._id
                    key = key.toString()
                    var text = `Hello ${req.body.eduName},<br><br>
                    Please click on the given link to verify your email for activating your account on OCera EdTech. The link is valid for one day only.<br><br>
                    http://localhost:8000/be-an-educator/verifyemail/key/${key}<br><br>
                    Thank You<br>Team OCera EdTech`
                    sendMail(req.body.eduEmail, 'Email Verification for OCera EdTech Account', text, res, 'imm')
                }
            });
        }
    });
})
router.get('/verifyemail/key/:uid', (req, res) => {
    educatorModel.findOne({'_id': ObjectId(req.params.uid)}, (err, doc) => {
        if(err) console.log(err)
        else {
            console.log(doc) 
            const oneday = 60 * 60 * 24 * 1000
            console.log((new Date() - doc.regDate) > oneday)
            if((new Date() - doc.regDate) > oneday) {
                res.render('OEcontroller', {'msg': 'This link is expired !!'})
            } else { 
                var newVal = {$set: {isActivated: true, isVerified: 0}}
                educatorModel.updateOne({'_id': ObjectId(req.params.uid)}, newVal, (err, user) => {
                    if(err) res.render('OEcontroller', {'msg': 'Something went wrong. Please try again later.'})
                    else {
                        req.session.email = doc.educatorEmail
                        req.session.name = doc.educatorName
                        res.render('OEcontroller', {'msg': 'success'})
                    }
                })
            }
        }
    })
})

router.post('/fogot-pwd', uploadTV.single("tryfile"), (req, res) => {
    console.log(req.body)
    educatorModel.findOne({ 'educatorEmail': req.body.eduFPEmail }, (err, user) => {
        if (err) {
            res.send(err)
        }
        // if (user && user.isActivated == true) {
        if (user) {
            console.log("user found")
            console.log(user)
            var newVal = { $set: { educatorPassword: req.body.eduFPPwd } }
            educatorModel.updateOne({ 'educatorEmail': req.body.eduFPEmail }, newVal, (err, user1) => {
                if (err)
                    console.log(err)
                else {
                    if (!user1 || user1['ok'] == 0) {
                        res.send('Something went wrong. Please try after some time.')
                    } else {
                        req.session.email = req.body.eduFPEmail
                        req.session.name = user.educatorName
                        res.send('success')
                    }
                }
            })
        } else {
            console.log('not registered')
            res.send('This email is not registered.')
        }
    });
})


// PROFILE
router.get('/setting-up-profile', (req, res) => {
    if(req.session.email) {
        eduDetails = { 'email': req.session.email, 'name': req.session.name }
        res.render('profile', { data: eduDetails })    
    } else {
        res.render('OEcontroller', {'msg': 'noLogin'})
    }
})
router.post('/setting-up-profile', uploadDP.single('profile_photo'), (req, res) => {
    if (req.file)
        var isDP = req.file.filename
    else
        var isDP = 'N'
    console.log(isDP)
    var newValues = { $set: { organisation: req.body.organisation, qualification: req.body.qualification, experience: req.body.experience, dp: isDP, basicQuestions: { online_course: req.body.online, time_investment: req.body.time, camera_pro: req.body.camera }, proComp: 'Y' } };
    educatorModel.updateOne({ 'educatorEmail': req.session.email }, newValues, (err, user) => {
        if (err) {
            res.send(err)
        } else {
            console.log(user)
            res.send('success')
        }
    })
})

//dashboard  
router.get('/setCourseId/:cid/:category', (req, res) => {
    console.log(req.params.cid)
    req.session.courseId = ObjectId(req.params.cid)
    console.log(req.session.courseId)
    req.session.category = req.params.category.replace(/ /g, "_")
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        if (err) console.log(err)
        else {
            if (user.mouDetails) {
                res.redirect('/be-an-educator/dashboard/courseCreation')
            } else {
                res.redirect('/be-an-educator/dashboard/signMou-newCourse')
            }
        }
    })
})
router.get('/dashboard', (req, res) => {
    res.redirect('/be-an-educator/dashboard/home')
})
router.get('/dashboard/:where', (req, res) => {
    if (!req.session.email)
        res.render('OEcontroller', {'msg': 'noLogin'})
    else {
        console.log(req.session.email)
        console.log('cid=' + req.session.courseId)
        console.log('cat=' + req.session.category)
        educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
            if (err)
                console.log(err)
            else {
                if (user.proComp && user.proComp == 'Y') {
                    if (req.session.courseId && req.params.where != 'courseCreation' && req.params.where.split("-")[1] != 'newCourse') {
                        req.session.courseId = ''
                        req.session.category = ''
                    }
                    if (req.session.courseId && req.params.where.split("-")[0] != 'signMou')
                        var active = 'T'
                    else
                        var active = 'F'
                    var isDP = user.dp
                    var testVideo = 'N'
                    var feedback = 'N'
                    if (user.testVideo)
                        testVideo = 'Y'
                    if (user.feedback && user.isVerified != 0)
                        feedback = 'Y'
                    var username = user.educatorName
                    res.render('educator/dashboard', { 'cActive': active, 'isDP': isDP, 'userName': username, 'email': req.session.email, 'tv': testVideo, 'fb': feedback, 'where': req.params.where })
                } else {
                    res.redirect('/be-an-educator/setting-up-profile')
                }    
            }
        })
    }
})
router.get('/home', (req, res) => {
    educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
        var testVideo = 'N'
        var feedback = 'N'
        if (user.testVideo)
            testVideo = 'Y'
        if (user.feedback && user.isVerified != 0)
            feedback = 'Y'
        var baseObj = user['courses']
        res.render('educator/home', { 'tv': testVideo, 'fb': feedback, 'courses': baseObj })
    })
}) 
router.get('/testVideoAndFeedback', (req, res) => {
    educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
        var testVideo = 'N'
        var feedback = 'N'
        var tv = ''
        if (user.isVerified != 0 && user.testVideo)
            testVideo = 'Y'
        if (user.feedback)
            feedback = 'Y'
        if (user.feedback && user.isVerified == 0)
            testVideo = 'A'
            tv = user.testVideo
        res.render('educator/testVideoAndFeedback', { 'tv': testVideo, 'fb': feedback, 'video': tv })
    })
})
router.get('/uploadTestVideo', (req, res) => res.render('educator/upload_test_video'))
router.get('/getFeedback', (req, res) => {
    educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
        if (err) console.log(err)
        else {
            var feedback = 'N'
            if (user.feedback)
                feedback = 'Y'
            res.render('educator/getFeedback', { 'fb': feedback })
        }
    })
})
router.get('/feedbackScoreCard', (req, res) => {
    educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, doc) => {
        if (err) console.log(err)
        else
            res.render('educator/feedbackScoreCard', { 'fb': doc['feedback'] })
    })
})
router.get('/signMOU/:type', (req, res) => res.render('educator/signMOU', { 'type': req.params.type }))
router.get('/courses', (req, res) => {
    req.session.courseId = ''
    educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
        if (err) console.log(err)
        else {
            var baseObj = user['courses']
            res.render('educator/courses', { 'courses': baseObj })
        }
    })
})
router.get('/createNewCourse', (req, res) => res.render('educator/create_new_course'))
router.get('/home_create_course', (req, res) => res.render('educator/home_create_course'))
router.get('/record_editing', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        if (err) console.log(err)
        else {
            var coursetitle = user.courseTitle
            res.render('educator/record_editing', { 'coursetitle': coursetitle })
        }
    })
})
router.get('/setupForVideoRecording/:type', (req, res) => res.render('educator/videoRecording', { 'type': req.params.type }))
router.get('/setupForAudioVisualRecording/:type', (req, res) => res.render('educator/audioVisualRecording', { 'type': req.params.type }))
router.get('/setupForVideoEditing/:type', (req, res) => res.render('educator/videoEditing', { 'type': req.params.type }))
router.get('/courseUpload', (req, res) => {
    console.log(req.session.courseId)
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        if (err)
            console.log(err)
        else {
            var coursetitle = user['courseTitle']
            var baseObj = user['syllabus']
            var syll = []
            for (week in baseObj)
                if (week.includes('week'))
                    if (baseObj[week]['status']) {
                        if (baseObj[week]['status'] == 'success') {
                            var x = week + '::Yes'
                            syll.push(x)
                        } else {
                            var x = week + '::Inc'
                            syll.push(x)
                        }
                    } else {
                        var x = week + '::No'
                        syll.push(x)
                    }
            var courseUploadDate = user['courseUploadDate']
            courseUploadDate.setDate(courseUploadDate.getDate() + 30)
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            var dt = courseUploadDate.getDate() + ' ' + months[courseUploadDate.getMonth()] + ' ' + courseUploadDate.getFullYear()
            var limit = Math.floor(baseObj['totalModules'] / 3)
            res.render('educator/courseUpload', { 'lastdate': dt, 'limit': limit, 'coursetitle': coursetitle, 'syll': syll, 'cat': req.session.category, 'id': req.session.courseId })
        }
    })
})
router.get('/courseLandingPage', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        var category = req.session.category
        var title = user['courseTitle']
        var des = user['courseDescription']
        var lang = user['courseLanguage']
        var isdoneclp = user['clpage']
        if (isdoneclp == 'Y') {
            var level = user['level']
            var prim = user['primarilyTaught']
            var cid = req.session.courseId
            var courseThumbnail = user['courseThumbnail']
            var courseVideo = user['courseVideo']
        }
        educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
            if (err)
                console.log(err)
            else {
                var name = user.educatorName
                var isDP = user.dp
                if (!user.about || user.about == '' || user.about == 'undefined')
                    var about = ''
                else
                    var about = user.about
                res.render('educator/course_landing_page', { 'isdoneclp': isdoneclp, 'category': category, 'title': title, 'des': des, 'level': level, 'courseThumbnail': courseThumbnail, 'courseVideo': courseVideo, 'prim': prim, 'lang': lang, 'cid': cid, 'name': name, 'isDP': isDP, 'about': about, 'email': req.session.email })
            }
        })
    })
})
router.get('/pricinginfo', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        if (err) console.log(err)
        else {
            var title = user['courseTitle']
            var type = ''
            var amount = ''
            if (user['pricing']) {
                var type = user['pricing']['type']
                var amount = user['pricing']['amount']
            }
            educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, data) => {
                if (err) console.log(err)
                else {
                    var status = ''
                    if (data['courses'][req.session.category][req.session.courseId]['courseStatus']) {
                        status = data['courses'][req.session.category][req.session.courseId]['courseStatus']
                    }
                    res.render('educator/pricing', { 'title': title, 'type': type, 'amount': amount, 'status': status })
                }
            })
        }
    })
})
router.get('/correspondence', (req, res) => res.render('educator/correspondence'))
router.get('/accomplishments', (req, res) => res.render('educator/accomplishments'))





// Course Provider & Educator Agreement
router.get('/download/annexure-1', (req, res) => {
    console.log('called')
    var path = __basedir + "/uploads/Annexure-1.xlsx";
    res.download(path)
})
router.get('/download/course-annexure-1/:cat/:cid', (req, res) => {
    console.log('called')
    console.log(req.params.cat)
    if(req.params.cat == 'ses' && req.params.cid == 'ses') {
        var cat = req.session.category
        var cid = req.session.courseId
    } else {
        var cat = req.params.cat.replace(/ /g, "_")
        var cid = req.params.cid
    }
    var path = __basedir + "/uploads/courseVideos/"+cat+"/"+cid+"/course-annexure-1.xlsx";
    res.download(path)
})
router.get('/download/testvideo/:video', (req, res) => {
    console.log('called')
    var ext = '.' + req.params.video.substr(req.params.video.lastIndexOf('.') + 1)
    var path = __basedir + "/uploads/test_videos/" + req.session.email + ext;
    res.download(path, 'uploadedTestVideo'+ext)
})
router.get('/download/mou', (req, res) => {
    console.log('called')
    var path = __basedir + "/uploads/Course Provider & Educator Agreement.pdf";
    res.download(path)
})
router.get('/downloadMaterial/:week/:name', (req, res) => {
    console.log('called')
    var path = __basedir + "/uploads/courseVideos/" + req.session.category + "/" + req.session.courseId + "/" + req.params.week + "/" + req.params.name;
    res.download(path)
})

router.post('/upload/testDemoVideo', uploadTV.single("test_video"), (req, res) => {
    console.log(req.session.email)
    console.log(req.file)
    var newValues = { $set: { testVideo: req.file.originalname, isVerified: 1 }, $unset: {feedback: ''}};
    educatorModel.updateOne({ 'educatorEmail': req.session.email }, newValues, (err, user) => {
        if (err) {
            res.send(err)
        } else {
            educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
                if (err) res.send(err)
                else {
                    if (user == null || user['ok'] == 0)
                        res.send('Error while uploading ! Make sure you are logged in.')
                    else
                        res.send('success')
                }
            });
        }
    })
})
const nodemailer = require('nodemailer');
router.post('/sendFeedbackQuery', (req, res) => {
    var trans = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'agarwalriya0101@gmail.com',
            pass: 'riya01012000'
        }
    });

    const mailOpt = {
        from: req.session.email,
        to: 'agarwalriya0101@gmail.com',
        // bcc: 'oceraedtech@gmail.com',
        subject: 'Test Video Feedback Query',
        html: '<p>'+req.body.query+'</p>'
    };

    trans.sendMail(mailOpt, function(error, info) {
        console.log('ok');
        if (error) res.send('Something went wrong')
        else {
            console.log('message sent: ' + info.response);
            res.send('success')
        }
    });
})

router.get('/deletecourse/:cat/:cid',(req,res) => {
    courseModel.deleteOne({'_id': req.session.cid}, (err, obj) => {
        if(err)
            res.send(err)
        else {
            var del = {}
            var delkey = 'courses.' + req.params.cat + '.' + req.params.cid
            del[delkey] = ""
            var newValues = {
                $unset: del,
            }
            educatorModel.updateOne({ 'educatorEmail': req.session.email }, newValues, (err, user) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    console.log(user)
                    if (user['ok'] == 1) {
                        res.send('success')
                    } else {
                        res.send('Something went wrong. Please try again later.')
                    }
                }
            });
        }
    })
})

var xlsxFile = require('read-excel-file/node');
router.post('/upload/annexure', uploadAX.single("annexure"), (req, res) => {
    if (!req.session.email) {
        res.send('Make sure you are logged in.')
    } else {
        var ccategory = req.body.coursecategory;
        if(req.body.coursetitle) {
            if(req.body.coursetitle == 'Other')
                var ctitle = req.body.otherCT
            else 
                var ctitle = req.body.coursetitle
        } else {
            var ctitle = req.body.otherCT
        }
        var subcat = req.body.coursesubcat == 'Other' ? req.body.otherCSC : req.body.coursesubcat

        var newCourse = new courseModel()
        newCourse.educator = { 'name': req.session.name, 'email': req.session.email }
        newCourse.courseLanguage = req.body.courselanguage
        newCourse.courseCategory = ccategory
        newCourse.courseSubCat = subcat
        newCourse.courseTitle = ctitle
        var path = __basedir + "/uploads/annexures/" + req.file.filename;

        var totalW = 0
        var totalM = 0
        xlsxFile(path).then((rows) => {
            newCourse.save((err, doc) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    var cat = ccategory.replace(/ /g, "_")
                    var oldpath = __basedir + '/uploads/annexures/'+req.session.email+'.xlsx'
                    var newpath = __basedir + '/uploads/courseVideos/'+cat+'/'+ObjectId(doc._id)
                    if (!fs.existsSync(newpath)) {
                        console.log('!fs')
                        fs.mkdirSync(newpath, { recursive: true })
                    }
                    var newpath2 = newpath +'/course-annexure-1.xlsx'
                    try {
                        fs.rename(oldpath, newpath2, (err) => {
                            if(err) {
                                console.log(err)
                                courseModel.deleteOne({'_id': ObjectId(doc._id)}, (err2) => {
                                    if(err2)
                                        res.send(err2)
                                    else
                                        res.send(err)
                                })
                            } else { 
                                req.session.courseId = ObjectId(doc._id)
                                req.session.category = ccategory.replace(/ /g, "_")
                                var i = 27
                                var weeks = {}
                                while (i < rows.length) {
                                    var excelread = true
                                    if (rows[i][1].toLowerCase().includes('week')) {
                                        console.log('new week' + rows[i][1])
                                        totalW = totalW + 1
                                        var week = rows[i][1].toLowerCase()
                                        weeks[week] = {}
                                        weeks[week]['learningoutcome'] = rows[i + 1][2]
                                        i = i + 3
                                        while (!rows[i][1].toLowerCase().includes('week')) {
                                            if (rows[i][1].toLowerCase().includes('module')) {
                                                totalM = totalM + 1
                                                console.log('module started')
                                                var module = rows[i][1].toLowerCase()
                                                weeks[week][module] = {}
                                                weeks[week][module]['title'] = rows[i][3]
                                                i++
                                                var j = 0
                                                while (!rows[i][1].toString().toLowerCase().includes('module') && !rows[i][1].toString().toLowerCase().includes('week')) {
                                                    if (rows[i][3] != null) {
                                                        j++
                                                        weeks[week][module]['lec' + j] = { 'sno': rows[i][1], 'time': rows[i][2], 'title': rows[i][3], 'lecDelivery': rows[i][4], 'activity': rows[i][5] }
                                                    }
                                                    i++
                                                    if (i == rows.length) {
                                                        break
                                                    }
                                                }
                                                if(j==0) {
                                                    console.log(module + ' deleted')
                                                    delete weeks[week][module]
                                                    totalM--
                                                    console.log(weeks[week])
                                                }
                                            }
                                            if (i == rows.length) {
                                                break
                                            }
                                        }
                                        console.log(Object.keys(weeks[week]).length)
                                        if(Object.keys(weeks[week]).length == 1) {
                                            console.log(week + ' empty')
                                            delete weeks[week]
                                            totalW--
                                            excelread = false
                                            break
                                        }
                                    }
                                    if(!excelread) {
                                        console.log('read finish')
                                        break
                                    }
                                    if (i == rows.length) {
                                        break
                                    }
                                }
                                weeks['totalWeeks'] = totalW
                                weeks['totalModules'] = totalM
                                console.log(weeks)
                                var newValues = {
                                    $set: { courseOverview: rows[1][2], targetAudience: rows[2][2], courseType: rows[3][2], courseNature: rows[4][2], courseObjective: rows[5][2], courseDescription: rows[6][2], courseCurriculum: rows[7][2], courseIntroVideo: rows[8][2], coursePrereq: rows[9][2], intendedAudience: rows[10][2], courseDuration: rows[11][2], learningOutcomes: [rows[12][2], rows[13][2], rows[14][2], rows[15][2], rows[16][2], rows[17][2], rows[18][2]], assessmentPlan: rows[19][2], courseUploadDate: new Date(), syllabus: weeks }
                                }
                                courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                                    if (err) {
                                        console.log(err)
                                        res.send(err)
                                    } else {
                                        console.log(user)
                                        var courses = {}
                                        var courseKey = 'courses.' + req.session.category + '.' + req.session.courseId + '.title'
                                        courses[courseKey] = ctitle
                                        var newVal = { $set: courses }
                                        educatorModel.updateOne({ 'educatorEmail': req.session.email }, newVal, (err, user) => {
                                            if (err) {
                                                console.log(err)
                                                res.send(err)
                                            } else {
                                                console.log(user)
                                                if (user == null || user['ok'] == 0) {
                                                    res.send('Error while uploading !')
                                                } else {
                                                    res.send('success')
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })    
                    } catch (error) {
                        console.log(error)
                        courseModel.deleteOne({'_id': ObjectId(doc._id)}, (err2) => {
                            if(err2)
                                res.send(err2)
                            else
                                res.send(error)
                        })
                    }
                }
            });
        });
    }
})

router.get('/get/weekDetails/:week', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        // console.log(Object.keys(user['syllabus'][req.params.week]).length);
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
router.post('/save/weekTitle/:week', (req, res) => {
    console.log(req.body)
    var wt = {}
    var wtKey = "syllabus." + req.params.week + ".title"
    wt[wtKey] = req.body.weekTitle
    var newValues = {
        $set: wt
    }
    courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
        if (err)
            console.log(err)
        else {
            console.log(user)
            if (user['ok'] == 1) {
                res.redirect('/be-an-educator/totaladdns/'+req.params.week)
            } else {
                res.send('err')
            }
        }
    })
})
router.get('/get/moduleDetails/:week/:module', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        // console.log(Object.keys(user['syllabus'][req.params.week]).length);
        baseObj = user['syllabus'][req.params.week]
        var LO = baseObj['learningoutcome']
        var mtitle = baseObj[req.params.module]['title']
        console.log(LO + '=' + mtitle)
        res.json({ 'LO': LO, 'title': mtitle })
    })

})
router.post('/save/moduleTitle/:week/:module', (req, res) => {
    var md = {}
    var mdKey = "syllabus." + req.params.week + "." + req.params.module + ".title"
    md[mdKey] = req.body.moduleTitle
    var newValues = {
        $set: md
    }
    courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
        if (err)
            console.log(err)
        else {
            console.log(user)
            if (user['ok'] == 1) {
                res.send('success')
            } else {
                res.send('err')
            }
        }
    })

})
router.get('/totaladdns/:week', (req, res) => {
    courseModel.findOne({'_id': req.session.courseId}, (err, doc) => {
        if(err) {
            res.json({'status': err})
        } else {
            var assn = doc['syllabus'][req.params.week]['Assntotaltime'] ? doc['syllabus'][req.params.week]['Assntotaltime'] : 0
            var co = doc['syllabus'][req.params.week]['COtotaltime'] ? doc['syllabus'][req.params.week]['COtotaltime'] : 0
            res.json({'status': 'success', 'assn': assn, 'co': co})
        }
    })
})
router.get('/get/lectureDetails/:week/:module', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        baseObj = user['syllabus'][req.params.week][req.params.module]
        console.log(user['syllabus'][req.params.week])
        console.log(baseObj)
        res.json(baseObj)
            // res.render('educator/courseUpload', { 'cat': category, 'coursetitle': coursetitle })
    })
})
router.post('/upload/courseVideo/:week/:module/:lec', (req, res) => {
    console.log('called uploading')
    console.log(req.params.week + '_' + req.params.module + '_' + req.params.lec);
    var uploadCV = multer({ storage: CVstorage }).single('course_video_' + req.params.week + '_' + req.params.module + '_' + req.params.lec)
    console.log('called uploading...')
    console.log(req.body)
    console.log(req.file)
    console.log(req.files)
    console.log('hi')
    uploadCV(req, res, err => {
        console.log('hi')
        console.log(req.file)
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log('uploaded')
            var week = req.params.week.match(/\d+/)
            var module = req.params.module.match(/\d+/)
            var video = req.params.lec
            var baseDest = __basedir + '/uploads/courseVideos/' + req.session.category + '/' + req.session.courseId + '/' + req.params.week + '/'
            var oldname = baseDest + req.file.originalname
            var vidFileName = 'w' + week + 'm' + module + 'lec' + video + '.' + req.file.originalname.split('.')[1]
            var newname = baseDest + vidFileName

            fs.rename(oldname, newname, (err) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    var vid = {}
                    var vidNO = 'lec' + video
                    var vidKey = 'syllabus.' + req.params.week + '.' + req.params.module + '.' + vidNO + '.videoFile'
                    vid[vidKey] = { 'filename': vidFileName, 'original': req.file.originalname }
                    var newValues = { $set: vid };
                    courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                        if (err) {
                            console.log(err)
                            res.send(err)
                        } else {
                            if (user == null || user['ok'] == 0)
                                res.send('Error while uploading the video.')
                            else
                                res.send('success==' + req.file.originalname)
                        }
                    })
                }
            })
        }
    })
})
router.post('/save/COurl/:week/:module', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, doc) => {
        if (err) res.send(err)
        else {
            if (doc['syllabus'][req.params.week]['COtotaltime'])
                var cotime = parseInt(doc['syllabus'][req.params.week]['COtotaltime'])
            else
                var cotime = 0
            var newTime = cotime + parseInt(req.body.COtime)
            var md = {}
            var mdKey = "syllabus." + req.params.week + "." + req.params.module + ".resources.url." + req.body.COtitle
            md[mdKey] = { 'time': req.body.COtime, 'link': req.body.COurl }
            var cokey = "syllabus." + req.params.week + ".COtotaltime"
            md[cokey] = newTime
            var newValues = {
                $set: md
            }
            courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    console.log(user)
                    if (user['ok'] == 1) {
                        res.redirect('/be-an-educator/save/WeekStatus/' + req.params.week + '/co')
                    } else {
                        res.send('Error while saving')
                    }
                }
            })
        }
    })
})
router.post('/upload/COdlfile/:week/:module', (req, res) => {
    var uploadCV = multer({ storage: CVstorage }).single("COdlfile_" + req.params.week + "_" + req.params.module)
    uploadCV(req, res, err => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            var baseDest = __basedir + '/uploads/courseVideos/' + req.session.category + '/' + req.session.courseId + '/' + req.params.week + '/'
            var oldname = baseDest + req.file.originalname
            var str = req.body.COtitle
            var matches = str.match(/\b(\w)/g);
            var acronym = matches.join('');
            var dfFileName = 'File_' + acronym + '_' + req.file.originalname
            var newname = baseDest + dfFileName

            fs.rename(oldname, newname, (err) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    courseModel.findOne({ '_id': req.session.courseId }, (err, doc) => {
                        if (err) res.send(err)
                        else {
                            if (doc['syllabus'][req.params.week]['COtotaltime'])
                                var cotime = parseInt(doc['syllabus'][req.params.week]['COtotaltime'])
                            else
                                var cotime = 0
                            var newTime = cotime + parseInt(req.body.COtime)
                            var df = {}
                            var dfKey = 'syllabus.' + req.params.week + '.' + req.params.module + '.resources.downloadableFiles.' + req.body.COtitle
                            df[dfKey] = { 'time': req.body.COtime, 'locationName': dfFileName, 'originalName': req.file.originalname }
                            var cokey = "syllabus." + req.params.week + ".COtotaltime"
                            df[cokey] = newTime
                            var newValues = { $set: df };
                            courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                                if (err) {
                                    console.log(err)
                                    res.send(err)
                                } else {
                                    console.log(user)
                                    if (user == null || user['ok'] == 0) {
                                        res.send('Error while uploading')
                                    } else {
                                        res.redirect('/be-an-educator/save/WeekStatus/' + req.params.week + '/co')
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
router.post('/upload/COscfile/:week/:module', (req, res) => {
    var uploadCV = multer({ storage: CVstorage }).single("COscfile_" + req.params.week + "_" + req.params.module)
    uploadCV(req, res, err => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            var baseDest = __basedir + '/uploads/courseVideos/' + req.session.category + '/' + req.session.courseId + '/' + req.params.week + '/'
            var oldname = baseDest + req.file.originalname
            var str = req.body.COtitle
            var matches = str.match(/\b(\w)/g);
            var acronym = matches.join('');
            var scFileName = 'SC_' + acronym + '_' + req.file.originalname
            var newname = baseDest + scFileName

            fs.rename(oldname, newname, (err) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    courseModel.findOne({ '_id': req.session.courseId }, (err, doc) => {
                        if (err) res.send(err)
                        else {
                            if (doc['syllabus'][req.params.week]['COtotaltime'])
                                var cotime = parseInt(doc['syllabus'][req.params.week]['COtotaltime'])
                            else
                                var cotime = 0
                            var newTime = cotime + parseInt(req.body.COtime)
                            var sc = {}
                            var scKey = 'syllabus.' + req.params.week + '.' + req.params.module + '.resources.sourceCodes.' + req.body.COtitle
                            sc[scKey] = { 'time': req.body.COtime, 'locationName': scFileName, 'originalName': req.file.originalname }
                            var cokey = "syllabus." + req.params.week + ".COtotaltime"
                            sc[cokey] = newTime
                            var newValues = { $set: sc };
                            console.log(sc)
                            courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                                if (err) {
                                    console.log(err)
                                    res.send(err)
                                } else {
                                    console.log(user)
                                    if (!user || user['ok'] == 0) {
                                        res.send('Error while uploading')
                                    } else {
                                        res.redirect('/be-an-educator/save/WeekStatus/' + req.params.week + '/co')
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
router.post('/upload/assignment/:week/:module', (req, res) => {
    var uploadCV = multer({ storage: CVstorage }).single("assignment_file_" + req.params.week + "_" + req.params.module)
    uploadCV(req, res, err => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            var baseDest = __basedir + '/uploads/courseVideos/' + req.session.category + '/' + req.session.courseId + '/' + req.params.week + '/'
            var oldname = baseDest + req.file.originalname
            var str = req.body.aboutAssn
            var matches = str.match(/\b(\w)/g);
            var acronym = matches.join('');
            var assnFileName = 'Assn_' + acronym + '_' + req.file.originalname
            var newname = baseDest + assnFileName

            fs.rename(oldname, newname, (err) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    courseModel.findOne({ '_id': req.session.courseId }, (err, doc) => {
                        if (err) res.send(err)
                        else {
                            if (doc['syllabus'][req.params.week]['Assntotaltime'])
                                var cotime = parseInt(doc['syllabus'][req.params.week]['Assntotaltime'])
                            else
                                var cotime = 0
                            var newTime = cotime + parseInt(req.body.timeAssn)
                            var assn = {}
                            var assnKey = 'syllabus.' + req.params.week + '.' + req.params.module + '.assignments.' + req.body.aboutAssn
                            assn[assnKey] = { 'time': req.body.timeAssn, 'locationName': assnFileName, 'originalName': req.file.originalname }
                            var atkey = "syllabus." + req.params.week + ".Assntotaltime"
                            assn[atkey] = newTime
                            var newValues = { $set: assn };
                            console.log(assn)
                            courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                                if (err) {
                                    console.log(err)
                                    res.send(err)
                                } else {
                                    console.log(user)
                                    if (!user || user['ok'] == 0) {
                                        console.log('not user')
                                        res.send('Error while uploading')
                                    } else {
                                        res.redirect('/be-an-educator/save/WeekStatus/' + req.params.week + '/assn')
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
router.post('/upload/assignment/:week', (req, res) => {
    var uploadCV = multer({ storage: CVstorage }).single("assignment_file_" + req.params.week)
    uploadCV(req, res, err => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            var baseDest = __basedir + '/uploads/courseVideos/' + req.session.category + '/' + req.session.courseId + '/' + req.params.week + '/'
            var oldname = baseDest + req.file.originalname
            var str = req.body.aboutWAssn
            var matches = str.match(/\b(\w)/g);
            var acronym = matches.join('');
            var assnFileName = 'WeekAssn_' + acronym + '_' + req.file.originalname
            var newname = baseDest + assnFileName

            fs.rename(oldname, newname, (err) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    courseModel.findOne({ '_id': req.session.courseId }, (err, doc) => {
                        if (err) res.send(err)
                        else {
                            if (doc['syllabus'][req.params.week]['Assntotaltime'])
                                var cotime = parseInt(doc['syllabus'][req.params.week]['Assntotaltime'])
                            else
                                var cotime = 0

                            var newTime = cotime + parseInt(req.body.timeWAssn)
                            var assn = {}
                            var assnKey = 'syllabus.' + req.params.week + '.assignments.' + req.body.aboutWAssn
                            assn[assnKey] = { 'time': req.body.timeWAssn, 'locationName': assnFileName, 'originalName': req.file.originalname }

                            var atkey = "syllabus." + req.params.week + ".Assntotaltime"
                            assn[atkey] = newTime

                            var newValues = { $set: assn };
                            courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                                if (err) {
                                    console.log(err)
                                    res.send(err)
                                } else {
                                    if (user == null || user['ok'] == 0) {
                                        console.log('not user')
                                        res.send('Error while uploading')
                                    } else {
                                        res.redirect('/be-an-educator/save/WeekStatus/' + req.params.week + '/assn')
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
router.get('/quiz', (req, res) => {
    courseModel.findOne({'_id': req.session.courseId}, (err, doc) => {
        var baseObj = doc['syllabus']['week-1']['quiz']
        console.log(baseObj)
    })
})
router.get('/get/quizDetails/:week', (req, res) =>{
    courseModel.findOne({'_id': req.session.courseId}, (err, doc) => {
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
router.post('/save/quizformQue/:week/:queno/:options', (req, res) => {
    console.log(req.params.options)
    var uploadCQ = multer({ storage: CQstorage }).array("quizFiles_" + req.params.week, parseInt(req.params.options))
    uploadCQ(req, res, err => {
        console.log('comm')
        if (err) {
            console.log(err)
        } else {
            console.log(req.files)
            console.log(req.body)
            var quiz = {} 
            var quizKey = 'syllabus.' + req.params.week + '.quiz.Question-' + req.body.queno
            quiz[quizKey] = {}
            quiz[quizKey]['question'] = JSON.parse(req.body.que)
            quiz[quizKey]['answerType'] = req.body.answerType
            quiz[quizKey]['explanation'] = req.body.explanation
            // quiz[quizKey]['lecture'] = req.body.lecture
            quiz[quizKey]['totalOptions'] = req.body.options
            quiz[quizKey]['correct'] = req.body.correct
            if(req.body.answerType != 'shortAnswer') {
                for(var i=1;i<=req.body.options; i++) {
                    quiz[quizKey]['opt'+i] = JSON.parse(req.body['opt'+i])
                }
            }
            if(req.body.title) {
                var quizTKey = 'syllabus.' + req.params.week + '.quiz.title'
                quiz[quizTKey] = req.body.title
            }
            if(req.body.totalq) {
                var quizNKey = 'syllabus.' + req.params.week + '.quiz.total'
                quiz[quizNKey] = parseInt(req.body.totalq)    
            }

            var newValues = { $set: quiz };
            console.log(quiz)
            courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                if (err) {
                    console.log(err)
                    res.send(err)
                } else {
                    if (user == null || user['ok'] == 0) {
                        console.log('not user')
                        res.send('Error while saving')
                    } else {
                        res.send('success')
                    }
                }
            })
        }
    })
})
router.get('/get/allAdditions/:week', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        if (err)
            console.log(err)
        else {
            var baseObj = user['syllabus'][req.params.week]
            res.json(baseObj)
        }
    })
})
router.post('/delete/additional/:week', (req, res) => {
    console.log(req.body)
    console.log(req.body.type)
    if(req.body.type == 'file') {
        var path = __basedir + "/uploads/courseVideos/" + req.session.category + "/" + req.session.courseId + "/" + req.params.week + "/" + req.body.filename
        fs.unlink(path, (err) => {
            if (err) console.log(err)
            else {
                console.log('del')
            }
        });
    }
    var pathtodel = req.body.path.replace(/::/g, '.')
    console.log(pathtodel)
    var md = {}
    var mdKey = "syllabus." + pathtodel
    md[mdKey] = ""
    if(req.body.addnType == 'assn') {
        var tm = {}
        var tmkey = "syllabus." + req.params.week + ".Assntotaltime"
        tm[tmkey] = - parseInt(req.body.time)
    } else {
        var tm = {}
        var tmkey = "syllabus." + req.params.week + ".COtotaltime"
        tm[tmkey] = - parseInt(req.body.time)
    }
    var newValues = {
        $unset: md,
        $inc: tm
    }
    courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
        if (err) {
            console.log(err)
            res.json({'status': 'error', 'error': err})
        } else {
            console.log(user)
            if (user['ok'] == 1) {
                res.redirect('/be-an-educator/update/WeekStatus/' + req.params.week + '/' + req.body.addnType)
            } else {
                res.json({'status': 'error', 'error': 'Something went wrong. Please try again later.'})
            }
        }
    })
})
router.get('/update/WeekStatus/:week/:type', (req, res) => {
    console.log('reached')
    courseModel.findOne({'_id': req.session.courseId}, (err, doc) => {
        if(err) {
            console.log(err)
            res.json({'status': 'error', 'error': err})
        } else {
            var baseObj = doc['syllabus'][req.params.week]
            var assn = false
            var co = false
            var flag = 0
            if(req.params.type == 'assn') {
                if(baseObj['Assntotaltime'] && baseObj['Assntotaltime'] >= 20) {
                    assn = true
                } else {
                    if(baseObj['Assntotaltime'])
                        var leftTime = 20 - baseObj['Assntotaltime']
                    else
                    var leftTime = 20
                }                
                if(assn)
                    res.json({'status': 'success', 'time': 'n'})
                else 
                    flag = 1
            } else {
                if(baseObj['COtotaltime'] && baseObj['COtotaltime'] >= 90) {
                    co = true
                } else {
                    if(baseObj['COtotaltime'])
                        var leftTime = 90 - baseObj['COtotaltime']
                    else
                        var leftTime = 90
                }    
                if(co)
                    res.send({'status': 'success', 'time': 'n'})
                else
                    flag = 1
            }
            if(flag == 1) {
                if(baseObj['status'] && baseObj['status'] == 'success') {
                    var md = {}
                    var mdkey = 'syllabus.' + req.params.week + '.status'
                    md[mdkey] = 'incomplete'
                    var newVal = {$set: md}
                    courseModel.updateOne({'_id': req.session.courseId}, newVal, (err, user) => {
                        if(err) {
                            console.log(err)
                            res.json({'status': 'error', 'error': err})
                        }
                        else {
                            if(user['ok'] == 1) 
                                res.send({'status': 'success', 'time': leftTime})
                            else
                                res.json({'status': 'error', 'error': 'Error while saving'})
                        }
                    })
                } else {
                    res.send({'status': 'success', 'time': leftTime})
                }
            }
        }
    })
})
router.get('/save/moduleStatus/:week/:module', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user1) => {
        if (err)
            res.json({'status': 'error', 'error': err})
        else {
            var entry = {}
            var eKey = 'syllabus.' + req.params.week + '.' + req.params.module + '.status'
            entry[eKey] = 'success'
            var newValues = { $set: entry };
            courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
                if (err) {
                    res.json({'status': 'error', 'error': err})
                } else {
                    if (user == null || user['ok'] == 0)
                        res.json({'status': 'error', 'error': 'Error while uploading the video.'})
                    else {
                        res.redirect('/be-an-educator/save/WeekStatus/' + req.params.week + '/module')
                    }
                }
            })
        }
    })
})
router.get('/save/WeekStatus/:week/:type', (req, res) => {
    console.log('saving week status')
    courseModel.findOne({ '_id': req.session.courseId }, (err, doc) => {
        if(err)
            res.json({'status': 'error', 'error': err})
        else {
            var baseObj = doc['syllabus'][req.params.week]
            if(req.params.type == 'module') {
                console.log('module yes')
                var modFlag = moduleStatus(baseObj)
                console.log(modFlag)
                console.log('all done')
                if(modFlag == 0) {
                    res.json({'status': 'success', 'modules': 'n'})
                } else { 
                    var assnsFlag = assnsStatus(baseObj)
                    var coFlag = coStatus(baseObj)
                    console.log(assnsFlag)
                    console.log(coFlag)    
                    console.log('mods done')
                    if(assnsFlag['assn'] && coFlag['co']) {
                        saveWeekStatus(req.params.week, req, res, 'module', doc['syllabus']['totalWeeks'])                         
                    } else {
                        res.json({'status': 'success', 'modules': 'y', 'week': 'incomplete'})
                    }
                }
            } else if(req.params.type == 'assn') {
                var assnsFlag = assnsStatus(baseObj)
                if(assnsFlag['assn']) {
                    var coFlag = coStatus(baseObj)
                    var modFlag = moduleStatus(baseObj)
                    if(coFlag['co'] && modFlag == 1) {
                        saveWeekStatus(req.params.week, req, res, 'resources', doc['syllabus']['totalWeeks'])                           
                    } else {
                        res.json({'status': 'success', 'week': 'incomplete'})
                    }
                } else {
                    res.json({'status': 'success', 'time': assnsFlag['time']})
                }
            } else {
                var coFlag = coStatus(baseObj)
                console.log(coFlag)
                if(coFlag['co']) {
                    var assnsFlag = assnsStatus(baseObj)
                    var modFlag = moduleStatus(baseObj)
                    if(assnsFlag['assn'] && modFlag == 1) {
                        console.log('week done')
                        saveWeekStatus(req.params.week, req, res, 'resources', doc['syllabus']['totalWeeks'])        
                    } else {
                        console.log('week not done')
                        res.json({'status': 'success', 'week': 'incomplete'})
                    }
                } else {
                    console.log('conot done')
                    res.json({'status': 'success', 'time': coFlag['time']})
                }
            }
        }
    })
})
function moduleStatus(baseObj) {
    console.log('module status')
    var flag = 1
    for (module in baseObj)
        if (module.includes('module')) {
            if (!baseObj[module]['status']) {
                flag = 0
                break
            }
        }
    return flag
}
function assnsStatus(baseObj) {
    var leftAssnTime = 0
    if(baseObj['Assntotaltime'] && baseObj['Assntotaltime'] >= 20) {
        var assn = true
    } else {
        var assn = false
        if(baseObj['Assntotaltime'])
            var leftAssnTime = 20 - baseObj['Assntotaltime']
        else
            var leftAssnTime = 20
    }
    var assnReturn = {'assn': assn, 'time': leftAssnTime}
    return assnReturn
}
function coStatus(baseObj) {
    var leftCOTime = 0
    if(baseObj['COtotaltime'] && baseObj['COtotaltime'] >= 90) {
        var co = true
    } else {
        var co = false
        if(baseObj['COtotaltime'])
            var leftCOTime = 90 - baseObj['COtotaltime']
        else
            var leftCOTime = 90
    }    
    var coReturn = {'co': co, 'time': leftCOTime}
    return coReturn
}
async function saveWeekStatus(week, req, res, type, totalWeeks) {
    var entry2 = {}
    var e2Key = 'syllabus.' + week + '.status'
    entry2[e2Key] = 'success'
    var newValues1 = { $set: entry2 };
    await courseModel.updateOne({ '_id': req.session.courseId }, newValues1, (err, user) => {
        if (err) {
            res.json({'status': 'error', 'error': err})
        }
        else {
            if (user == null || user['ok'] == 0) {
                res.json({'status': 'error', 'error': 'Error while uploading'})
            }
            else {
                if (parseInt(req.params.week.match(/\d+/)) == totalWeeks) {
                    if(type == 'module') 
                        res.json({'status': 'success', 'week': 'complete', 'modules': 'y'}) 
                    else 
                        res.json({'status': 'success', 'week': 'complete'})
                } else {
                    if(type == 'module') 
                        res.json({'status': 'success', 'week': 'success', 'modules': 'y'}) 
                    else 
                        res.json({'status': 'success', 'week': 'success'})
                }
            }
        }
    })
}
router.post('/save/courseLandingPage', uploadCI.fields([{ name: 'course_thumbnail' }, { name: 'promo_video' }]), (req, res) => {
    console.log(req.session.courseId)
    console.log(req.body)
    console.log(req.files)
        // level: req.body.level
    var newValues = { $set: { clpage: 'Y', courseDescription: req.body.des, courseThumbnail: req.files.course_thumbnail[0].filename, courseVideo: req.files.promo_video[0].filename, primarilyTaught: req.body.primarily_taught, level: req.body.level } };
    courseModel.updateOne({ '_id': req.session.courseId }, newValues, (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            if (user == null || user['ok'] == 0) {
                res.send('Error while saving')
            } else {
                var newK = {}
                var key = 'courses.' + req.session.category + '.' + req.session.courseId + '.thumbnail'
                newK[key] = req.files.course_thumbnail[0].filename
                var newVal = { $set: newK }
                educatorModel.updateOne({ 'educatorEmail': req.session.email }, newVal, (err, user) => {
                    if (err) console.log(err)
                    else {
                        if (user['ok'] == 1) {
                            res.send('success')
                        }
                    }
                })
            }
        }
    })
})
router.post('/update/educatorProfile', uploadDP.single('profile_photo'), (req, res) => {
    console.log(req.session.courseId)
    console.log(req.body)
    console.log(req.file)
    if (req.file)
        var newValues = { $set: { about: req.body.instructor_des, dp: req.file.filename } };
    else
        var newValues = { $set: { about: req.body.instructor_des } };
    educatorModel.updateOne({ 'educatorEmail': req.session.email }, newValues, (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            if (user == null || user['ok'] == 0) {
                res.send('Error while saving')
            } else {
                res.send('success')
            }
        }
    })
})
router.post('/save/pricing', (req, res) => {
    var newVal = { $set: { pricing: { type: req.body.type, amount: req.body.amount } } }
    courseModel.findOneAndUpdate({ '_id': req.session.courseId }, newVal, (err, user) => {
        if (err) res.send('Error while saving')
        else {
            var newK = {}
            var key = 'courses.' + req.session.category + '.' + req.session.courseId + '.pricing'
            if (req.body.type == 'Free')
                newK[key] = 'Free'
            else if (req.body.type == 'INR')
                newK[key] = req.body.amount + '/-'
            else
                newK[key] = '$' + req.body.amount

            var newVal = { $set: newK }
            educatorModel.updateOne({ 'educatorEmail': req.session.email }, newVal, (err, user) => {
                if (err) console.log(err)
                else {
                    if (user['ok'] == 1) {
                        res.send('success')
                    }
                }
            })
        }
    })
})
router.get('/submitforreview', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        if (err)
            res.send('Something went wrong. Try after some time.')
        else {
            var baseObj = user['syllabus']
            var flag = 0
            for (week in baseObj)
                if (week.includes('week'))
                    if (!user['syllabus'][week]['status']) {
                        flag = 1
                        break
                    } else if (user['syllabus'][week]['status'] != 'success') {
                        flag = 1
                        break
                    }
            console.log(flag)
            if (flag == 1)
                res.send('Please complete all the requirements for every week first.')
            else if (!user['clpage'] || user['clpage'] != 'Y')
                res.send('Please complete the course landing page.')
            else {
                educatorModel.findOne({ 'educatorEmail': req.session.email }, { 'dp': 1, 'about': 1 }, (err, resp) => {
                    if (err) res.send('Something went wrong. Try after some time.')
                    else {
                        if (!(resp['dp'] != 'N' && resp['about'] && resp['about'].length > 50))
                            res.send('Please update your profile in course landing page.')
                        else {
                            var newK = {}
                            var key = 'courses.' + req.session.category + '.' + req.session.courseId + '.courseStatus'
                            newK[key] = 'Review'
                            var newVal = { $set: newK }
                            educatorModel.updateOne({ 'educatorEmail': req.session.email }, newVal, (err, u1) => {
                                if (err) console.log(err)
                                else {
                                    if (u1['ok'] == 1) {
                                        var cnewVal = { $set: { 'courseStatus': 'Review' } }
                                        courseModel.updateOne({ '_id': req.session.courseId }, cnewVal, (err, u) => {
                                            if (err) console.log(err)
                                            else {
                                                if (u['ok'] == 1) {
                                                    req.session.courseId = ''
                                                    var mssg = 'Dear Educator,<br><br>Congratulations on successfully completing your course entitled "' + user['courseTitle'] + '".<br><br>Your course is now under <i>review</i>. Our team will contact you for the changes, if any.<br><br>Thank You<br>Team OCera EdTech'
                                                    sendMail(req.session.email, 'Your Course is Under Review', mssg, res, 'imm')
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}) 


router.get('/try', (req, res) => res.render('try'))
router.post('/try', (req, res) => {
    console.log(req.body)
    console.log('ok')
    res.send('hi')
})

router.get('/get/modules/:week', (req, res) => {
    courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
        if (err)
            console.log(err)
        else {
            baseObj = user['syllabus'][req.params.week]
            res.json(baseObj)
        }
    })
})

router.get('/mou/:type', (req, res) => {
    educatorModel.findOne({ 'educatorEmail': req.session.email }, (err, user) => {
        if (err)
            console.log(err)
        else {
            var feedback = 'N'
            if (user.feedback)
                feedback = 'Y'
            var username = user.educatorName
            var course
            if (req.session.courseId) {
                courseModel.findOne({ '_id': req.session.courseId }, (err, user) => {
                    if (err) console.log(err)
                    else {
                        console.log(user)
                        course = user['courseTitle']
                        res.render('educator/mou', { 'type': req.params.type, 'fb': feedback, 'name': username, 'course': course })
                    }
                })
            } else {
                course = 'Course Name'
                res.render('educator/mou', { 'type': req.params.type, 'fb': feedback, 'name': username, 'course': course })
            }
        }
    })
})
// uploadMOU.fields([{ name: 'user_signature' }, { name: 'w1_signature' }, { name: 'w2_signature' }]),
router.post('/save/mou', (req, res) => {
    console.log('saving...')
    var uploadMOU = multer({ storage: MOUstorage }).array("signatures", 3)
    uploadMOU(req, res, err => {
        console.log(req.files)
        var msg = req.body.salutation + ". " + req.body.username + " " + req.body.relation_type + " of " + req.body.family_name + " " + req.body.organisation_type + " " + req.body.organisation_name + " having his " + req.body.address_type + " at " + req.body.address + "."
        console.log(msg)
        var newVal = { $set: { mouDetails: { 'basic': msg, 'file': req.files[0].filename, 'witness1': { 'name': req.body.w1_name, 'address': req.body.w1_add, 'file': req.files[1].filename }, 'witness2': { 'name': req.body.w2_name, 'address': req.body.w2_add, 'file': req.files[0].filename } } } }
        courseModel.updateOne({ '_id': req.session.courseId }, newVal, (err, user) => {
            if (err) {
                console.log(err)
                res.send('There occurred some problem.')
            } else {
                console.log(user)
                if (!user || user['ok'] == 0) {
                    res.send('There occurred some problem.')
                } else {
                    res.send('success')
                }
            }
        })    
    })
})
router.get('/bookYourSlot', (req, res) => res.render('educator/book_your_slot'))
router.post('/sendEmail/confirmBooking', (req, res) => {
    var md = {}
    var mdkey = 'slots.' + req.body.dt + '.' + req.body.tm
    md[mdkey] = {'name': req.session.name, 'email': req.session.email}
    var mssg = 'Dear Educator,<br><br>You have successfully booked your slot with our team.<br><br><b>Date: </b> ' + req.body.dt + ' <br><b>Time: </b> ' + req.body.tm + ' <br><br>You are hereby requested to join the meeting on the scheduled date and time.<br><br>Thank You<br>Team OCera EdTech'
    sendMail(req.session.email, 'Training Slot Confirmed !', mssg, res, 'imm')
})

function sendMail(to, subject, text, res, when) {
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
        if (error) console.log('Something went wrong')
        else {
            console.log('message sent: ' + info.response);
            // res.send('success')
        }
    });
    if(when == 'imm') {
        res.send('success')
    }

}
router.get('/try', (req, res) => {
    var s = myfunc('hi')
    res.send(s)
})
module.exports = router;