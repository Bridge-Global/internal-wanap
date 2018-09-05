var Sequelize = require('sequelize');
var sequelize = new Sequelize("mysql://root:123456@127.0.0.1:3306/node_module");

var users = sequelize.define('users', {
    mobile: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
     user_name : Sequelize.STRING,
     company : Sequelize.STRING,
     password:Sequelize.STRING,
     virtual_instance:Sequelize.BOOLEAN,
  });
 

   module.exports  = users;
