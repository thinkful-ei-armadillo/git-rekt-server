const express = require("express");
const slackRouter = express.Router();
const parser = express.json();
const slackService = require("./slackService");

slackRouter.route("/").post(parser, async (req, res, next) => {
  const db = req.app.get("db");
  const { user_id, user_name, text } = req.body;

  try {
    const newTicket = {
      description: text,
      user_id: user_name,
      slack_user_id: user_id
    };

    const resp = `Hello ${user_name}, help is on the way!`;
    await slackService.insertUser(db, newTicket);
    
    // This is the payload that we are sending in response to the 
    // student's ticket on slack
    // Hard coding estimated wait time for now.
    res.status(200).json({
      response_type: "in_channel",
      text: resp,
      attachments: [
        {
          text: "  Your estimated wait time is 10 mins"
        }
      ]
    });
  } catch (error) {
    next(error);
  }
});

/*
 This the response we get from slack when users send a help ticket.

  token: 'wR78HWvgKZBnhdTlAgndM3BL',
  team_id: 'THS07P24B',
  team_domain: 'test-k877722',
  channel_id: 'DJ5JSMW0N',
  channel_name: 'directmessage',
  user_id: 'UJ3CMD8UV',
  user_name: 'matth3wn',
  command: '/help-me',
  text: 'react',
  response_url:
   'https://hooks.slack.com/commands/THS07P24B/615952970724/TAqOj3aj0pqHNNlfetS2ldpZ',
  trigger_id: '605100389874.604007784147.c77ed8e54ac737e10dafa77e7858485c'

*/