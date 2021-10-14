exports.requiredLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    console.log(req.session);
    return next();
  } else {
    return res.redirect("/login");
  }
};
