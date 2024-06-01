exports.getCounsellorAmount = (amount) => {
  let counsellorAmount =
    // (10000 * amount) / (10000 + 100 * 18 + 100 * 5 + 18 * 5);
    amount *
    0.8130081300813008130081300813008130081300813008130081300813008130081300813;

  return counsellorAmount;
};
