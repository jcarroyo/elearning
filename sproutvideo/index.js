//http://sproutvideo.com/help/embedding_videos/signed_embed_codes


//http://sproutvideo.com/docs/api.html
var Q = require('q');
var request = require('request-promise');
var nconf = require('nconf');

function Sproutvideo(){
    var api = {
        get baseUrl(){
            return nconf.get("sproutvideo:apiUrl") + nconf.get("sproutvideo:apiVersion");
        },
        get header(){
            return {
                "SproutVideo-Api-Key": nconf.get("sproutvideo:apiKey")
            }
        }
    };

    function video(videoID, method){
        var url = api.baseUrl + '/videos/' + videoID;
        var d = Q.defer();
        var options = {
            url: url,
            method: method,
            headers: api.header,
            json: true
        };
        request(options).then(
            function(data){
                d.resolve(data);
            },
            function(error){
                d.reject(error);
            }
        );
        return d.promise;
    }

    this.getTokenVideoUpload = function(return_url){
        var url = api.baseUrl + '/upload_tokens'
        var d = Q.defer();
        var options = {
            url: url,
            method: 'POST',
            headers: api.header,
            json: {
                'return_url': return_url,
                'seconds_valid': 1200
            }
        };
        request(options).then(
            function(data){
                console.log(data);
                d.resolve(data);
        },
            function(error){
            console.log(error);
            d.reject(error);
        });
        return d.promise;
    }
    /*this.createUserAccount = function(email, password){
        var url = api.baseUrl + '/logins';
        var d = Q.defer();
        var options = {
            url: url,
            method: 'POST',
            headers: api.header,
            json: {
                email: email,
                password: password
            }
        };
        request(options).then(
            function(data){
                d.resolve(data);
            },
            function(error){
                d.reject(error);
            }
        );
        return d.promise;
    }*/
    this.removeVideo = function(videoID){
        return video(videoID, 'DELETE');
    }
    this.getVideo = function(videoID){
        return video(videoID, 'GET');
    }
}

var sprout = new Sproutvideo();

module.exports = sprout;