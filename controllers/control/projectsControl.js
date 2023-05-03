require("dotenv").config();
// create pool to connection database
// render home page
exports.home = (req, res) => {
  res.render('home')
}


// render addProjectForm 
exports.form = (req,res) => {
  res.render("addProject")
}

//--------- addNew Project to database----------
exports.add = (req, res) => {      
  res.render("addProject")
};
//-------- edit current project -------
exports.edit = (req, res) => {
  res.render('editProject')
};
//-------- end edit current project -------
//-------- add project to database -------
exports.update = (req, res) => {
    res.render("editProject")
};
  //-------- end reomve project from database -------
  //-------- find projects -------
  exports.find = (req,res) => {
      res.render("home");
  }
  //-------- end find projects -------
