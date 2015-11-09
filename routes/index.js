var express = require('express');
var request = require('request');

var router = express.Router();

module.exports = function () {
    router.get('/heartbeat', function (req, res) {
        res.send();
    });

    router.get('/:projectId', function (req, res, next) {
        var options = {
            uri: 'http://projects.qa.clbr.ws/' + req.params.projectId
        };

        request.get(options, function (err, response, body) {
            if (err) {
                next(err);
            }

            if (!response || response.statusCode >= 400) {
                return res.sendStatus(response.statusCode);
            }

            body = JSON.parse(body);

            res.render('index', {
                title: body.name,
                imageUri: body.imageUri,
                description: body.description,
                projectId: req.params.projectId
            });
        });

    });

    return router;
};
