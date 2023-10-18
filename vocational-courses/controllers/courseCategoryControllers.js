const CourseCategory = require("../models/CourseCategory");

exports.createCourseCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).send({
        error: "Please enter name",
      });

    course = await CourseCategory.findOne({ name });
    if (course)
      return res.status(400).send({ error: "Category name already exists" });

    course = new CourseCategory({
      name,
    });

    course = await course.save();

    res.status(200).send({
      message: "Course category successfully created",
      course,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getCourseCategorys = async (req, res) => {
  try {
    const { name } = req.query;
    const filters = {};

    if (name) filters.name = Array.isArray(name) ? { $in: name } : [name];

    const categorys = await CourseCategory.find(filters);

    res.status(200).send(categorys);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getCourseCategory = async (req, res) => {
  try {
    const { course_id } = req.params;

    const category = await CourseCategory.findById(course_id);
    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    res.status(200).send(category);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteCourseCategory = async (req, res) => {
  try {
    const { course_id } = req.params;

    const category = await CourseCategory.findByIdAndDelete(course_id);
    if (!category) {
      return res.status(404).send({ error: "category not found" });
    }

    res.status(200).send({ message: "category Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editCourseCategory = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { name } = req.body;
    console.log(req.body);
    if (name) {
      let category = await CourseCategory.findById(course_id);
      if (!category) return res.status(404).send({ error: "Course not found" });

      const updateFields = {};
      if (name) {
        updateFields["name"] = name;
      }

      category = await CourseCategory.findOne({ name });
      if (category)
        return res.status(400).send({ error: "category name already exists" });

      const updatedCourse = await CourseCategory.findByIdAndUpdate(
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
