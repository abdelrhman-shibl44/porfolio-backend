
const mysql = require("mysql2");
require("dotenv").config();
// create pool to connection database
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS
});


// render home page
exports.home = (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) throw err //not connected
      console.log("connected to database from view:" + connection.threadId);
      // user the connection 
    connection.query('SELECT * FROM projects WHERE status = "active"', (err, rows) => {
      // when done with connection realse it 
      connection.release();
      if (!err) {
        const removedProject = req.query.removed || null;
        res.render('home', { rows, removedProject });
      } 
      console.log(err)
    });
  });
}


// render addProjectForm 
exports.form = (req,res) => {
  res.render("addProject")
}

//--------- addNew Project to database----------
exports.add = (req, res) => {
  let { type, name, link,sort_order, description } = req.body
  console.log(type, name, link, description,sort_order)
  type = type.trim();
  name = name.trim();
  link = link.trim();
  description = description.trim();
  let imagePath = null;
  if (req.file) {
      imagePath = req.file.filename
  }
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected database" + connection.threadId);
      const sql = "INSERT INTO projects SET type = ?, name = ?, img = ?, link = ?, sort_order = ?, description = ?";
      connection.query(sql, [type, name,imagePath, link, sort_order, description], (err, result) => {
          connection.release();
          if (!err) {
              res.render("addProject", { alert: `project ${name} successfuly added` });
          } else {
              res.send("Error when adding project");
          };
      });
  });
};
//-------- edit current project -------
exports.edit = (req, res) => {
  pool.getConnection((error, connection) => {
      if (error) throw error
      console.log(`connected to database ${connection.threadId}`)
      const sql = 'SELECT * FROM projects WHERE id = ?'
      connection.query(sql, [req.params.id], (err, rows) => {
          res.render('editProject', { rows });
          console.log('hi im from rows /n' + [...rows])
      })
  })
};
//-------- end edit current project -------
//-------- add project to database -------
exports.update = (req, res) => {
  let { type, name, link,sort_order, description } = req.body
  console.log(type, name, link, description,sort_order)
  type = type.trim();
  name = name.trim();
  link = link.trim();
  description = description.trim();
  let imagePath = null;
  if (req.file) {
      imagePath = req.file.filename
      console.log(imagePath)
  }
  pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("connected database" + connection.threadId);
      const sql = "UPDATE projects SET type = ?, name = ?, img = ? , link = ?, sort_order = ?, description = ? WHERE id = ?";
      connection.query(sql, [type, name,imagePath, link, sort_order, description, req.params.id], (err, result) => {
          connection.release();
          if (!err) {
              pool.getConnection((error, connection) => {
                if(error) throw error
                console.log(`connected to database${connection.threadId}`)
                const sql = `SELECT * FROM projects WHERE id = ?`
                connection.query(sql , [req.params.id],(err,rows)=>{
                  connection.release();
                  if(!err) {
                    res.render("editProject", {rows, alert: `project ${name} successfuly updated` })
                  }else{
                    console.log(err)
                  }
                  console.log(`hello from rows /n ` + rows)
                })
              })
          } else {
              res.send("Error when adding project");
          };
      });
  });
};
//-------- end adding project to database -------
//-------- delete project from database -------
exports.delete = (req, res) => {
  pool.getConnection((error, connection) => {
      if (error) throw error
      console.log(`connected to database ${connection.threadId}`)
      const sql = 'UPDATE projects SET status = ? WHERE id = ?'
      connection.query(sql, ['removed',req.params.id], (err, rows) => {
        connection.release();
        if(!err){
        const removedProject = encodeURIComponent(`${req.query.name} successfully removed`)
            res.redirect(`/?removed=${removedProject}`)
        }else{
          console.log(err)
        }
        console.log("hello i'm the delete one" + rows)
      })
  })
};
//-------- start remove project from database -------
exports.remove = (req, res) => {
  const {id} = req.body
  pool.getConnection((error, connection) => {
      if (error) throw error
      console.log(`connected to database ${connection.threadId}`)
      const sql = 'DELETE FROM projects WHERE id = ?'
      connection.query(sql, [id], (err, rows) => {
        connection.release();
        if(!err){
            res.redirect("/")
        }else{
          console.log(err)
        }
        console.log("hello i'm the delete one" + rows)
      })
    })
  };
  //-------- end reomve project from database -------
  //-------- find projects -------
  exports.find = (req,res) => {
    pool.getConnection((err,connection) => {
      if(err) throw err; 
      console.log("Connected to database" + connection.threadId)
      const {search} = req.body
      const sql = "SELECT * FROM projects WHERE type LIKE ? OR name LIKE ? OR status LIKE ?"
      connection.query(sql,["%" + search + "%","%" + search + "%","%" + search + "%"],(err,rows) => {
        if(!err) {
          res.render("home",{rows});
        }else{
          console.log(err);
        }
        console.log("data from search\n:" + rows)
      })
    })
  }
  //-------- end find projects -------
  // get data as json file 
  exports.data = (req,res) => {
    pool.getConnection((err,connection) => {
      if(err) throw err 
      console.log(`Connected successfully fo database${connection.threadId}`)
      const sql = "SELECT * FROM projects WHERE status = 'active'"
      connection.query(sql,(err,rows) => {
        if(!err) {
          res.status(200).json(rows)
        }else{
          console.log(err)
        }
      })
    })
  }
