const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { booked_entity, booking_type, booking_data, booked_by } = req.body;
    if (!booked_entity || !booking_type || !booking_data) {
      return res.status(400).send({
        error: "Booking fields can't be empty",
      });
    }

    // Ensure booking_data.session_date is a Date object
    if (
      booking_data.session_date &&
      !(booking_data.session_date instanceof Date)
    ) {
      booking_data.session_date = new Date(booking_data.session_date);
    }

    console.log(booked_by);
    const booking = new Booking({
      user: booked_by,
      booked_entity,
      booking_type,
      booking_data,

      //chnages
    });

    await booking.save();
    res.status(200).send(booking);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editBooking = async (req, res) => {
  try {
    const { booking_type, booking_data } = req.body;
    const { booking_id } = req.params;

    const query = {};
    if (booking_type) query.booking_type = booking_type;
    if (booking_data) query.booking_data = booking_data;

    const booking = await Booking.findOneAndUpdate({ _id: booking_id }, query);
    if (!booking)
      return res.status(404).send({
        error: "Booking not found",
      });

    res.status(200).send({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error!!" });
  }
};

// thiss 
exports.getBookings = async (req, res) => {
  try {
    const { user_id } = req;
    const { past, today, upcoming } = req.query;

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    let filter = {};
    if (past || today || upcoming) {
      if (past) {
        filter = { "booking_data.session_date": { $lt: new Date(startOfDay) } };
      }
      if (today) {
        filter = {
          "booking_data.session_date": {
            $gte: new Date(startOfDay.toISOString()),
            $lte: new Date(endOfDay.toISOString()),
          },
        };
      }
      if (upcoming) {
        filter = { "booking_data.session_date": { $gt: new Date(endOfDay) } };
      }
    }
    filter = { ...filter, user: user_id };

    const bookings = await Booking.find(filter).sort({ date: -1 });
    res.status(200).send(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error!!" });
  }
};


exports.getBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findOne({ _id: booking_id });
    if (!booking)
      return res.status(404).send({
        error: "Booking not found",
      });

    res.status(200).send(booking);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findOneAndDelete({ _id: booking_id });
    if (!booking)
      return res.status(404).send({
        error: "Booking not found",
      });

    res.status(200).send({
      message: "Booking deleted successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
