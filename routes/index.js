var express = require('express');
var router = express.Router();
/*
*Input Field Value Validator 
*/
const validator = require('express-validator');
/*
*Encript Data 
*/
var bcrypt = require('bcrypt');
/*
*Custom table modules
*/
const users = require('../models/users.js');
/*
*Variable MD5 Encription
*/
const md5 = require('md5');
/*
*Express-jwt Auth 
*/
const jwt = require('jsonwebtoken');
/*
*Config File Access
*/
const config = require('../config.js');
/*
*Virtual Mechin 
*/
const AWS = require('../aws.js');
/*
*Input Validation 
*/
const { body } = require('express-validator/check');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const { check, validationResult } = require('express-validator/check');

/*
*API URL for register new user
*@Params:name,company,mobile,email,password
*email: is unique
*/
router.post(
          '/register/add',
          [
            // username must be an email
            check('email').isEmail(),
            check('name').not().isEmpty(),
            check('company').not().isEmpty(),
            check('mobile').not().isEmpty(),
            check('mobile').isLength({ min: 10,max:12 }),
            // password must be at least 5 chars long
            check('password').isLength({ min: 5 })
          ], 
          function(req, res, next) {

              var error = true;
              var message = '';
              const errors = validationResult(req);

              if (!errors.isEmpty()) {
                //return res.status(422).json({ errors: errors.array() });
                res.send(errors.array());

              }else{

                //users.sync({ force: true });//Developer porpus
                var hash = md5(req.body.password);

                users.create({

                  user_name: req.body.name,
                  company: req.body.company,
                  mobile: req.body.mobile,
                  email: req.body.email,
                  password: hash,
                  virtual_instance: false
                }).then(function(result){

                  var data = {status:true,message:'successfuly registered'};
                  res.send(data);

                }).catch(function(error){

                  //res.send(error.errors[0].message);
                  var data = {status:error.errors[0].status,message:error.errors[0].message};
                  res.send(data);

                });

              }
});

/*
*API URL for login new user
*email,password
*email: is unique
*/
router.post(
    '/login',
    [
      // username must be an email
      check('email').isEmail(),
      check('password').isLength({ min: 5 })
    ],
    function(req,res,next){ 

      const errors = validationResult(req);

      if (!errors.isEmpty()) {

        res.send(errors.array());

      }else{

          var password = md5(req.body.password);

          users.findOne({
            where: {
            email: req.body.email,
            password:password
            }
          }).then(function(result) {
            
            // project will be the first entry of the Projects table with the title 'aProject' || null
            if(result)
            {
        
              var token = jwt.sign({ id: result.id },config.secret, {//config.secret
                expiresIn: 86400 // expires in 24 hours
              });

              var data = {status:true,message:'success',token:token};

              //Virtual Mechin initiating
              if(result.virtual_instance != true)
              {
                users.update({
                  virtual_instance: true,
                }, {
                  where: {
                    id: result.id
                  }
                }).then(function(result){
                  AWS();
                  res.send(data);
                });

                
              }else{

                res.send(data);
              }
              
            }else{
              
              var data = {status:false,message:'Email or Password not matching!'};
              res.send(data);
            }

          }).catch(function(error){res.send(error);});

      }
});

/* Default Page API*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

/* GET Login page. */
router.get('/register', function(req, res, next) { 
  res.render('register', { title: 'Bridge-Register' });
});

//Redirect Logined USer
router.post('/islogined', function(req, res, next) { 

  jwt.verify(req.body.token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    res.status(200).send(decoded);
  }); 
});

/* GET Dashboard page. */
router.get('/dashboard', function(req, res, next) { 

  res.render('dashboard', { title: 'Dashboard' });

});


module.exports = router;
