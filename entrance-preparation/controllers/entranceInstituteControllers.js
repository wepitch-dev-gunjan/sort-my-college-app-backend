const { response } = require("express");
const EntranceInstitute = require("../models/EntranceInstitute");
const fs = require("fs");

exports.createInstitute = async (req, res) => {
  try {
    const {
      registrant_full_name,
      registrant_contact_number,
      registrant_email,
      registrant_designation,
      profile_pic,
      cover_image,
      name,
      about,
      address, // NEED TO CHECK THE ADDRESS
      direction_url,
      year_established_in,
      affiliations,
      email,
      contact_number,
      gstin,
      institute_timings,
      mode_of_study,
      medium_of_study,
    } = req.body;

    if (!name || !email)
      return res.status(400).send({
        error: "Name and email is required",
      });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrant_email)) {
      return res.status(400).send({
        error: "Invalid email format for registrant's email",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        error: "Invalid email format for institute's email",
      });
    }

    const profile = {};

    profile.registrant_email = registrant_email;
    profile.registrant__full_name = registrant_full_name;
    if (registrant_contact_number) profile.registrant_contact_number = registrant_contact_number ;
    if (registrant_designation) profile.registrant_designation = registrant_designation ;
    if (profile_pic) profile.profile_pic = profile_pic;
    if (cover_image) profile.cover_image = cover_image ;
    if (name) profile.name = name;
    if (about) profile.about = about;
    if (address) profile.address = address; // NEED TO CHECK THE ADDRESS
    if (direction_url) profile.direction_url = direction_url ;
    if (year_established_in) profile.year_established_in = year_established_in;
    if (affiliations) profile.affiliations = affiliations;
    if (email) profile.email = email;
    if (contact_number) profile.contact_number = contact_number;
    if (gstin) profile.gstin = gstin;
    if (institute_timings) profile.institute_timings = institute_timings;
    if (mode_of_study) profile.mode_of_study = mode_of_study;
    if (medium_of_study) profile.medium_of_study = medium_of_study;

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
