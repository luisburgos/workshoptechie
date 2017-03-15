'use strict'

const request = require('request')
const token = process.env.FB_PAGE_ACCESS_TOKEN

var data = require('./data.json');

module.exports = {

    sendTextMessage: function(sender, textToSend) {

        let messageData = {
            recipient: {
                id: sender
            },
            message: {
                text: textToSend
            }
        }

        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: token
            },
            method: 'POST',
            json: messageData

        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
            } else {
                console.error("Unable to send message.");
                console.error(response);
                console.error(error);
            }
        });
    },

    sendCalendarMessage: function(sender) {
        //TODO: Improve data loading
        const firstOption = {
          "title": data[0].name,
          "subtitle": data[0].responsable,
          "date": data[0].date,
          "startTime": data[0].startTime,
          "endTime": data[0].endTime
        }
        const secondOption = {
            "title": data[1].name,
            "subtitle": data[1].responsable,
            "date": data[1].date,
            "startTime": data[1].startTime,
            "endTime": data[1].endTime
        }

        let messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": firstOption.title,
                            "subtitle": (firstOption.subtitle + "\n" + firstOption.date + "\n" + "De " + firstOption.startTime + " a " + firstOption.endTime),
                            "image_url": "https://raw.githubusercontent.com/AdrianLeyva/workshop-technology/master/Imagenes/logo.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Gracias",
                                    "payload": "Gracias"
                                }
                            ]
                        },
                        {
                          "title": secondOption.title,
                          "subtitle": (secondOption.subtitle + "\n" + secondOption.date + "\n" + "De " + secondOption.startTime + " a " + secondOption.endTime),
                            "image_url": "https://raw.githubusercontent.com/AdrianLeyva/workshop-technology/master/Imagenes/logo.png",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Gracias",
                                    "payload": "Gracias"
                                }
                            ]
                        }
                    ]
                }
            }
        }

        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: token
            },
            method: 'POST',
            json: {
                recipient: {
                    id: sender
                },
                message: messageData
            }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
            } else {
                console.error("Unable to send message.");
                console.error(response);
                console.error(error);
            }
        });
    }

};
