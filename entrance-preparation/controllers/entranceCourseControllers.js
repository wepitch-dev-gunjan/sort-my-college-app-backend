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

exports.getCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const course = await EntranceCourse.findById(course_id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const course = await EntranceCourse.findByIdAndDelete(course_id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send({ message: "Course Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { course_name, course_degree, online, offline } = req.body;
    console.log(req.body);
    if (course_name || course_degree || online || offline) {
      let course = await EntranceCourse.findById(course_id);
      if (!course) return res.status(404).send({ error: "Course not found" });

      const updateFields = {};
      if (course_name) {
        updateFields["course_name"] = course_name;
      }

      if (course_degree) {
        updateFields["course_degree"] = course_degree;
      }

      if (online) {
        updateFields["online"] = online;
      }

      if (offline) {
        updateFields["offline"] = offline;
      }

      course = await EntranceCourse.findOne({ course_name });
      if (course)
        return res.status(400).send({ error: "Course name already exists" });

      const updatedCourse = await EntranceCourse.findByIdAndUpdate(
        course_id,
        updateFields
      );

      if (!updatedCourse)
        return res.status(400).json({ error: "Course can't be updated" });

      res.status(200).json({ message: "Course updated successfully" });
    } else {
      return res.status(400).send({
        error: "Atleast one field is required",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
