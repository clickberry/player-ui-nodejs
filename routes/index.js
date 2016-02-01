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

            var projectId = req.params.projectId;
            var schema = config.get('portal:protocol') + '://';
            var portalUri = schema + config.get('portal:host');
            var videoUri = portalUri + config.get('portal:videoPath') + '/' + projectId;
            var playerUri = schema + config.get('portal:playerHost') + config.get('portal:playerPath') + '/' + projectId;

            if (!response || response.statusCode >= 400) {
                return res.redirect(301, portalUri);
            }

            body = JSON.parse(body);

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
