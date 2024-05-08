const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { booked_entity, booking_type, booking_data, booked_by } = req.body;
    if (!booked_entity || !booking_type || !booking_data)
      return res.status(400).send({
        error: "Booking fields can't be empty",
      });

    console.log(booked_by)
    const booking = new Booking({
      user: booked_by,
      booked_entity,
      booking_type,
      booking_data,
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
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { user_id } = req;

    const { past, today, upcoming } = req.query;

    const filter = {};
    if (past) filter.past = past;
    if (today) filter.today = today;
    if (upcoming) filter.upcoming = upcoming;
    filter.user = user_id;

    const bookings = await Booking.find(filter).sort({ date: -1 });
    console.log(bookings)
    if (!bookings) bookings = [];

    res.status(200).send(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
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
