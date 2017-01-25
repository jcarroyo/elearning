//http://eddywashere.com/blog/switching-out-callbacks-with-promises-in-mongoose/
var models = require('../../models').models,
    security = require('../../libs/security'),
    Q = require('q');

var login = function(loginName, password){
    var d = Q.defer();
    existAdminAccount(loginName, null).then(
        function(adminAccount){
            if(adminAccount.length){
                var admin = adminAccount[0];
                var obfuscatePassword = security.obfuscatePassword(password);
                return admin.password == obfuscatePassword? d.resolve(adminAccount) : d.reject("Wrong login or password");
            }
            return d.reject("Wrong login or password");
        },
        function(error){
            return d.reject(error);
        }
    );
    return d.promise;
}

var existAdminAccount = function(login, email){
    var filter = {
        $or: [
            {login: login},
            {email: email}
        ]
    };
    return models.Admin.find(filter).exec();
}

var createAdmin = function(admin){
    var d = Q.defer();

    existAdminAccount(admin.login, admin.email).then(
        function(adminAccount){
            if(adminAccount.length){
                return d.reject("Account already exists");
            }

            var newAdmin = new models.Admin({
                name: admin.name,
                login: admin.login,
                email: admin.email,
                password: security.obfuscatePassword(admin.password)
            });
            newAdmin.save(function(err){
                if(err){
                    return d.reject(err);
                }
                return d.resolve(true);
            });
        },
        function(error){
            return d.reject(error);
        }
    );
    return d.promise;
}

var updatePassword = function(id, oldPassword, newPassword){

}

module.exports = {
    login: login,
    createAdmin: createAdmin,
    updatePassword: updatePassword
}

