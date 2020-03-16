import { injectable, inject, named } from "inversify";
import "reflect-metadata";

import TYPES from "../types";
import { IMain, ISns, IDdb } from "../Interface/interface";

import { DynamoDB, SNS } from "aws-sdk";


@injectable()
class DdbInsert implements IDdb {

    private _mail: ISns;
    private _status: string;
    private _SnsArn: string;
    private _msgBody: string;



    constructor(@inject(TYPES.ISns) mail: ISns,
        @inject(TYPES.MailerConfig) @named("eventStatus") eventStatus: string,
        @inject(TYPES.MailerConfig) @named("SnsArn") SnsArn: string,
        @inject(TYPES.MailerConfig) @named("msgBody") msgBody: string) {
        this._mail = mail;
        this._status = eventStatus;
        this._SnsArn = SnsArn;
        this._msgBody = msgBody;
    }

    public sendsns() {
        console.log("control came to sendsns()");

        return this._mail.send(this._status, this._SnsArn, this._msgBody);
    };

    post(msgId: string, tableName: string) {
        var docClient = new DynamoDB({ region: 'us-east-1' });

        //console.log(msgId);
        //console.log(tableName);
        async function insert() {
            const mId = msgId;
            const tName = tableName;
            var params = {
                TableName: tName,
                Item: {
                    "messageId": {
                        S: mId
                    }

                },
                ReturnValues: "ALL_OLD",
            };

            console.log("params value:" + ":" + params.TableName + ":" + params.Item.messageId.S);
            console.log("Adding a new item...");

            await docClient.putItem(params).promise()
                .then(function (data) {
                    console.log("insert happened successfully, check table");
                    return data;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        insert();
        console.log("control after insert")
        this.sendsns();


    }
}
@injectable()
class SnsMail implements ISns {
    public send(eventStatus: string, SnsArn: string, msgBody: string) {

        var SNSClient = new SNS();

        const status = eventStatus;
        const Arn = SnsArn;
        console.log(msgBody);
        const mBody = JSON.parse(JSON.stringify(msgBody, null, 2));



        async function send() {
            console.log('inside send of SNSMail class');
            console.log('------------------------------');
            console.log(status);
            console.log(Arn);
            console.log(mBody);
            if (status == 'delivered') {
                console.log('inside if');

                await SNSClient.publish({
                    Message: mBody,
                    Subject: 'Message has been delivered ',
                    TopicArn: Arn
                }).promise()
                    .then(function (data) {
                        console.log("mail sent successfully");
                        return data;
                    })
                    .catch(function (err) {
                        console.log(err);
                    });




            } else if (eventStatus == 'opened') {
                await SNSClient.publish({
                    Message: mBody,
                    Subject: 'Message has been opened ',
                    TopicArn: Arn
                }).promise()
                    .then(function (data) {
                        console.log("mail sent successfully");

                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        }
        send();

    }
}




@injectable()
class main implements IMain {


    private _msgId: string;
    private _tableName: string;
    private status: string;
    private _iDdb: IDdb;
    //private _sns: Warrior2;
    private _status: string;

    public constructor(

        @inject(TYPES.IDdb) iDdb: IDdb,
        // @inject(TYPES.Warrior2) sns: Warrior2,
        @inject(TYPES.MailerConfig) @named("msgId") msgId: string,
        @inject(TYPES.MailerConfig) @named("eventStatus") eventStatus: string,
        @inject(TYPES.MailerConfig) @named("tableName") tableName: string


    ) {

        this._iDdb = iDdb;
        this._msgId = msgId;
        this._tableName = tableName;
        //this._sns = sns;
        this._status = eventStatus;

    }



    public main() { return this._iDdb.post(this._msgId, this._tableName); };





}

export { main, DdbInsert, SnsMail };