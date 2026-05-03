# @dogsvr/cl-grpc

gRPC connection layer for [`@dogsvr/dogsvr`](https://github.com/dogsvr/dogsvr) — server-to-server unary calls. Provides both inbound (`CL`, a gRPC server) and outbound (`CLC`, a gRPC client) sides so any two dogsvr servers can talk to each other.

## Install

```sh
npm install @dogsvr/cl-grpc
```

**Node.js**: tested on **v24.13.0 on Linux (x86-64)**; other maintained LTS lines are expected to work but are not routinely exercised. File an issue if something breaks on your runtime.

## Usage

Importing the package in the main thread self-registers a `"grpc"` CL and CLC factory with `@dogsvr/dogsvr`:

```ts
import * as dogsvr from '@dogsvr/dogsvr/main_thread';
import '@dogsvr/cl-grpc';
dogsvr.startServer(__dirname + '/main_thread_config.json');
```

Wire up the corresponding `main_thread_config.json`:

```jsonc
{
    "cl": {
        "grpc": { "type": "grpc", "port": 20001 }             // inbound: open a gRPC server
    },
    "clc": {
        "battlesvr": { "type": "grpc", "address": "127.0.0.1:30001" }  // outbound: call another server
    }
}
```

Worker-side usage is unchanged — use the dogsvr worker API to call out:

```ts
import * as dogsvr from '@dogsvr/dogsvr/worker_thread';
await dogsvr.callCmdByClc('battlesvr', head, innerReq);
```

### Regenerating gRPC stubs

```sh
npm run protoc      # grpc-tools + ts-proto (nice-grpc output)
```

## Role in dogsvr

The counterpart to inbound CLs like `@dogsvr/cl-tsrpc`: where a TSRPC CL handles a client-to-server link, `cl-grpc` handles server-to-server mesh. See the [dogsvr README](https://github.com/dogsvr/dogsvr) for how CL and CLC factories register and how routing works across the mesh.

## See also

- [`example-proj`](https://github.com/dogsvr/example-proj) — three-server reference that uses this CL/CLC between `zonesvr` (:20001) and `battlesvr` (:30001)
- [`@dogsvr/cl-tsrpc`](https://github.com/dogsvr/cl-tsrpc) — TSRPC CL for client-facing WS/HTTP endpoints
