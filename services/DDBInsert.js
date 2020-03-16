"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
require("reflect-metadata");
var types_1 = require("../types");
var aws_sdk_1 = require("aws-sdk");
var DdbInsert = /** @class */ (function () {
    function DdbInsert(mail, eventStatus, SnsArn, msgBody) {
        this._mail = mail;
        this._status = eventStatus;
        this._SnsArn = SnsArn;
        this._msgBody = msgBody;
    }
    DdbInsert.prototype.sendsns = function () {
        console.log("control came to sendsns()");
        return this._mail.send(this._status, this._SnsArn, this._msgBody);
    };
    ;
    DdbInsert.prototype.post = function (msgId, tableName) {
        var docClient = new aws_sdk_1.DynamoDB({ region: 'us-east-1' });
        //console.log(msgId);
        //console.log(tableName);
        function insert() {
            return __awaiter(this, void 0, void 0, function () {
                var mId, tName, params;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mId = msgId;
                            tName = tableName;
                            params = {
                                TableName: tName,
                                Item: {
                                    "messageId": {
                                        S: mId
                                    }
                                },
                                ReturnValues: "ALL_OLD"
                            };
                            console.log("params value:" + ":" + params.TableName + ":" + params.Item.messageId.S);
                            console.log("Adding a new item...");
                            return [4 /*yield*/, docClient.putItem(params).promise()
                                    .then(function (data) {
                                    console.log("insert happened successfully, check table");
                                    return data;
                                })["catch"](function (err) {
                                    console.log(err);
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        insert();
        console.log("control after insert");
        this.sendsns();
    };
    DdbInsert = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1["default"].ISns)),
        __param(1, inversify_1.inject(types_1["default"].MailerConfig)), __param(1, inversify_1.named("eventStatus")),
        __param(2, inversify_1.inject(types_1["default"].MailerConfig)), __param(2, inversify_1.named("SnsArn")),
        __param(3, inversify_1.inject(types_1["default"].MailerConfig)), __param(3, inversify_1.named("msgBody"))
    ], DdbInsert);
    return DdbInsert;
}());
exports.DdbInsert = DdbInsert;
var SnsMail = /** @class */ (function () {
    function SnsMail() {
    }
    SnsMail.prototype.send = function (eventStatus, SnsArn, msgBody) {
        var SNSClient = new aws_sdk_1.SNS();
        var status = eventStatus;
        var Arn = SnsArn;
        console.log(msgBody);
        var mBody = JSON.parse(JSON.stringify(msgBody, null, 2));
        function send() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('inside send of SNSMail class');
                            console.log('------------------------------');
                            console.log(status);
                            console.log(Arn);
                            console.log(mBody);
                            if (!(status == 'delivered')) return [3 /*break*/, 2];
                            console.log('inside if');
                            return [4 /*yield*/, SNSClient.publish({
                                    Message: mBody,
                                    Subject: 'Message has been delivered ',
                                    TopicArn: Arn
                                }).promise()
                                    .then(function (data) {
                                    console.log("mail sent successfully");
                                    return data;
                                })["catch"](function (err) {
                                    console.log(err);
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(eventStatus == 'opened')) return [3 /*break*/, 4];
                            return [4 /*yield*/, SNSClient.publish({
                                    Message: mBody,
                                    Subject: 'Message has been opened ',
                                    TopicArn: Arn
                                }).promise()
                                    .then(function (data) {
                                    console.log("mail sent successfully");
                                })["catch"](function (err) {
                                    console.log(err);
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        send();
    };
    SnsMail = __decorate([
        inversify_1.injectable()
    ], SnsMail);
    return SnsMail;
}());
exports.SnsMail = SnsMail;
var main = /** @class */ (function () {
    function main(iDdb, 
    // @inject(TYPES.Warrior2) sns: Warrior2,
    msgId, eventStatus, tableName) {
        this._iDdb = iDdb;
        this._msgId = msgId;
        this._tableName = tableName;
        //this._sns = sns;
        this._status = eventStatus;
    }
    main.prototype.main = function () { return this._iDdb.post(this._msgId, this._tableName); };
    ;
    main = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1["default"].IDdb)),
        __param(1, inversify_1.inject(types_1["default"].MailerConfig)), __param(1, inversify_1.named("msgId")),
        __param(2, inversify_1.inject(types_1["default"].MailerConfig)), __param(2, inversify_1.named("eventStatus")),
        __param(3, inversify_1.inject(types_1["default"].MailerConfig)), __param(3, inversify_1.named("tableName"))
    ], main);
    return main;
}());
exports.main = main;
