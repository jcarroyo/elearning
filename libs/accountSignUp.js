var AccountService = require('../businessLogic').AccountService,
    security = require('./security');
    Q = require('q');

/**
 *
 * @param {object} newAccount
 * @param {string} newAccount.email
 * @param {string} newAccount.password
 * @returns {{createAccount: createAccount, message}}
 * @constructor
 */
function AccountSignUp(newAccount){

    var message = "";

    function createAccount(){
        var d = Q.defer();
        AccountService.accountExists(newAccount.email).then(
            function (result) {
                if(!result) {//doesn't exist
                    AccountService.createStudentAccount({
                        name: newAccount.name,
                        email: newAccount.email,
                        password: newAccount.password
                    }).then(
                        function (account) {
                            return d.resolve(true);
                        },
                        function (error) {
                            return d.reject(error);
                        });
                }else{ //already exists
                    message = "The email is already registered";
                    return d.resolve(false);
                }
            },
            function (error) {
                return d.reject(error);
            }
        );
        return d.promise;
    }

    var _public = {
        createAccount: createAccount,
        get message(){
            return message
        }
    };

    return _public;
}

module.exports = AccountSignUp;