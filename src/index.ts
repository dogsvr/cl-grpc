import { BaseCL, BaseCLC, Msg, sendMsgToWorkerThread, registerCLFactory, registerCLCFactory, log as rootLog } from "@dogsvr/dogsvr/main_thread";
import { createServer, createChannel, createClient } from 'nice-grpc';
import { CommonApiServiceDefinition, CommonApiServiceImplementation, CommonApiReq, CommonApiRes, DeepPartial, Head } from './proto/common_api';
import { Worker } from "worker_threads"

const log = rootLog.child({ module: "cl-grpc/index" });

export class GrpcCL extends BaseCL {
    server;

    constructor(public port: number) {
        super();
        this.server = createServer();
        this.server.add(CommonApiServiceDefinition, commonApiServiceImpl);
    }

    async startListen() {
        await this.server.listen('0.0.0.0:' + this.port);
        log.info({ port: this.port }, "grpc server started");
    }

    async pushMsg(msg: Msg) {
        log.error("grpc not support pushMsg");
    }
}

const commonApiServiceImpl: CommonApiServiceImplementation = {
    async commonUnaryApi(
        request: CommonApiReq,
    ): Promise<DeepPartial<CommonApiRes>> {
        let reqMsg = new Msg(request.head as Head, request.innerReq);
        let resMsg = await sendMsgToWorkerThread(reqMsg);

        let response: DeepPartial<CommonApiRes> = {
            head: request.head,
            innerRes: resMsg.body as string,
        };
        return response;
    },
};

export class GrpcCLC extends BaseCLC {
    channel;
    client;

    constructor(public address: string) {
        super();
        this.channel = createChannel(address);
        this.client = createClient(CommonApiServiceDefinition, this.channel);
    }

    async callCmd(msg: Msg, thread: Worker | undefined) {
        let response = await this.client.commonUnaryApi({
            head: msg.head,
            innerReq: msg.body as string,
        });
        if (thread) {
            msg.body = response.innerRes;
            thread.postMessage(msg);
        }
    }
}

// Self-register factories when this module is imported
registerCLFactory('grpc', (params) => new GrpcCL(params.port));
registerCLCFactory('grpc', (params) => new GrpcCLC(params.address));
