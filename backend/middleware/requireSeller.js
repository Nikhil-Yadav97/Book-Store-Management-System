export const requireSeller = (req, res, next) => {
  if (req.user.role !== "Owner") {
    return res.status(403).json({ message: "Seller access required" });
  }
  next();
};
