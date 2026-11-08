import { test, before, after } from 'node:test';
import * as assert from 'node:assert/strict';
import { createServer, type Server } from 'nice-grpc';
import { Msg, DogsvrErrCode, registerLogger, type LoggerHub, type LoggerImpl } from '@dogsvr/dogsvr/main_thread';
import { GrpcCLC } from '../dist/index.js';
import { CommonApiServiceDefinition, type Head } from '../dist/proto/common_api.js';

const drop = () => {};
const logger: LoggerImpl = {
    trace: drop, debug: drop, info: drop, warn: drop, error: drop, fatal: drop,
    isLevelEnabled: () => true,
    child: () => logger,
};
const stubHub: LoggerHub = {
    issueWorkerPort: () => undefined,
    releaseWorkerPort: () => {},
    workerInitFor: () => ({}) as ReturnType<LoggerHub['workerInitFor']>,
    bufferedBytes: () => 0,
    flush: () => {},
};

let server: Server;
let peer: GrpcCLC;
let replyErr: Partial<Head> = {};
let replyBody: string | undefined;
let hang = false;
const received: Array<Head | undefined> = [];

before(async () => {
    registerLogger(logger, stubHub);
    server = createServer();
    server.add(CommonApiServiceDefinition, {
        async commonUnaryApi(req, ctx) {
            received.push(req.head);
            if (hang) await new Promise<void>((r) => ctx.signal.addEventListener('abort', () => r()));
            return { head: { ...req.head, ...replyErr }, innerRes: replyBody ?? `echo:${req.innerReq}` };
        },
    });
    const port = await server.listen('127.0.0.1:0');
    peer = new GrpcCLC({ address: `127.0.0.1:${port}` });
});

after(() => {
    peer.channel.close();
    server.forceShutdown();
});

const clcMsg = (timeoutMs?: number) => new Msg({ cmdId: 9001, gid: 7, txnId: 3, clcOptions: { clcName: 'peer', timeoutMs } }, 'hi');

test('a successful call sends only business head fields and leaves the request intact', async () => {
    received.length = 0;
    replyErr = {};
    const msg = clcMsg();
    const headBefore = structuredClone(msg.head);
    const rsp = await peer.callCmd(msg);
    assert.deepEqual(rsp.head, { cmdId: 9001 });
    assert.equal(rsp.body, 'echo:hi');
    assert.deepEqual(msg.head, headBefore);
    assert.equal(msg.body, 'hi');
    assert.equal(received[0]!.cmdId, 9001);
    assert.equal(received[0]!.gid, 7);
    assert.equal('txnId' in received[0]!, false);
    assert.equal(received[0]!.errCode, undefined);
});

test('an unset or explicit 0 err_code is success, an empty body included', async () => {
    for (const err of [{}, { errCode: 0 }]) {
        replyErr = err;
        replyBody = '';
        try {
            const rsp = await peer.callCmd(clcMsg());
            assert.equal(rsp.head.errCode, undefined, JSON.stringify(err));
            assert.equal(rsp.body, '');
        } finally {
            replyBody = undefined;
        }
    }
});

test('peer codes come back as they were sent', async () => {
    for (const code of [2001, -3, DogsvrErrCode.TXN_TIMEOUT]) {
        replyErr = { errCode: code };
        assert.equal((await peer.callCmd(clcMsg())).head.errCode, code);
    }
});

test('an unreachable peer is CLC_UNAVAILABLE', async () => {
    const down = new GrpcCLC({ address: '127.0.0.1:1' });
    try {
        const rsp = await down.callCmd(clcMsg());
        assert.equal(rsp.head.errCode, DogsvrErrCode.CLC_UNAVAILABLE);
        assert.equal(rsp.body, '');
    } finally {
        down.channel.close();
    }
});

test('a peer that never replies is CLC_TIMEOUT after clcOptions.timeoutMs', async () => {
    replyErr = {};
    hang = true;
    try {
        const t0 = Date.now();
        const rsp = await peer.callCmd(clcMsg(200));
        const elapsed = Date.now() - t0;
        assert.equal(rsp.head.errCode, DogsvrErrCode.CLC_TIMEOUT);
        assert.ok(elapsed >= 190 && elapsed < 1000, `timed out after ${elapsed}ms`);
    } finally {
        hang = false;
    }
});
