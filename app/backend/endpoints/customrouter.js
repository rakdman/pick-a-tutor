const express = require("express");
const router = express.Router();

const login = require("./login");
const reviews = require("./reviews");
const tutors = require("./tutors");
const users = require("./users");
const courses = require("./courses");
const tutorCourses = require("./tutorcourses");

const authadmin = require("../auth/checkauth_admin");
const authstudent = require("../auth/checkauth_student");
const authtutor = require("../auth/checkauth_tutor");
const authgeneral = require("../auth/checkauth_general");
const userprofilefiles = require("./userprofilefiles");
const studentenrolledcourses = require("./studentenrolledcourses");
const CourseAdditionalInfo = require("./courseadditionalinfo");
const Review = require("./review");
const TutorOfMonth = require("./tutorofmonth");
const Message = require("./message");

//*******Users Routes*******
router.get("/users", users.getallusers);
router.post("/users", users.createuser);
router.patch("/users/:email", authgeneral, users.updateuser);
router.delete("/users/:email", authgeneral, users.deleteuser);

//*******Login Routes*******
router.post("/login", login.loginuser);

//*******Courses Routes*******
router.get("/courses", courses.getAllCourses);
router.post("/course", authadmin, courses.postApiCourse);
router.patch("/course/:id", authadmin, courses.updateCourse);
router.delete("/course/:id", authadmin, courses.courseDelete);

//*******Tutor Courses Routes*******
//******** Get All courses of all tutors or by passing "tutor_id" in parameter, get ONLY one tutor's courses *********
router.get("/tutor_courses", tutorCourses.getTutorCourses);
router.post("/tutor_course", authtutor, tutorCourses.postTutorCourse);
router.patch("/tutor_course/:id", authtutor, tutorCourses.updateTutorCourse);
router.delete("/tutor_course/:id", authtutor, tutorCourses.deleteTutorCourse);

//*******Tutor Routes*******
router.get("/tutors", tutors.getAllTutors);
router.post("/tutors", tutors.createTutor);
router.patch("/tutors/:email", authgeneral, users.updateuser);
router.delete("/tutors/:email", authgeneral, users.deleteuser);

//*******Tutor Of Month Route*******
router.get("/tutorofmonth", TutorOfMonth.tutorofmonth);

//*******Review Routes*******
router.patch("/approvereview/:id", authgeneral, Review.approvereview);
router.delete("/deleteReview/:id", authgeneral, Review.deleteReview);

//*******User Profile Files Routes*******
router.get(
    "/getallprofilefilesbyuserid/:userId",
    authgeneral,
    userprofilefiles.getallbyuserid
);
router.get(
    "/getallprofilefilesbyfileid/:fileId",
    authgeneral,
    userprofilefiles.getallbyfileid
);
router.get(
    "/getallprofilefilesbystatus/:approvalStatus",
    authgeneral,
    userprofilefiles.getallbystatus
);
router.get(
    "/getallprofilefilesbyuserstatus/:userId/:approvalStatus",
    authgeneral,
    userprofilefiles.getallbyuserfilestatus
);
// router.post(
//     "/createprofilefile",
//     authgeneral,
//     userprofilefiles.createuserprofilefile
// );
router.patch(
    "/updateprofilefile/:fileId",
    authgeneral,
    userprofilefiles.updateuserprofilefile
);
router.delete(
    "/deleteuserprofilefile/:fileId",
    authgeneral,
    userprofilefiles.deleteuserprofilefile
);

//*******StudentEnrollerCourses Routes*******
router.get(
    "/enrolledstudentcourses",
    authgeneral,
    studentenrolledcourses.getAllStudentCourses
);
router.post(
    "/enrollstudent",
    authgeneral,
    studentenrolledcourses.createStudentCourse
);

router.patch(
    "/updateenrolledcoursestatus",
    authgeneral,
    studentenrolledcourses.updateStudentCourse
);
router.delete(
    "/deletestudentcourse",
    authgeneral,
    studentenrolledcourses.deleteStudentCourse
);

//*******Message Routes *******
router.post("/createmessage", authgeneral, Message.createmessage);
router.get("/getconversation", authgeneral, Message.getconversation);
// router.get("/getallmessages", Message.getallmessages);

// router.patch("/updateconversationstatus", Message.updateconversationstatus);

//*******Review Routes*******
router.get("/reviews", reviews.getReviews);
router.post("/reviews", authstudent, reviews.addReview);
router.patch("/reviews/:id", authadmin, reviews.approvereview);
router.patch("/reviews/:id/report", authgeneral, reviews.reportReview);

//*******Course Additional Files Routes*******
router.get(
    "/getallbytutorcourse/:tutorId/:courseId",
    authgeneral,
    CourseAdditionalInfo.getallbyTutorCourse
);
router.get(
    "/getallcoursefilesbyfileid/:fileId",
    authgeneral,
    CourseAdditionalInfo.getallbyfileid
);
router.get(
    "/getallcoursefilesbystatus/:approvalStatus",
    authgeneral,
    CourseAdditionalInfo.getallbystatus
);
router.get(
    "/getallcoursefilesbytutor",
    authgeneral,
    CourseAdditionalInfo.getallbytutor
);
// router.post(
//     "/createcoursefile",
//     authgeneral,
//     CourseAdditionalInfo.createusercoursefile
// );
router.patch(
    "/updatecoursefile/:fileId",
    authgeneral,
    CourseAdditionalInfo.updatcoursefile
);
router.delete(
    "/deletecoursefile/:fileId",
    authgeneral,
    CourseAdditionalInfo.deletecoursefile
);

// ************************Upload user Profile files ********************

const multer = require("multer");
const jwtdecode = require("jwt-decode");
const checkauth_general = require("../auth/checkauth_general");
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.PROFILE_STORAGE);
    },
    filename: function (req, file, cb) {
        var token = req.headers["authorization"];
        var decoded = jwtdecode(token);
        const uniqueSuffix =
            decoded.id +
            "-" +
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);
        cb(null, "User-" + uniqueSuffix);
    },
});

let profileupload = multer({ storage: storage });

// router.post(
//     "/uploadmyfile",
//     profileupload.single("file"),
//     userprofilefiles.uploadmyfile
// );

router.post(
    "/createprofilefile",
    profileupload.single("file"),
    authgeneral,
    userprofilefiles.createuserprofilefile
);

// ************************Upload Course files ********************

storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.COURSE_STORAGE);
    },
    filename: function (req, file, cb) {
        var token = req.headers["authorization"];
        var decoded = jwtdecode(token);
        const uniqueSuffix =
            decoded.id +
            "-" +
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9);
        cb(null, "Course-" + uniqueSuffix);
    },
});

profileupload = multer({ storage: storage });

router.post(
    "/createcoursefile",
    profileupload.single("file"),
    authgeneral,
    CourseAdditionalInfo.createusercoursefile
);

module.exports = router;
