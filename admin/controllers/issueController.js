const Issue = require("../models/Issue");
const Question = require("../models/Question");

exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find();

    if (!issues) return res.status(404).send([]);
    res.status(200).send(issues)
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error"
    })
    console.log(error)
  }
}

exports.getIssue = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error"
    })
    console.log(error)
  }
}

exports.postIssue = async (req, res) => {
  try {
    const { id } = req;
    const { category, content } = req.body;
    let issue = new Issue({
      category,
    })

    issue = await issue.save();
    const question = new Question({
      issue: issue._id,
      content,
      enquirer: id
    })
    await question.save();

    res.status(200).send({
      message: 'Issue successfully generated',
      data: issue
    })
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error"
    })
    console.log(error)
  }
}

exports.updateIssue = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error"
    })
    console.log(error)
  }
}

exports.deleteIssue = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error"
    })
    console.log(error)
  }
}