const VocationalCourse = require("../models/VocationalCourse");

exports.createVocationalCourse = async (req, res) => {
  try {
    const {
      course_owner_name,
      course_owner_email,
      course_name,
      course_category,
      course_image,
      online,
      offline,
      city,
    } = req.body;

    if (
      !course_owner_name ||
      !course_owner_email ||
      !course_name ||
      !course_category ||
      !course_image ||
      !online ||
      !offline ||
      !city
    )
      return res.status(400).send({
        error: " All fields are required",
      });

    course = new VocationalCourse({
      course_owner_name,
      course_owner_email,
      course_name,
      course_category,
      course_image,
      online,
      offline,
      city,
    });

    course = await course.save();

    res.status(200).send({
      message: "Vocational Course successfully created",
      course,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getVocationalCourses = async (req, res) => {
  try {
    const filters = {};

    const courses = await VocationalCourse.find(filters);

    res.status(200).send(courses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getVocationalCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const course = await VocationalCourse.findById(course_id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send(course);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteVocationalCourse = async (req, res) => {
  try {
    const { course_id } = req.params;

    const course = await VocationalCourse.findByIdAndDelete(course_id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    res.status(200).send({ message: "Course Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editVocationalCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const {
      course_owner_name,
      course_owner_email,
      course_name,
      course_category,
      course_image,
      online,
      offline,
      city,
    } = req.body;
    console.log(req.body);
    if (
      course_owner_name ||
      course_owner_email ||
      course_name ||
      course_category ||
      course_image ||
      online ||
      offline ||
      city
    ) {
      let course = await VocationalCourse.findById(course_id);
      if (!course) return res.status(404).send({ error: "Course not found" });

      const updateFields = {};
      if (course_owner_name) {
        updateFields["course_owner_name"] = course_owner_name;
      }

      if (course_owner_email) {
        updateFields["course_owner_email"] = course_owner_email;
      }

      if (online) {
        updateFields["online"] = online;
      }

      if (offline) {
        updateFields["offline"] = offline;
      }

      if (course_name) {
        updateFields["course_name"] = course_name;
      }

      if (course_category) {
        updateFields["course_category"] = course_category;
      }

      if (course_image) {
        updateFields["course_image"] = course_image;
      }

      if (city) {
        updateFields["city"] = city;
      }

      course = await VocationalCourse.findOne({ course_name });
      if (course)
        return res.status(400).send({ error: "Course name already exists" });

      const updatedCourse = await VocationalCourse.findByIdAndUpdate(
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
