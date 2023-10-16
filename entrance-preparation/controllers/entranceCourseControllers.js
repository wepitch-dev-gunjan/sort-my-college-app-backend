const { response } = require("express");
const EntranceCourse = require("../models/EntranceCourse");

exports.createCourse = async (req, res) => {
  try {
    const { course_name, course_degree, online, offline } = req.body;

    if (!course_name || !course_degree || !online || !offline)
      return res.status(400).send({
        error: " All fields are required",
      });

    let course = await EntranceCourse.findOne({ course_name });
    if (course)
      return res.status(400).send({ error: "Course name already exists" });

    course = new EntranceCourse({
      course_name,
      course_degree,
      online,
      offline,
    });

    course = await course.save();

    res.status(200).send({
      message: "Entrance Course successfully created",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { course_degree, online, offline } = req.query;
    const filters = {};

    if (course_degree)
      filters.course_degree = Array.isArray(course_degree)
        ? { $in: course_degree }
        : [course_degree];
    if (online) filters.online = online;
    if (offline) filters.offline = offline;

    const courses = await EntranceCourse.find(filters);

    res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
