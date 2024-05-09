const Issue = require("../models/Issue");
const IssueCategory = require("../models/IssueCategory");
const Question = require("../models/Question");

exports.getIssues = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const issues = await Issue.find(query);

    if (!issues) return res.status(404).send([]);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
    console.log(error);
  }
};

exports.getIssue = async (req, res) => {
  try {
    const { issue_id } = req.params;
    const issue = await Issue.findOne({ _id: issue_id });

    res.status(200).send(issue);
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
    console.log(error);
  }
};

exports.postIssue = async (req, res) => {
  try {
    const { id } = req;
    const { category, content } = req.body;

    let categoryObj = await IssueCategory.findOne({ name: category });
    let newCategory = categoryObj;
    if (!categoryObj) {
      categoryObj = new IssueCategory({
        name: category,
      });
      newCategory = await categoryObj.save();
    }
    let issue = new Issue({
      category: newCategory._id,
    });

    issue = await issue.save();
    const question = new Question({
      issue: issue._id,
      content,
      enquirer: id,
    });
    await question.save();

    res.status(200).send({
      message: "Issue successfully generated",
      data: issue,
    });
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
    console.log(error);
  }
};

exports.updateIssue = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
    console.log(error);
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const { issue_id } = req.params;
    const deteledIssue = await Issue.findOneAndDelete({ _id: issue_id });

    if (!deteledIssue)
      return res.status(400).send({
        error: "Error deleting issue",
      });

    res.status(200).send(deteledIssue);
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
    console.log(error);
  }
};
