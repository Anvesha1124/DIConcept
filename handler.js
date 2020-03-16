"use strict";
exports.__esModule = true;
var inversify_1 = require("inversify");
var DDBInsert_1 = require("./services/DDBInsert");
var types_1 = require("./types");
module.exports.test = function (event, context, callback) {
    //console.log("test function");
    //console.log(event);
    console.log(context);
    var json = JSON.parse(event.body);
    //console.log(json);
    var messageId = json["body"]["event-data"]["message"]["headers"]["message-id"];
    //console.log(messageId);
    var DDBTableName = process.env.TableName;
    //console.log('TableName:' + DDBTableName);
    var SnsArn = process.env.StreamArn;
    //console.log('StreamArn:' + SnsArn);
    var eventStatus = json["body"]["event-data"]["event"];
    //console.log('status:' + eventStatus);
    var msgBody = JSON.parse(JSON.stringify((event.body), null, 2));
    //console.log(msgBody);
    var container = new inversify_1.Container();
    container.bind(types_1["default"].IMain).to(DDBInsert_1.main);
    container.bind(types_1["default"].IDdb).to(DDBInsert_1.DdbInsert);
    container.bind(types_1["default"].ISns).to(DDBInsert_1.SnsMail);
    container.bind(types_1["default"].MailerConfig).toConstantValue(messageId).whenTargetNamed("msgId");
    container.bind(types_1["default"].MailerConfig).toConstantValue(DDBTableName).whenTargetNamed("tableName");
    container.bind(types_1["default"].MailerConfig).toConstantValue(eventStatus).whenTargetNamed("eventStatus");
    container.bind(types_1["default"].MailerConfig).toConstantValue(SnsArn).whenTargetNamed("SnsArn");
    container.bind(types_1["default"].MailerConfig).toConstantValue(msgBody).whenTargetNamed("msgBody");
    var apiInvoke = container.get(types_1["default"].IMain);
    apiInvoke.main();
    //ninja.sendsns();
    var response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify({
            "message": "Data processed successfully"
        }),
        "isBase64Encoded": false
    };
    console.log(response);
    callback(null, response);
};
