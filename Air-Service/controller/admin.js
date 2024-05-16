const dotenv = require('dotenv');
const crypt = require('crypto-js');
const jwt = require('jsonwebtoken');
const accountPool = require('../config/accountDB.js');
const airPool = require('../config/airDB.js');
const crypto = require('../utils.js');

dotenv.config();

const secret = process.env.secret;


const adminSignup = async (req, res) => {
    try{
        accountPool.query('BEGIN') ;
        console.log("adminSignup");
        const obj = {"company":"Bangladesh Biman","type":"Air Service","type_id":1,"password":"biman_bangladesh" } ;
        req.body = obj ;
        console.log(req.body) ;


        ///////
        const query1 = {
            text : 'SELECT * FROM "admin" WHERE company = $1' ,
            values : [obj.company]
        };
        const result = await accountPool.query(query1) ;
        const admin = result.rows[0] ;

        if(admin) {
            console.log("Admin already exists") ;
            res.status(409).json({message: "Admin already exists"}) ;

            return ;

        }

        console.log("Admin not found ! will insert") ;
        const query = {
            text: 'INSERT INTO "admin" (company,type,type_id,password) VALUES ($1,$2,$3,$4)',
            values: [obj.company,obj.type,obj.type_id,obj.password = crypto.saltHashPassword(obj.password,obj.company)]
        };

        const result2 = await accountPool.query(query);
        console.log("Admin inserted") ;
        accountPool.query('COMMIT') ;
        res.status(200).json({message: "Admin inserted"}) ;
    }catch(err) {
        await accountPool.query('ROLLBACK') ;
        console.log(err) ;
        res.status(500).json({message: "Internal Server Error"}) ;
    }
}

const adminLogin = async (req, res) => {
    try{
        console.log("adminLogin") ;
        const obj = {"company":"Bangladesh Biman","password":"biman_bangladesh"} ;
        req.body = obj ;
        console.log(req.body) ;

        const query = {
            text: 'SELECT * FROM "admin" WHERE company = $1',
            values: [obj.company]
        };

        const result = await accountPool.query(query);
        const admin = result.rows[0];
        if (!admin) {
            console.log("Admin not found") ;
            res.status(404).json({message: "Admin not found"}) ;
            return ;
        }

        console.log("Admin found ! will compare password") ;
        const passwordHash = crypto.saltHashPassword(obj.password,obj.company);
        if (passwordHash != admin.password) {
            console.log("Password does not match") ;
            res.status(401).json({message: "Password does not match"}) ;
            return ;
        }

        console.log("Password matches") ;
        const token = jwt.sign({ company: admin.company }, secret, { expiresIn: '1h' });
        console.log("Token generated") ;
        res.status(200).json({message: "Login Successful", admin , token: token}) ;
    }catch(err) {
        console.log(err) ;
        res.status(500).json({message: "Internal Server Error"}) ;
    }
};

module.exports = {adminSignup, adminLogin,} ;