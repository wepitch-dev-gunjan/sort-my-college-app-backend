const { Schema, model } = require("mongoose");

const vocationalCourseSchema = new Schema({});

module.exports = model("VocationalCourse", vocationalCourseSchema);
