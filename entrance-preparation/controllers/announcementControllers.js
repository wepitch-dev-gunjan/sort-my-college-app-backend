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
        console.error("Error adding Announcements: ", error);
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { institute_id } = req;
        const { announcement_id } = req.params;

        if (!institute_id) {
            return res.status(404).json({ message: "Institute Id not found!" });
        }
        if (!announcement_id) {
            return res.status(404).json({ message: "Announcement Id not found!" });
        }

        const announcement = await Announcement.findOneAndDelete({ _id: announcement_id, institute: institute_id });

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found!" });
        }

        res.status(200).json({ message: "Announcement deleted successfully", data: announcement });

    } catch (error) {
        console.error("Error deleting Announcement: ", error);
        res.status(500).json({ message: "Internal Server Error!!" });
    }
}

