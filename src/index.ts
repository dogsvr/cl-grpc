import { BaseCL, BaseCLC, Msg, sendMsgToWorkerThread} from "@dogsvr/dogsvr/main_thread";
import { createServer, createChannel, createClient } from 'nice-grpc';
import { CommonApiServiceDefinition, CommonApiServiceImplementation, CommonApiReq, CommonApiRes, DeepPartial } from './proto/common_api';

export class GrpcCL extends BaseCL {
    server;

    constructor(public port: number) {
        super();
        this.server = createServer();
        this.server.add(CommonApiServiceDefinition, commonApiServiceImpl);
    }

    async startListen() {
        await this.server.listen('0.0.0.0:' + this.port);
    }
}

const commonApiServiceImpl: CommonApiServiceImplementation = {
    async commonUnaryApi(
        request: CommonApiReq,
    ): Promise<DeepPartial<CommonApiRes>> {
        let reqMsg = new Msg(request.cmdId, 0, request.innerReq);
        let resMsg = await sendMsgToWorkerThread(reqMsg);

        let response: DeepPartial<CommonApiRes> = {
            cmdId: request.cmdId,
            innerRes: resMsg.body as Uint8Array,
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

    async call(msg: Msg): Promise<Msg> {
        let response = await this.client.commonUnaryApi({
            cmdId: msg.cmdId,
            innerReq: msg.body as Uint8Array,
        });
        let resMsg = new Msg(response.cmdId, 0, response.innerRes);
        return resMsg;
    }
}
    
