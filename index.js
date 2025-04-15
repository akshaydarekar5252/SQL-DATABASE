const { faker, tr } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app=express();
const Path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views',Path.join(__dirname,"/views"));



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: '56@@4567'
  });

  let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.username(), 
      faker.internet.email(),
      faker.internet.password(),
    ];
}


  //inserting new data

  // let q = "INSERT IGNORE INTO user (id, username, email, password) VALUES ?";

  // let data = [];
  // for(let i = 1; i < 100; i++){
  //   data.push(getRandomUser());
  // }





  //home page route


 app.get('/', (req, res) => {
  let q = ` select count(*) from user`; // count the number of rows in the user table
  try{  
      connection.query(q,(err,result) => {
          if (err) throw err;
          let count = result[0]["count(*)"];
          res.render("home.ejs",{count});
        });
    }catch(err){
      console.log(err);
      res.send('some error in database');
    }
  });



  //show route

  app.get("/user",(req,res)=>{
    let q = `select * from user`;
    try{
      connection.query(q,(err,users)=>{
        if(err) throw err;
        res.render("showusers.ejs",{users});
      });
    }catch(err){
      console.log(err);
      res.send('some error in database');
    }
  });


  //edit route 

  app.get("/user/:id/edit",(req,res)=>{
    let { id } = req.params;
    let q = `select * from user where id ='${ id }'`;
    
    try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        let user = result[0];
        res.render("edit.ejs",{user});
      });
    }catch(err){
      console.log(err);
      res.send('some error in database');
    }
  });

//update route

app.patch("/user/:id",(req,res)=>{
  let { id } = req.params;
  let q = `select * from user where id ='${ id }'`;
  let { password : formpass , username : newUsername} = req.body;
  
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
     let user = result[0];
     if(formpass !== user.password){
        res.send("password is not correct");
     }else{
      let q2 = `update user set username = '${newUsername}' where id = '${id}'`;
      connection.query(q2,(err,result)=>{
        if(err) throw err;
        res.redirect("/user");
      });
     }
      
    });
  }catch(err){
    console.log(err);
    res.send('some error in database');
  }
});


 app.listen("8080", ()=>{
    console.log("Server is running on port 8080")
 });






