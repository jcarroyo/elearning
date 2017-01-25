var paypal = require('paypal-rest-sdk');
var Q = require('q');
var nconf = require('nconf');

paypal.configure({
    'mode': nconf.get('paypal:mode'),
    'client_id': nconf.get('paypal:client_id'),
    'client_secret': nconf.get('paypal:client_secret')
});

function PayPalCreatePayment(){

    //https://developer.paypal.com/webapps/developer/docs/integration/direct/rest-experience-overview/#create-the-web-experience-profile
    function createWebExperienceProfile(){
        var profile_name = Math.random().toString(36).substring(7);
        var create_web_profile_json = {
            "name": profile_name,
            "presentation": {
                "brand_name": nconf.get("paypal:profile:brand_name"),
                "logo_image": nconf.get("paypal:profile:logo_image"),
                "locale_code": nconf.get("paypal:profile:locale_code")
            },
            "input_fields": {
                "allow_note": true,
                "no_shipping": 1,
                "address_override": 1
            },
            "flow_config": {
                "landing_page_type": "billing",
                "bank_txn_pending_url": "http://www.yeowza.com" //todo
            }
        };
        return create_web_profile_json;
    };

    this.generatePayment = function(product, price, currency, paymentDescription){


        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": nconf.get("paypal:payment:return_url"),
                "cancel_url": nconf.get("paypal:payment:cancel_url")
            },
            "transactions": [{
                "item_list": {
                    "items": [
                    {
                     "name": product,
                     "sku": product,
                     "price": price,
                     "currency": currency,
                     "quantity": 1
                     }
                    ]
                },
                "amount": {
                    "currency": currency,
                    "total": price
                },
                "description": paymentDescription
            }]
        };

        var profile = createWebExperienceProfile();

        var d = Q.defer();

        paypal.webProfile.create(profile, function (error, web_profile) {
            if (error) {
                console.log("webProfile.create", error);
                d.reject(error);
            } else {
                //Set the id of the created payment experience in payment json
                var experience_profile_id = web_profile.id;
                create_payment_json.experience_profile_id = experience_profile_id;

                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        console.log("payment.create", error);
                        d.reject(error);
                    } else {
                        console.log("Create Payment Response");
                        console.log(payment);
                        d.resolve(payment);
                    }
                });
            }
        });
        return d.promise;
    }

    this.executePayment = function(paymentID, payerID){
        var d = Q.defer();
        var details = { "payer_id": payerID };
        paypal.payment.execute(paymentID, details, function (error, payment) {
            if (error) {
                d.reject(error);
            } else {
                d.resolve(payment);
            }
        });
        return d.promise;
    }
}

module.exports = PayPalCreatePayment;