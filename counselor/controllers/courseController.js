const { uploadToS3 } = require("../helpers/feedHelpers");
const { upload } = require("../middlewares/formMiddlewares");
const Comment = require("../models/Comment");
const Counsellor = require("../models/Counsellor");
const Course = require("../models/Course");
const Feed = require("../models/Feed");

exports.getCourses = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    // Assuming you have a 'Counsellor' model defined somewhere else
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor) {
      return res.status(404).send({
        error: "Counsellor not found",
      });
    }

    const courses = await Course.find({
      course_counsellors: counsellor_id,
    });

    if (courses.length === 0) {
      return res.status(404).send({
        error: "No courses found for this counsellor",
      });
    }

    const massagedCourses = courses.map((course) => {
      return {
        course_name: course.course_name,
      };
    });

    res.status(200).send(massagedCourses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    if (!courses)
      return res.status(404).send({
        error: "Courses not found",
      });

    const massagedCourses = courses.map((course) => {
      return {
        course_name: course.course_name,
      };
    });

    res.status(200).send(massagedCourses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { course_name } = req.body;
    if (!course_name)
      return res.status(400).send({
        error: "Course name is required",
      });

    let course = await Course.findOne({ course_name });
    if (course)
      return res.status(400).send({
        error: "Course with the same name already exists",
      });

    course = new Course({
      course_name,
    });

    const savedCourse = await course.save();

    res.status(200).send({
      message: "Course saved successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.addCounsellorInCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { counsellor_id } = req.body;
    if (!counsellor_id)
      return res.status(400).send({
        error: "Counsellor should be provided",
      });

    const course = await Course.findOne({ _id: course_id });
    if (!course) {
      return res.status(404).send({
        error: "Course not found",
      });
    }

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor)
      return res.status(404).send({
        error: "Counsellor not found",
      });

    counsellor.courses_focused.push(course.course_name);

    if (course.course_counsellors.includes(counsellor_id)) {
      return res.status(400).send({
        error: "Counsellor already exists in the course",
      });
    }

    course.course_counsellors.push(counsellor_id);
    await course.save();
    await counsellor.save();

    res.status(200).send({
      message: "Counsellor added to the course successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
