const Announcement = require("../models/Announcement");
const axios = require("axios");
require("dotenv").config();
const { BACKEND_URL } = process.env;

exports.getAnnouncements = async (req, res) => {
    try {
        const { institute_id } = req;
        const allAnnouncements = await Announcement.find({institute:institute_id})
        if (!allAnnouncements) {
            return res.status(404).json({ message: "Announcements not found" });
          }
        res.status(200).json(allAnnouncements);
        
    } catch (error) {
        console.error("Error getting Key Announcements: ", error);
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

exports.addAnnouncements = async (req, res) => {
    try {
        const { institute_id } = req
        const { update } = req.body

        if (!institute_id) {
            return res.status(404).json({message: "Institute Id not found!"})     
        }

        if (!update) {
            return res.status(404).json({message: "Update not found!"})     
        }

        const announcement = new Announcement({
            institute : institute_id,
            update
        })

        const newAnnouncement = await announcement.save();
        console.log(newAnnouncement)
        res.status(201).json({ message: "Announcement added successfully", data: newAnnouncement});

    } catch (error) {
        console.error("Error adding Key Announcements: ", error);
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

