export const formatPrice = (price) => {
  return Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
  }).format(price);
};
