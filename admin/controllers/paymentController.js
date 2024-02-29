const instance = require('../services/razorpayConfig');

exports.postPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const { email } = req;
    const orderOptions = {
      amount: Number(amount * 100), // amount in paise (e.g., 1000 paise = ₹10)
      currency: 'INR',
      payment_capture: 1, // auto-capture the payment
      notes: {
        description: 'Test Payment'
      },
      receipt: email,

    };

    instance.orders.create(orderOptions, function (err, order) {
      if (err) {
        console.error(err);
        return res.status(501).send(err.message);
      }
      console.log(order);
    });

    res.status(200).send({
      message: "Payment successfully created"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};