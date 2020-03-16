
import { Container } from "inversify";
import { main, DdbInsert, SnsMail } from "./services/DDBInsert";
import { IMain, IDdb, ISns } from "./Interface/interface";
import TYPES from "./types";


module.exports.test = (event, context, callback) => {

  //console.log("test function");
  //console.log(event);

  console.log(context);

  const json = JSON.parse(event.body);
  //console.log(json);

  const messageId = json["body"]["event-data"]["message"]["headers"]["message-id"];

  //console.log(messageId);

  const DDBTableName = process.env.TableName;
  //console.log('TableName:' + DDBTableName);

  const SnsArn = process.env.StreamArn;
  //console.log('StreamArn:' + SnsArn);

  const eventStatus = json["body"]["event-data"]["event"];
  //console.log('status:' + eventStatus);

  const msgBody = JSON.parse(JSON.stringify((event.body), null, 2));
  //console.log(msgBody);



  var container = new Container();
  type MailerConfig = string;

  container.bind<IMain>(TYPES.IMain).to(main);
  container.bind<IDdb>(TYPES.IDdb).to(DdbInsert);
  container.bind<ISns>(TYPES.ISns).to(SnsMail);

  container.bind<MailerConfig>(TYPES.MailerConfig).toConstantValue(messageId).whenTargetNamed("msgId");
  container.bind<MailerConfig>(TYPES.MailerConfig).toConstantValue(DDBTableName).whenTargetNamed("tableName");
  container.bind<MailerConfig>(TYPES.MailerConfig).toConstantValue(eventStatus).whenTargetNamed("eventStatus");
  container.bind<MailerConfig>(TYPES.MailerConfig).toConstantValue(SnsArn).whenTargetNamed("SnsArn");
  container.bind<MailerConfig>(TYPES.MailerConfig).toConstantValue(msgBody).whenTargetNamed("msgBody");

  var apiInvoke = container.get<IMain>(TYPES.IMain);
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