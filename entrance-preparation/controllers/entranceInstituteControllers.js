const { week } = require("../helpers/instituteHelpers");
const EntranceInstitute = require("../models/EntranceInstitute");

// ep panel controllers
exports.getProfile = async (req, res) => {
  try {
    const { institute_id } = req;

    // Assuming you have some logic to identify the user's profile, for example, using req.user
    // You can customize this query according to your needs
    const profile = await EntranceInstitute.findOne({ _id: institute_id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // You can customize the response data structure as per your requirements
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { institute_id } = req; // Assuming institute_id is passed as a parameter
    const { about, ...body } = req.body; // Extract about field from the request body

    for (const timing of body.timings) {
      if (!week.includes(timing.day)) return res.status(400).send({
        error: "Invalid day field"
      })
    }
    // Find the profile by institute_id
    const profile = await EntranceInstitute.findById(institute_id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update the about field if it's included in the request body
    if (about !== undefined) {
      profile.about = about;
    }
    // Update other fields in the profile
    Object.keys(body).forEach((key) => {
      profile[key] = body[key];
    });

    // Save the updated profile
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Internal edit profile server error" });
  }
};

// admin panel controllers
exports.getInstitutesForAdmin = async (req, res) => {
  try {
    // Assuming you have some logic to authenticate the admin user and retrieve necessary information
    // You can customize this query according to your needs
    const institutes = await EntranceInstitute.find({});

    if (!institutes || institutes.length === 0) {
      return res.status(404).json({ message: "No institutes found" });
    }

    const massagedInstitutes = institutes.map((institute) => ({
      _id: institute._id,
      name: institute.name,
      profile_pic: institute.profile_pic,
      email: institute.email,
      status: institute.status,
    }));

    // You can customize the response data structure as per your requirements
    res.status(200).json(massagedInstitutes);
  } catch (error) {
    console.error("Error fetching institutes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInstituteForAdmin = async (req, res) => {
  try {
    const { institute_id } = req.params;

    // Assuming you have some logic to authenticate the admin user and retrieve necessary information
    // You can customize this query according to your needs
    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // You can customize the response data structure as per your requirements
    res.status(200).json(institute);
  } catch (error) {
    console.error("Error fetching institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editInstituteForAdmin = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const updateData = req.body;

    // Update the institute using findByIdAndUpdate method
    const updatedInstitute = await EntranceInstitute.findByIdAndUpdate(
      institute_id,
      updateData,
      { new: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    res.status(200).json(updatedInstitute);
  } catch (error) {
    console.error("Error editing institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteInstituteForAdmin = async (req, res) => {
  try {
    const { institute_id } = req.params;

    // Delete the institute by ID
    const deletedInstitute = await EntranceInstitute.findByIdAndDelete(
      institute_id
    );

    if (!deletedInstitute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    res.status(200).json({ message: "Institute deleted successfully" });
  } catch (error) {
    console.error("Error deleting institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.rejectInstitute = async(req, res) => {
  try {
    const { institute_id } = req.params
    const institute = await EntranceInstitute.findOne({_id: institute_id})

    if (!institute) {
      return res.status(404).send({ error: "Institute Not Found" });
    }

    if (!institute.verified) {
      return res.status(400).send({ error: "Institute is already not verified" });
    }

    institute.status = "REJECTED";
    institute.verified = false;

    await institute.save();

    res.status(200).send({
      message: "Institute Successfully Rejected"
    });

  } catch(error) {
    console.log(error)
    res.status(500).send({error : "Internal Server Error"})
  }
}

// for Users
exports.getInstitutesForUser = async (req, res) => {
  try {
    // Assuming you have some logic to authenticate the admin user and retrieve necessary information
    // You can customize this query according to your needs
    const institutes = await EntranceInstitute.find({});

    if (!institutes || institutes.length === 0) {
      return res.status(404).json({ message: "Institute not found" });
    }
    const massagedInstitutes = institutes.map((institute) => ({
      _id: institute._id,
      name: institute.name,
      profile_pic: institute.profile_pic,
      address: institute.address,
      year_established_in: institute.year_established_in,
      institute_timings: institute.institute_timings,
    }));

    // You can customize the response data structure as per your requirements
    res.status(200).json(massagedInstitutes);
  } catch (error) {
    console.error("Error fetching institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInstituteForUser = async (req, res) => {
  try {
    const { institute_id } = req.params;

    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).json({ message: "Institute not found !" });
    }

    res.status(200).json(institute);
  } catch (error) {
    console.error("Error fetching institute for user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.findOneInstitute = async (req, res) => {
  try {
    const { institute_id } = req.query;

    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).json({ message: "Institute not found !" });
    }

    res.status(200).json(institute);
  } catch (error) {
    console.error("Error fetching institute for user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyInstitute = async (req, res) => {
 try {
   const { institute_id } = req.params;
   const institute = await EntranceInstitute.findOne({ _id: institute_id });
   if (!institute) {
     return res.status(404).send({ error: "Institute Not Found" });
   }

   if (institute.verified) {
     return res.status(400).send({ error: "Institute already verified" });
   }

   institute.status = "APPROVED";
   institute.verified = true;
   await institute.save();
   res.status(200).send({
    message: "Institute verfified succesfully",
   });
 } catch (error) {
   console.log(error);
   res.status(500).send({ error: "Internal Server Error" });
 }
};
