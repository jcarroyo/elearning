var express = require('express'),
    router = express.Router(),
    CoachService = require('../../businessLogic').CoachService,
    util = require('util'),
    mLogger = require('../../libs/logger');

router.get('/', function(req, res, next) {
    CoachService.getCoaches().then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot retrieve coaches", {
                error: error.toString()
            });
            return res.msend(-1);
        }
    );
})

router.post('/', function(req, res, next) {
    var coach = req.body;
    CoachService.saveCoach(coach).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "Cannot create coach", {
                error: error.toString(),
                coach: coach
            });
            return res.msend(-1);
        }
    );
})

router.put('/:coachID', function(req, res, next) {
    var coachID = req.params.coachID,
        coach = req.body;
    CoachService.updateCoach(coachID, coach).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "", {
                error: error.toString(),
                coachID: coachID,
                coach: coach
            });
            return res.msend(-1);
        }
    );
})

router.delete('/:coachID', function(req, res, next) {
    var coachID = req.params.coachID;
    CoachService.admRemoveCoach(coachID).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "", {
                error: error.toString(),
                coachID: coachID
            });
            return res.msend(-1);
        }
    );
})

router.get('/:coachID', function(req, res, next) {
    var coachID = req.params.coachID;
    CoachService.getCoachByID(coachID).then(
        function(data) {
            return res.msend(1, data);
        },
        function(error) {
            mLogger.error(mLogger.module.admin, "", {
                error: error.toString(),
                coachID: coachID
            });
            return res.msend(-1);
        }
    );
})

module.exports = router;