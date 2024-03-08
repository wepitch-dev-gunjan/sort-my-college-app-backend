const Payment = require('../models/Payment');
const instance = require('../services/razorpayConfig');
require('dotenv').config();

exports.createOrder = async (req, res) => {
  try {
    const { amount, email, name, description, phone_no } = req.body;
    const { id } = req;
    const orderOptions = {
      amount: Number(amount * 100), // amount in paise (e.g., 1000 paise = ₹10)
      currency: 'INR',
      payment_capture: 1, // auto-capture the payment
      notes: {
        description
      },
      receipt: email,

    };

    instance.orders.create(orderOptions, function (err, order) {
      if (err) {
        console.error(err);
        return res.status(501).send(err.message);
      }
      console.log(order);
      order.key = process.env.RAZORPAY_KEY_ID;
      order.name = name;
      order.email = email;
      order.phone_no = phone_no;
      order.description = description;
      res.status(200).send({
        message: "Order successfully created",
        data: order
      })
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const {
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
      status
    } = req.body;
    const { id } = req;

    let payment = new Payment({
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
      status
    })

    payment = await payment.save();
    res.status(200).send({
      message: "Payment successfully created"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { id } = req;
    const { search } = req.query;
    let payments;

    if (search) {
      // If there's a search query, filter payments based on it
      payments = await Payment.find({
        $or: [
          { payment_to: { $regex: search, $options: 'i' } },
          { payment_from: { $regex: search, $options: 'i' } },
          { order_id: { $regex: search, $options: 'i' } },
          { payment_id: { $regex: search, $options: 'i' } },
          { amount: { $regex: search, $options: 'i' } },
          { amount_due: { $regex: search, $options: 'i' } },
          { amount_paid: { $regex: search, $options: 'i' } },
          { currency: { $regex: search, $options: 'i' } },
          { created_at: { $regex: search, $options: 'i' } },
          { entity: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone_no: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } }
        ]
      });
    } else {
      // If no search query, fetch all payments
      payments = await Payment.find();
    }

    res.status(200).json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
