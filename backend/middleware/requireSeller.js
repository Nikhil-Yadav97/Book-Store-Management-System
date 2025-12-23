export const requireSeller = (req, res, next) => {
  if (req.user.role !== "Owner") {
    // convt js obj to json response
    return res.status(403).json({ message: "Owner access required" });
  }
  // if condition is true it doesnt pass to next middleware
  next();
};
