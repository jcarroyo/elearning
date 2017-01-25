var AccountService = require('../businessLogic').AccountService,
    types = require('../models').types,
    securityHelper = require('./security');
    Q = require('q');

/**
 *
 * @param {Object} loginAccount
 * @param {string} loginAccount.email
 * @param {string} loginAccount.password
 * @returns {{login: login, errorMessage}}
 * @constructor
 */
function LoginLogic(loginAccount){
    var message = "";
    function login(){
        var d = Q.defer();
        AccountService.accountExists(loginAccount.email).then(
            function(account){
                if(!account){
                    message = "The account doesn't exists";
                    return d.resolve(false);
                }
                if(account.status == types.StudentStatus.pendingToActivate){
                    message = "Please, activate your account first";
                    return d.resolve(false);
                }
                if(account.status == types.StudentStatus.lock){
                    message = "The account is locked";
                    return d.resolve(false);
                }
                var obfuscatePassword = securityHelper.obfuscatePassword(loginAccount.password);
                if(!(account.password == obfuscatePassword)){
                    message = "Wrong password";
                    return d.resolve(false);
                }
                AccountService.updateLastLogin(account.id);
                return d.resolve({
                    id: account._id,
                    name: account.name,
                    email: account.email
                });
            },
            function(error){
                d.reject(error);
            }
        );
        return d.promise;
    }
    var _public = {
        login: login,
        get errorMessage(){
            return message
        }
    };
    return _public;
}
module.exports = LoginLogic;