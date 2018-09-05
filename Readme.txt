INSTALLETION NOTE
--------------------
Step 1:-  Mysql Database installation : install data base "node_module" placed in the folder 'DataBase'.

Step 2:- Install npm through terminal to the location where project file is added (Eg: /c/xampp/htdocs/custome-node)
$ npm install 

Step 3:- Configuration of Data Base : open models/user.js. and set the variable 
var sequelize = new Sequelize("mysql://<username>:<password>@<localhistIP>/<database>");

Step 4:- VM settings: Open config.json file set new VM credential
Eg: { "accessKeyId":  "DDDRBURI4T2E7ZKXA", "secretAccessKey": "9viQEkwJNKJBkhbhjbhJHHJVjVjGKHYFI", "region": "us-east-1" }
Open aws.js file: and edit 
  // AMI is amzn-ami-2011.09.1.x86_64-ebs
  var instanceParams = {
    ImageId: 'ami-124dfdhdfdfj75a5', // Replace custom AMI ID
    InstanceType: 't1.micro',
    KeyName: 'test.pem',// Custom Key name
    MinCount: 1,
    MaxCount: 1
  };

Step 5:- Run 'nodemon index.js' from file path through terminal

Step 6:- Open localhost:3000 in browser