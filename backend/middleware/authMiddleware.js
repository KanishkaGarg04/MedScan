const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {

    console.log("Authorization Header:", req.header("Authorization"));

    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(401).json({
      message: "Invalid token",
    });

  }
};