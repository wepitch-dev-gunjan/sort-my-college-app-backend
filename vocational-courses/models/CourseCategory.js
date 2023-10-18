const { Schema, model } = require("mongoose");

const courseCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = model("CourseCategory", courseCategorySchema);
