module.exports = (req, res, next) => {
    if (!req.session || !req.session.user) {
      console.log("Session missing before file upload!");
      return res.status(401).json({ error: "Session data missing. Please log in again." });
    }
  
    console.log("Session exists before multer:", req.session.user);
    next();
  };
  