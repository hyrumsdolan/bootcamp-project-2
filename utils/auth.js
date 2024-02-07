const withAuth = (req, res, next) => {
  // redirect user to login, if not logged in
  if (!req.session.logged_in) {
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = withAuth;
