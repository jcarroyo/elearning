//https://nodejs.org/api/crypto.html
var crypto = require('crypto');
var nconf = require('nconf');

function SecurityHelper(){
    var security = {
        algorithm: nconf.get("security:algorithm"),
        secretKey: nconf.get("security:secretKey"),
        digest: nconf.get("security:digest")
    };

    this.obfuscatePassword = function(password){
        try{
            password = password || "";
            var hash = crypto.createHmac(security.algorithm, security.secretKey);
            var d = hash.update(password).digest(security.digest);
            return d;
        }
        catch(e){
            console.log(e);
            return null;
        }
    }
}

var securityHelper = new SecurityHelper();

module.exports = securityHelper;