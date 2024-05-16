var crypto = require('crypto'); 

var genRandomString = function(length){ 
    return crypto.randomBytes(Math.ceil(length/2)) 
    .toString('hex') 
    .slice(0,length); 
}; 
var sha256 = function(password, salt){ 
    var hash = crypto.createHmac('sha256', salt); 
    hash.update(password); 
    var value = hash.digest('hex'); 
    return { salt:salt, passwordHash:value }; 
}; 
function saltHashPassword(userpassword,username) {
    // var salt = genRandomString(16); 
    var salt = username;
    var passwordData = sha256(userpassword, salt); 
    console.log('UserPassword = '+userpassword); 
    console.log('Passwordhash = '+passwordData.passwordHash); 

    return passwordData.passwordHash;
}
// saltHashPassword('MYPASSWORD'); 
// saltHashPassword('MYPASSWORD');

module.exports = {
    saltHashPassword,
}