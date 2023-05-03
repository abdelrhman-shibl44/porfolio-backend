exports.login = (req, res) => {
  res.render("login")
}

// logout
exports.logout = (req,res) => {
  req.session.destroy((err) => {
    if(err) console.log("error destroying session")
    else res.redirect("/login")
  })
}