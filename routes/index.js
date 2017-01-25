module.exports = function(express){

    /**
     *
     * @param {int} status 1 ok, 0 handle error, -1 internal error
     * @param {object} result
     * @param {string} errorMessage
     */
    express.response.msend = function(status, result, errorMessage){
        var o = {
            status: status,
            result: result,
            emsg: status == -1? "Error interno!!!": errorMessage //when is -1 (internal error, don't send explanation to the user)
        };
        if(status == -1){
            this.status(500);
        }
        this.json(o);
    }

    //students
    express.use('/', require('./pages/students'));
    express.use('/api/account', require('./api/account'));
    express.use('/api/catalog', require('./api/catalog'));
    express.use('/api/course', require('./api/course'));

    express.use(function(err, req, res, next){
        if(err) {
            if(err.status){
                res.status(err.status).json(err.message);
            }else {
                res.send(err)
            }
        }
    })

    //admin
    express.use('/admin', function(req, res, next){
        if(process.env.NODE_ENV == "development"){
            return next();
        }

        if(req.url == '/login' && req.method == 'POST'){
            return next();
        }
        if(!req.session.user){
            return res.render('admin/login');
        }
        next();
    });
    express.use('/admin', require('./pages/admin'));
    express.use('/api-admin', function(req, res, next){

        if(process.env.NODE_ENV == "development"){
            return next();
        }

        if(!req.session.user){
            res.status(401).send({status: "forbidden"})
            return;
        }
        next();
    });

    express.use('/api-admin', require('./api-admin/util'));
    express.use('/api-admin/coach', require('./api-admin/coach'));
    express.use('/api-admin/course', require('./api-admin/course'));
    express.use('/api-admin/student', require('./api-admin/student'));
    express.use('/api-admin/support', require('./api-admin/logs'));

    //The 404 Route (ALWAYS Keep this as the last route)
    express.get('*', function(req, res){
        console.log("request invalid route");
        console.log(req.path)
        res.render('404');
    });

};