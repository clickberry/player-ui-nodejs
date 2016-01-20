var express = require('express');
var request = require('request');
var config = require('clickberry-config');

var router = express.Router();

module.exports = function () {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.get('/:projectId', function (req, res, next) {
        console.log(config.get('api:projects'));
        console.log(req.params.projectId);

        var options = {
            uri: config.get('api:projects') + '/' + req.params.projectId
        };

        request.get(options, function (err, response, body) {
            if (err) {
                return next(err);
            }

            if (!response || response.statusCode >= 400) {
                return res.redirect(301, config.get('portal:uri'))
            }

            body = JSON.parse(body);

            var projectId = req.params.projectId;
            var schema = config.get('portal:protocol') + '://';
            var videoUri = schema + config.get('portal:host') + config.get('portal:videoPath') + '/' + projectId;
            var playerUri = schema + config.get('portal:playerHost') + config.get('portal:playerPath') + '/' + projectId;

            res.render('index', {
                title: body.name,
                imageUri: body.imageUri,
                description: body.description,
                videoUri: videoUri,
                playerUri: playerUri
            });
        });

    });

    return router;
};
