import { BaseCL, BaseCLC, Msg, sendMsgToWorkerThread, registerCLFactory, registerCLCFactory, getSpanSink, log as rootLog, type Log } from "@dogsvr/dogsvr/main_thread";
import { createServer, createChannel, createClient, CallContext, Metadata } from 'nice-grpc';
import { setLogger, setLogVerbosity, logVerbosity } from '@grpc/grpc-js';
import { CommonApiServiceDefinition, CommonApiServiceImplementation, CommonApiReq, CommonApiRes, DeepPartial, Head } from './proto/common_api';
import { Worker } from "worker_threads"

/** grpc-js LogVerbosity keys: "DEBUG" | "INFO" | "ERROR" | "NONE". */
type GrpcLogLevel = keyof typeof logVerbosity;

const log = rootLog.child({ module: "cl-grpc/index" });

function adaptForGrpc(target: Log) {
    return {
        debug: (...args: unknown[]) => target.debug({grpc: args}),
        info:  (...args: unknown[]) => target.info ({grpc: args}),
        error: (...args: unknown[]) => target.error({grpc: args}),
    };
}

let grpcLoggerInstalled = false;
let installedVerbosity = logVerbosity.NONE;
/** grpc-js setLogger/setLogVerbosity is module-global; coexisting CL/CLC instances widen to the most verbose level. */
function ensureGrpcLogger(level: GrpcLogLevel): void {
    const v = logVerbosity[level];
    if (!grpcLoggerInstalled) {
        grpcLoggerInstalled = true;
        setLogger(adaptForGrpc(rootLog.child({ module: "grpc-js" })));
        installedVerbosity = v;
        setLogVerbosity(v);
        return;
    }
    if (v < installedVerbosity) {
        installedVerbosity = v;
        setLogVerbosity(v);
    }
}

export interface GrpcCLParams {
    port: number;
    /** grpc-js LogVerbosity key. Default 'ERROR'. */
    log?: { level?: GrpcLogLevel };
}

export interface GrpcCLCParams {
    address: string;
    /** grpc-js LogVerbosity key. Default 'ERROR'. */
    log?: { level?: GrpcLogLevel };
}

export class GrpcCL extends BaseCL {
    server;

    constructor(public params: GrpcCLParams) {
        super();
        ensureGrpcLogger(params.log?.level ?? "ERROR");
        this.server = createServer();
        this.server.add(CommonApiServiceDefinition, commonApiServiceImpl);
    }

    async startListen() {
        await this.server.listen('0.0.0.0:' + this.params.port);
        log.info({ port: this.params.port }, "grpc server started");
    }

    async pushMsg(msg: Msg) {
        log.error("grpc not support pushMsg");
    }
}

const commonApiServiceImpl: CommonApiServiceImplementation = {
    async commonUnaryApi(
        request: CommonApiReq,
        context: CallContext,
    ): Promise<DeepPartial<CommonApiRes>> {
        const sink = getSpanSink();
        const carrier: Record<string, string> = {};
        for (const [k, v] of context.metadata) {
            if (typeof v === 'string') carrier[k] = v;
        }
        const parentCtx = sink.extract(carrier);
        const span = sink.start(`grpc.${request.head?.cmdId ?? 0}`, parentCtx, {
            'rpc.system': 'grpc',
            'rpc.cmd_id': request.head?.cmdId ?? 0,
        });

        return sink.withActive(span, async () => {
            let ok = false;
            try {
                let reqMsg = new Msg(request.head as Head, request.innerReq);
                let resMsg = await sendMsgToWorkerThread(reqMsg);
                let response: DeepPartial<CommonApiRes> = {
                    head: request.head,
                    innerRes: resMsg.body as string,
                };
                ok = true;
                return response;
            } catch (err) {
                span.recordException(err);
                throw err;
            } finally {
                span.end(ok);
            }
        });
    },
};

export class GrpcCLC extends BaseCLC {
    channel;
    client;

    constructor(public params: GrpcCLCParams) {
        super();
        ensureGrpcLogger(params.log?.level ?? "ERROR");
        this.channel = createChannel(params.address);
        this.client = createClient(CommonApiServiceDefinition, this.channel);
    }

    async callCmd(msg: Msg, thread: Worker | undefined) {
        const sink = getSpanSink();
        const span = sink.getCurrent();
        const metadata = new Metadata();
        if (span) {
            const carrier: Record<string, string> = {};
            sink.inject(span, carrier);
            for (const k of Object.keys(carrier)) metadata.set(k, carrier[k]);
        }
        let response = await this.client.commonUnaryApi(
            { head: msg.head, innerReq: msg.body as string },
            { metadata },
        );
        if (thread) {
            msg.body = response.innerRes;
            thread.postMessage(msg);
        }
    }
}

registerCLFactory('grpc', (params) => new GrpcCL(params as GrpcCLParams));
registerCLCFactory('grpc', (params) => new GrpcCLC(params as GrpcCLCParams));
