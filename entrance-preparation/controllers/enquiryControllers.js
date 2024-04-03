const Enquiry = require("../models/Enquiry");

exports.addEnquiry = async (req, res) => {
    try {
        const { institute_id } = req;
        const {
            enquirer,
            courses,
            mode,
            preferred_time,
            message
        } = req.body

        if (!institute_id) {
            return res.status(404).json({ message: "Specified institute not found" });
        }

        const newEnquiry = new Enquiry({
            enquirer,
            enquired_to : institute_id,
            courses,
            mode,
            preferred_time,
            message
        })

        await newEnquiry.save();
        res.status(201).json({message: "Enquiry added successfully"})
    } catch (error) {
        console.error("Error adding Enquiry")
        res.status(500).json({message : "Internal Server Error"})
    }
}

exports.getEnquiries = async => (req, res) => {
    try {
        console.log("HI")
    } catch(error) {
        console.error("Error getting enquiries")
        res.status(500).json({message: "Internal Server Error"})
    }
}