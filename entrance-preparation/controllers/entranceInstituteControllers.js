const EntranceInstitute = require("../models/EntranceInstitute");

// ep panel controllers
exports.getProfile = async (req, res) => {
  try {
    const { institute_id } = req;
    console.log(institute_id);
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
    const { institute_id } = req;
    const { body } = req;

    // Assuming you have some logic to validate and sanitize the request body before updating the profile
    // You can customize this validation according to your needs

    // Find the profile by institute_id and update it with the new data
    const updatedProfile = await EntranceInstitute.findByIdAndUpdate(
      institute_id,
      body,
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Internal server error" });
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

exports.getInstituteForUser = async(req, res) => {
  try {
    const { institute_id } = req.params;

    const institute = await EntranceInstitute.findOne({_id : institute_id});

    if (!institute){
      return res.status(404).json({message: "Institute not found !"});
    }
    
    res.status(200).json(institute);
  } catch(error){
    console.error("Error fetching institute for user: ", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

