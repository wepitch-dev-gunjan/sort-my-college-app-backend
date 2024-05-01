exports.getCounsellorAmount = (amount) => {
  let counsellorAmount =
    (10000 * amount) / (10000 + 100 * 18 + 100 * 5 + 18 * 5);

  return counsellorAmount;
};
