// const EntranceCourse = require("../models/EntranceCourse");
const jwt = require("jsonwebtoken");
const { json } = require("express");

const { JWT_SECRET } = process.env;
const EntranceCourse = require("../models/EntranceCourse");
const { uploadImage } = require("../services/cloudinary");
// EP Panel Controllers
// courses for Ep Panel
exports.getCoursesForEp = async (req, res) => {
  try {
    const { institute_id } = req;
    // console.log(institute_id);
    const courses = await EntranceCourse.find({ institute: institute_id });

    if (!courses || courses.length === 0) {
      return res.status(200).json([]);
    }
    const massagedCourses = courses.map((course) => ({
      image: course.image,
      _id: course._id,
      name: course.name,
      type: course.type,
      acedemic_session: course.acedemic_session,
      course_fee: course.course_fee,
      course_duration_in_days: course.course_duration_in_days,
    }));
    res.status(200).json(massagedCourses);
  } catch (error) {
    console.log("Error Fetching Course", error);
    res.status(500).json({ message: "Internal sever error" });
  }
};
// add course
// exports.addCourse = async (req, res) => {
// const { name,type,academic_session,course_fee,course_duration_in_days} =req.body;
// try {
// const existingCourse = await EntranceCourse.findOne({ name: req.body.name });
// if (existingCourse) {
//   return res.status(400).send({ error: "course already exist" });
// }
// const { file } = req;
// const fileName = `course-image-${Date.now()}.png`;
// const folderName = `entrance-institute-course_images`;
// const image = await uploadImage(file.buffer, fileName, folderName);
//     const { institute_id } = req;
//     const addCourse = new EntranceCourse({
//       name: req.body.name,
//       // image,
//       type: req.body.type,
//       academic_session: req.body.academic_session,
//       course_fee: req.body.course_fee,
//       course_duration_in_days: req.body.course_duration_in_days,
//       institute: institute_id
//     });
//     await addCourse.save();
//     res.status(201).json({
//       message: "course Added Succesfully"
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       messge: "error adding course"
//     });
//   }
// };
exports.addCourse = async (req, res) => {
  try {
    const { institute_id } = req;
    const existingCourse = await EntranceCourse.findOne({
      name: req.body.name,
    });
    if (existingCourse) {
      return res.status(400).send({ error: "course already exist" });
    }
    const addCourse = new EntranceCourse({
      name: req.body.name,
      type: req.body.type,
      academic_session: req.body.academic_session,
      course_fee: req.body.course_fee,
      course_duration_in_days: req.body.course_duration_in_days,
      institute: institute_id,
    });

    await addCourse.save();

    res.status(201).json({
      message: "Course Added Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding course",
    });
  }
};
exports.editCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const updatedCourse = req.body;
    const updatedData = await EntranceCourse.findByIdAndUpdate(
      course_id,
      updatedCourse,
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({ message: " Course not found" });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    console.log("Error editing Course");
    res.status(500).json({ messge: "Internal Server Error" });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const deletedCourse = await EntranceCourse.findByIdAndDelete(course_id);
    if (!deletedCourse) {
      return res.status(400).json({ message: "Course Not Found" });
    }
    res.status(200).json({ message: "Course Deleted Succesfully" });
  } catch (error) {
    console.log("Error Deleting Course");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// user
exports.getCoursesForUser = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const courses = await EntranceCourse.find({ institute: institute_id });

    if (!courses || courses.length === 0) {
      return res.status(200).json([]);
    }
    const massagedCourses = courses.map((course) => ({
      image: course.image,
      _id: course._id,
      name: course.name,
      type: course.type,
      acedemic_session: course.acedemic_session,
      course_fee: course.course_fee,
      course_duration_in_days: course.course_duration_in_days,
    }));
    res.status(200).json(massagedCourses);
  } catch (error) {
    console.log("Error Fetching Course", error);
    res.status(500).json({ message: "Internal sever error" });
  }
};
