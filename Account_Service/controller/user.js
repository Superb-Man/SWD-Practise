const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../config/accountDB.js');
const crypto = require('../utils.js');

dotenv.config();

const secret = process.env.secret;

//for testing only to connect to database
//temp-purpose

var mytoken = 'rogue99'
const getInfo_test = async (req, res) => {
    try {
        console.log("getInfo_test");
        const results = await accountPool.query('SELECT * FROM "Temp"');
        res.status(200).json(results.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
}


const userSignUp = async (req, res) => {
    try {
        accountPool.query('BEGIN') ;
        console.log("userSignUp");



        ///////////////////////////
        // console.log(req.body);
        //ekhane change hobe
        // password = crypto.saltHashPassword("t");
        const obj = {"username":"X-33","name":"Toriqe","email":"toriqe@gmail.com","password":"toriqe","phone":"01234","nid":23123,"Date_of_Birth":new Date("1998-12-12")};
        req.body = obj;
        console.log(req.body);
        // console.log(obj.username);
        ///////////////////////////


        const query1 = {
            text: 'SELECT * FROM "clients" WHERE username = $1 OR email = $2 OR phone = $3 OR nid = $4',
            values: [obj.username, obj.email, obj.phone,obj.nid]
        };
        const result1 = await accountPool.query(query1);
        const user = result1.rows[0];
        if (user) {
            console.log("User username already exists");
            // res.redirect('http://localhost:3000/user/login')
            res.status(409).json({ message: 'User already exists' });
            // res.redirect('http://localhost:3000/user/login')
            return;
        }
        console.log("user not found ! will insert")
        // obj.password = crypto.saltHashPassword(obj.password,obj.username);
        const query = {
            text: 'INSERT INTO clients(username, name,password,nid, phone, email,date_of_birth) VALUES($1, $2, $3, $4, $5, $6, $7)',
            values: [obj.username, obj.name,obj.password = crypto.saltHashPassword(obj.password,obj.username), obj.nid, obj.phone, obj.email,obj.Date_of_Birth]
        };
        await accountPool.query(query);
        // Commit transaction
        await accountPool.query('COMMIT');
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        await accountPool.query('ROLLBACK');
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}


//login
const userLogin = async (req, res) => {
    try {
        console.log("userLogin");

        ///////////////////////////
        //ekhane change hobe 
        const obj = {"username":"X-33","password":crypto.saltHashPassword("toriqe","X-33")};
        req.body = obj;
        console.log(req.body);
        ////////////////////////////

        const query = {
            text: 'SELECT * FROM "clients" WHERE username = $1',
            values: [obj.username]
        };
        const result = await accountPool.query(query);
        const user = result.rows[0];
        if (!user) {
            console.log("User not found");
            res.status(401).json({ message: 'User not found' });
            return;
        }
        console.log("user found ! will compare password")
        if (obj.password !== user.password) {
            console.log("Password is incorrect");
            res.status(401).json({ message: 'Password is incorrect' });
            return;
        }
        console.log("password is correct ! will generate token")
        const accesstoken = jwt.sign({ username: user.username }, secret, { expiresIn: '3h' });
        res.status(200).json({ user , accesstoken: accesstoken});
        
        //for temporary purposes
        mytoken = accesstoken;


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const userPasswordResetReq = async (req, res) => {
    const obj = req.body;

    //temporary
    obj.token = mytoken;
    obj.id = 3 ;
    if(!obj.token) {
        return res.status(400).json({message: "Invalid token"});
    }

    jwt.verify(mytoken, secret, async (err, decodedToken) => {
        if(err) {
            console.log(err);
            return res.status(400).json({message: "Invalid token"});
        }
        try{
            // just ekta page e jabe
            res.redirect('http://localhost:3000/user/updatePassword');

        }catch(err){
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}

const userUpdatePassword = async (req, res) => {
    console.log("userUpdatePassword");
    
    const obj = req.body;
    
    //
    obj.token = mytoken;
    obj.user_id = 4 ;
    obj.username = "X-33";
    obj.password = "ARAL";
    obj.password = crypto.saltHashPassword(obj.password,obj.username);
    
    //verify token
    if(!obj.token) {
        return res.status(400).json({message: "Invalid token"});
    }
    jwt.verify(mytoken, secret, async (err, decodedToken) => {
        if(err) {
            console.log(err);
            return res.status(400).json({message: "Invalid token"});
        }
        try {
            accountPool.query('BEGIN') ;
            console.log("userUpdatePassword");

            ///////////////////////////

            const query = {
                text: 'UPDATE "clients" SET password = $1 WHERE user_id = $2',
                values: [obj.password, obj.user_id]
            };
            await accountPool.query(query);
            await accountPool.query('COMMIT');
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (err) {
            await accountPool.query('ROLLBACK');
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

}

module.exports = {
    getInfo_test, //get
    userSignUp, //post
    userLogin, //post
    userPasswordResetReq, //post
    userUpdatePassword, //post
    // userUpdateProfile, //post
    // userProfile, // get
}