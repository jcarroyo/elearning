//https://github.com/onury/grunt-jasmine-nodejs
//https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-jasmine
//http://stackoverflow.com/questions/27154475/jasmine-js-add-source-method-for-test-execution
//http://www.2ality.com/2011/10/jasmine.html

var request = require('request-promise');
var util = require('util');
var base_url = "http://www.techouse.com.pe/api";

function objectContainFields(element, fields){

    if(Array.isArray(element) && element.length > 0){
        element = element[0];
    }

    var contains = true;
    fields.forEach(function(field){
        if(!element.hasOwnProperty(field)){
            console.log("missing fields", field);
            contains = false;
        }
    });
    return contains;
}

describe("Catalog REST API", function() {
    describe("GET /api/catalog/courses", function(){
        it("return catalog courses without page", function(done){
            var url = base_url + "/catalog/courses";
            var options = {
                url: url,
                method: 'GET',
                json: true,
                resolveWithFullResponse: true
            }
            request(options).then(
                function(data){
                    expect(data.statusCode).toBe(200);
                    expect(data.body.status).toBe(1);
                    expect(objectContainFields(data.body.result, ["data", "currentPage", "count", "pages"])).toBeTruthy();
                    expect(objectContainFields(data.body.result.data, ["_id", "title", "friendlyUrlName", "shortDescription", "currency", "price", "images"])).toBeTruthy();
                    done();
                }
            );
        });
        it("return catalog courses of programming", function(done){
            var url = base_url + "/catalog/courses?category=Programación";
            var options = {
                url: url,
                method: 'GET',
                json: true,
                resolveWithFullResponse: true
            }
            request(options).then(
                function(data){
                    expect(data.statusCode).toBe(200);
                    expect(data.body.status).toBe(1);
                    expect(data.body.result.currentPage).toBe(1);
                    expect(objectContainFields(data.body.result, ["data", "currentPage", "count", "pages"])).toBeTruthy();
                    expect(objectContainFields(data.body.result.data, ["_id", "title", "friendlyUrlName", "shortDescription", "currency", "price", "images"])).toBeTruthy();
                    done();
                }
            );
        });
        it("return 0 courses for invalid category", function(done){
            var url = base_url + "/catalog/courses?category=XYZ";
            var options = {
                url: url,
                method: 'GET',
                json: true,
                resolveWithFullResponse: true
            }
            request(options).then(
                function(data){
                    expect(data.statusCode).toBe(200);
                    expect(data.body.status).toBe(1);
                    expect(objectContainFields(data.body.result, ["data", "currentPage", "count", "pages"])).toBeTruthy();
                    expect(data.body.result.data.length).toBe(0);
                    done();
                }
            );
        });

    });
    describe("GET /api/catalog/categories", function(){
        it("return catalog categories", function(done){
            var url = base_url + "/catalog/categories";
            var options = {
                url: url,
                method: 'GET',
                json: true,
                resolveWithFullResponse: true
            };
            request(options).then(
                function(data){
                    expect(data.statusCode).toBe(200);
                    expect(data.body.status).toBe(1);
                    expect(data.body.result.data.length).toBeGreaterThan(0);
                    expect(objectContainFields(data.body.result.data, ["_id", "name"])).toBeTruthy();
                    done();
                }
            )
        });
    });

    describe("GET /api/catalog/course/search", function(){
        it("return courses available with pagination and term", function(done){
            var url = base_url + "/catalog/course/search?q=javascript&page=1";
            var options = {
                url: url,
                method: 'GET',
                json: true,
                resolveWithFullResponse: true
            };
            request(options).then(
                function(data){
                    expect(data.statusCode).toBe(200);
                    expect(data.body.status).toBe(1);
                    expect(data.body.result.currentPage).toBe(1);
                    expect(objectContainFields(data.body.result, ["data", "currentPage", "count", "pages"])).toBeTruthy();
                    expect(objectContainFields(data.body.result.data, ["_id", "title", "friendlyUrlName", "shortDescription", "currency", "price", "images"])).toBeTruthy();
                    done();
                }
            )
        })
    })
});