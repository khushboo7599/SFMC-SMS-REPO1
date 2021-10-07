const { v1: Uuidv1 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
//Twilio Credential
const accountSid="ACcd357e682283f0854935c43c3e327c4e";
const authToken="cf90594b6df9104b3ae56706b80836be";
const client2 = require('twilio')(accountSid, authToken);

//MessageBird Credential
const messagebird = require('messagebird')('XZjkDi18UTDVwU7PNXwsXtI2b');

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.execute = async (req, res) => {
  // decode data
  const data = JWT(req.body);

  logger.info(data);

  try {
    const id = Uuidv1();

    var requestBody = req.body.inArguments[0];
    const to = requestBody.to;
    if(data.inArguments[0].DropdownOptions === 'Twilio')
    {
      client2.messages
      .create({
         body:  data.inArguments[0].Text,
         from: '+18782066477',
         to: to
       })
      .then(message => console.log(message.sid));
    }
    if(data.inArguments[0].DropdownOptions === 'MessageBird')
    {
      var params = {
        'originator': 'TestMessage',
        'recipients': to,
        'body': data.inArguments[0].Text
      };
    
      messagebird.messages.create(params, function (err, response) {
        if (err) {
          return console.log(err);
        }
        console.log(response);
      });
    }

    await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
      {
        keys: {
          Id: id,
          SubscriberKey: data.inArguments[0].contactKey,
        },
        values: {
          Event: data.inArguments[0].DropdownOptions,
          Text: data.inArguments[0].Text,
        },
      },
    ]);
  } catch (error) {
    logger.error(error);
  }

  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.save = async (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.publish = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.validate = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};
