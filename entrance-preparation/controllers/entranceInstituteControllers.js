const { response } = require("express");
const EntranceInstitute = require("../models/EntranceInstitute");
const fs = require("fs");

exports.createInstitute = async (req, res) => {
  try {
    const {
      name,
      email,
      profile_pic,
      degree_focused,
      country,
      state,
      city,
      area,
      working_time,
      working_experience,
      client_testimonials,
      emergency_contact,
    } = req.body;

    if (!name || !email)
      return res.status(400).send({
        error: "Name and email is required",
      });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        error: "Invalid email format",
      });
    }

    const profile = {};

    profile.email = email;
    profile.name = name;
    if (profile_pic) profile.profile_pic = profile_pic;
    if (degree_focused) profile.degree_focused = degree_focused;
    if (country) profile.country = country;
    if (state) profile.state = state;
    if (city) profile.city = city;
    if (area) profile.area = area;
    if (working_time) profile.working_time = working_time;
    if (working_experience) profile.working_experience = working_experience;
    if (client_testimonials) profile.client_testimonials = client_testimonials;
    if (emergency_contact) profile.emergency_contact = emergency_contact;

    let institute = new EntranceInstitute({
      ...profile,
    });

    institute = await institute.save();

    res.status(200).send({
      message: "Entrance Institute successfully created",
      institute,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getInstitutes = async (req, res) => {
  try {
    const { degree, country, city, courses_focused } = req.query;

    const filters = {};
    if (degree) filters.degree = degree;
    if (country) filters.country = country;
    if (city) filters.city = Array.isArray(city) ? { $in: city } : [city];
    if (courses_focused)
      filters.course = Array.isArray(courses_focused)
        ? { $in: courses_focused }
        : [courses_focused];

    const institutes = await EntranceInstitute.find(filters);
    console.log(institutes);
    if (institutes.length === 0) {
      return res.status(404).send({ error: "No Institutes found" });
    }

    const formattedInstitutes = institutes.map((institute) => {
      const {
        name,
        profile_pic,
        degree_focused,
        state,
        city,
        area,
        working_time,
        client_testimonials,
        _id,
      } = institute;
      return {
        name,
        profile_pic,
        degree_focused,
        state,
        city,
        area,
        working_time,
        client_testimonials,
        _id,
      };
    });

    res.status(200).send(formattedInstitutes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;

    const institute = await EntranceInstitute.findById(institute_id);
    if (!institute) {
      return res.status(404).send({ error: "Institute not found" });
    }

    res.status(200).send(institute);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;

    const institute = await EntranceInstitute.findByIdAndDelete(institute_id);
    if (!institute) {
      return res.status(404).send({ error: "Institute not found" });
    }

    res.status(200).send({ message: "Institute Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const {
      name,
      email,
      profile_pic,
      degree_focused,
      country,
      state,
      city,
      area,
      working_time,
      working_experience,
      client_testimonials,
      emergency_contact,
    } = req.body;
    console.log(req.body);
    if (
      name ||
      email ||
      profile_pic ||
      degree_focused ||
      country ||
      state ||
      city ||
      area ||
      working_time ||
      working_experience ||
      client_testimonials ||
      emergency_contact
    ) {
      let course = await EntranceInstitute.findById(institute_id);
      if (!course)
        return res.status(404).send({ error: "Institute not found" });

      const updateFields = {};
      if (name) {
        updateFields["name"] = name;
      }

      if (email) {
        updateFields["email"] = email;
      }

      if (profile_pic) {
        updateFields["profile_pic"] = profile_pic;
      }

      if (degree_focused) {
        updateFields["degree_focused"] = degree_focused;
      }

      if (country) {
        updateFields["country"] = country;
      }

      if (state) {
        updateFields["state"] = state;
      }

      if (city) {
        updateFields["city"] = city;
      }

      if (area) {
        updateFields["area"] = area;
      }

      if (working_time) {
        updateFields["working_time"] = working_time;
      }

      if (working_experience) {
        updateFields["working_experience"] = working_experience;
      }

      if (client_testimonials) {
        updateFields["client_testimonials"] = client_testimonials;
      }

      if (emergency_contact) {
        updateFields["emergency_contact"] = emergency_contact;
      }

      course = await EntranceInstitute.findOne({ name });
      if (course)
        return res.status(400).send({ error: "Institute name already exists" });

      const updatedInstitute = await EntranceInstitute.findByIdAndUpdate(
        institute_id,
        updateFields
      );

      if (!updatedInstitute)
        return res.status(400).json({ error: "institute can't be updated" });

      res
        .status(200)
        .json({ message: "institute details updated successfully" });
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

exports.getInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;

    const institute = await EntranceInstitute.findById(institute_id);
    if (!institute) {
      return res.status(404).send({ error: "Institute not found" });
    }

    res.status(200).send(institute);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;

    const institute = await EntranceInstitute.findByIdAndDelete(institute_id);
    if (!institute) {
      return res.status(404).send({ error: "Institute not found" });
    }

    res.status(200).send({ message: "Institute Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const {
      name,
      email,
      profile_pic,
      degree_focused,
      country,
      state,
      city,
      area,
      working_time,
      working_experience,
      client_testimonials,
      emergency_contact,
    } = req.body;
    console.log(req.body);
    if (
      name ||
      email ||
      profile_pic ||
      degree_focused ||
      country ||
      state ||
      city ||
      area ||
      working_time ||
      working_experience ||
      client_testimonials ||
      emergency_contact
    ) {
      let course = await EntranceInstitute.findById(institute_id);
      if (!course)
        return res.status(404).send({ error: "Institute not found" });

      const updateFields = {};
      if (name) {
        updateFields["name"] = name;
      }

      if (email) {
        updateFields["email"] = email;
      }

      if (profile_pic) {
        updateFields["profile_pic"] = profile_pic;
      }

      if (degree_focused) {
        updateFields["degree_focused"] = degree_focused;
      }

      if (country) {
        updateFields["country"] = country;
      }

      if (state) {
        updateFields["state"] = state;
      }

      if (city) {
        updateFields["city"] = city;
      }

      if (area) {
        updateFields["area"] = area;
      }

      if (working_time) {
        updateFields["working_time"] = working_time;
      }

      if (working_experience) {
        updateFields["working_experience"] = working_experience;
      }

      if (client_testimonials) {
        updateFields["client_testimonials"] = client_testimonials;
      }

      if (emergency_contact) {
        updateFields["emergency_contact"] = emergency_contact;
      }

      course = await EntranceInstitute.findOne({ name });
      if (course)
        return res.status(400).send({ error: "Institute name already exists" });

      const updatedInstitute = await EntranceInstitute.findByIdAndUpdate(
        institute_id,
        updateFields
      );

      if (!updatedInstitute)
        return res.status(400).json({ error: "institute can't be updated" });

      res
        .status(200)
        .json({ message: "Institute details updated successfully" });
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

exports.sendEnquiry = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
