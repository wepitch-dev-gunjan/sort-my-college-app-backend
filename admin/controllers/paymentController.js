const { default: axios } = require("axios");
const Payment = require("../models/Payment");
const instance = require("../services/razorpayConfig");
const { getCounsellorAmount } = require("../helpers/paymentHelpers");
const { default: mongoose } = require("mongoose");
const { ObjectId } = mongoose.Types;
require("dotenv").config();
const { BACKEND_URL } = process.env;

exports.createOrder = async (req, res) => {
  try {
    const { amount, email, name, description, phone_no } = req.body;
    const { id } = req;
    const orderOptions = {
      amount: Number(amount * 100), // amount in paise (e.g., 1000 paise = ₹10)
      currency: "INR",
      payment_capture: 1, // auto-capture the payment
      notes: {
        description,
      },
      receipt: email,
    };

    instance.orders.create(orderOptions, function (err, order) {
      if (err) {
        console.error(err);
        return res.status(501).send(err.message);
      }
      //order.key = process.env.RAZORPAY_KEY_ID;
       order.key = "rzp_test_ZCooGIpAmuf2kS";
      order.name = name;
      order.email = email;
      order.phone_no = phone_no;
      order.description = description;
      res.status(200).send({
        message: "Order successfully created",
        data: order,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error!" });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const {
      payment_to,
      payment_from,
      order_id,
      payment_id,
      amount,
      amount_paid,
      currency,
      created_at,
      entity,
      name,
      email,
      phone_no,
      description,
      status,
      session_type,
    } = req.body;

    const amount_due = getCounsellorAmount(amount);
    let payment = new Payment({
      payment_to,
      payment_from,
      order_id,
      payment_id,
      amount,
      amount_due,
      amount_paid,
      currency,
      created_at,
      entity,
      name,
      email,
      phone_no,
      description,
      status,
      session_type,
    });

    const counsellor = await axios.get(
      `${BACKEND_URL}/counsellor/counsellors/find-one`,
      {
        params: {
          counsellor_id: payment_to,
        },
      }
    );

    if (!counsellor)
      return res.status(404).send({
        error: "Counsellor  not found",
      });

    payment = await payment.save();
    await axios.put(
      `${BACKEND_URL}/counsellor/${payment_to}/update-outstanding-balance`
    );

    res.status(200).send({
      message: "Payment successfully created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { search } = req.query;
    let payments;

    if (search) {
      // If there's a search query, filter payments based on it
      payments = await Payment.find({
        $or: [
          { payment_to: { $regex: search, $options: "i" } },
          { payment_from: { $regex: search, $options: "i" } },
          { order_id: { $regex: search, $options: "i" } },
          { payment_id: { $regex: search, $options: "i" } },
          { amount: { $regex: search, $options: "i" } },
          { amount_due: { $regex: search, $options: "i" } },
          { amount_paid: { $regex: search, $options: "i" } },
          { currency: { $regex: search, $options: "i" } },
          { created_at: { $regex: search, $options: "i" } },
          { entity: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone_no: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
        ],
      });
    } else {
      // If no search query, fetch all payments
      payments = await Payment.find();
    }

    res.status(200).json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getPayment = async (req, res) => {
  const { payment_id } = req.params;
  try {
    const id = await Payment.findOne({ _id: payment_id });
    if (!id) {
      return res.status(404).json({ error: "No payment found with this ID" });
    }

    res.status(200).send(id);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOutstandingBalance = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    const outstandingBalanceAggregation = await Payment.aggregate([
      {
        $match: {
          payment_to: `${counsellor_id}`,
          amount_due: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          outstanding_balance: {
            $sum: "$amount_due",
          },
        },
      },
    ]);

    console.log(outstandingBalanceAggregation);
    const outstandingBalance =
      outstandingBalanceAggregation.length > 0
        ? outstandingBalanceAggregation[0].outstanding_balance
        : 0;
    res.status(200).send({ outstandingBalance });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error " });
  }
};

exports.clearOutstandingbalance = async (req, res) => {
  console.log("hit");
  try {
    const { counsellor_id } = req.params;
    console.log("adasd", counsellor_id);

    const paymentsToUpdate = await Payment.find({
      payment_to: counsellor_id,
      amount_due: { $gt: 0 },
    });

    if (paymentsToUpdate.length <= 0)
      return res.status(400).send({
        error: "There is no payment to update",
      });

    for (const payment of paymentsToUpdate) {
      payment.amount_paid = payment.amount_due;
      payment.amount_due = 0;
      await payment.save();
    }

    res
      .status(200)
      .send({ message: "Outstanding balance cleared successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// exports.paymentForCounsellor = async (req, res) => {
//   const { counsellor_id } = req;

//   try {
//     const payments = await Payment.find({ payment_to: counsellor_id });

//     if (payments.length === 0) return res.status(200).send([]);
//     const massagedData = payments.map((payment) => ({
//       _id: payment._id,
//       payment_to: payment.payment_to,
//       payment_from: payment.payment_from,
//       order_id: payment.order_id,
//       amount: payment.amount,
//       amount_due: payment.amount_due,
//       amount_paid: payment.amount_paid,
//       currency: payment.currency,
//       created_at: payment.created_at,
//       entity: payment.entity,
//       name: payment.name,
//       email: payment.email,
//       phone_no: payment.phone_no,
//       description: payment.description,
//       status: payment.status,
//       session_type: payment.session_type,
//       fees_amount: payment.fees_amount,
//     }));
//     res.status(200).send(massagedData);
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     throw error;
//   }
// };
exports.paymentForCounsellor = async (req, res) => {
  const { counsellor_id } = req;

  try {
    const payments = await Payment.find({ payment_to: counsellor_id });

    if (payments.length === 0) return res.status(200).send([]);

    const massagedData = payments.map((payment) => {
      const fees_amount = (payment.amount/1.23);

      return {
        _id: payment._id,
        payment_to: payment.payment_to,
        payment_from: payment.payment_from,
        order_id: payment.order_id,
        amount: payment.amount,
        amount_due: payment.amount_due,
        amount_paid: payment.amount_paid,
        currency: payment.currency,
        created_at: payment.created_at,
        entity: payment.entity,
        name: payment.name,
        email: payment.email,
        phone_no: payment.phone_no,
        description: payment.description,
        status: payment.status,
        session_type: payment.session_type,
        fees_amount: fees_amount, 
      };
    });

    res.status(200).send(massagedData);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};

// exports.incomeofcounsellor = async (req, res) => {
//   try {
//     const { counsellor_id } = req.params; // Assuming the counselor ID is passed as a URL parameter
//     console.log(counsellor_id);

//     // Check if counselorId is a valid ObjectId
//     if (!counsellor_id) {
//       return res.status(400).json({ error: "Invalid counselor ID" });
//     }

//     const result = await Payment.aggregate([
//       { $match: { payment_to: counsellor_id } },
//       { $group: { _id: "$payment_to", totalIncome: { $sum: "$amount_due" } } },
//     ]);

//     const totalIncome = result.length > 0 ? result[0].totalIncome : 0;

//     res.json({ counsellor_id, totalIncome });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while calculating total income" });
//   }
// };

exports.incomeofcounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params; // Assuming the counselor ID is passed as a URL parameter
    console.log(counsellor_id);

    // Check if counselorId is a valid ObjectId (optional, but recommended)
    if (!counsellor_id) {
      return res.status(400).json({ error: "Invalid counselor ID" });
    }

    const result = await Payment.aggregate([
      { $match: { payment_to: counsellor_id } },
      {
        $group: {
          _id: "$payment_to",
          totalIncome: {
            $sum: { $divide: ["$amount", 1.23] }, // Divide 'amount' by 1.23 before summing
          },
        },
      },
    ]);

    const totalIncome = result.length > 0 ? result[0].totalIncome : 0;

    res.json({ counsellor_id, totalIncome });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while calculating total income" });
  }
};
