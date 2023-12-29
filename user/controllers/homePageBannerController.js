exports.createBanner = (req, res) => {
  try {
    { }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};