export interface IMain {
    main(): void;
}

export interface IDdb {
    post(msgId: string, tableName: string): void;
    sendsns(): void;

}

export interface ISns {
    send(eventStatus: string, SnsArn: string, msgBody: string): void
}



