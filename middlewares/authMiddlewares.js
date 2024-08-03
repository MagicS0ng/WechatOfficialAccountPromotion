async function authMidware (req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};
module.exports = authMidware