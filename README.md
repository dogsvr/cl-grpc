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

### Logging

`@grpc/grpc-js`'s internal logs (channel state transitions, subchannel picks, keepalive, retries, etc.) are routed through dogsvr's logger as `module: "grpc-js"` via the global `setLogger`/`setLogVerbosity` API.

**Default level: `ERROR`.** grpc-js emits per-RPC channel chatter at `INFO` and has no `WARN` tier; `ERROR` matches grpc-js's own out-of-the-box default. Override per-CL/CLC for protocol debugging:

```jsonc
"cl":  { "grpc":      { "type": "grpc", "port": 20001,                     "log": { "level": "DEBUG" } } },
"clc": { "battlesvr": { "type": "grpc", "address": "127.0.0.1:30001",      "log": { "level": "DEBUG" } } }
```

Accepts grpc-js `LogVerbosity` keys: **`"DEBUG"` | `"INFO"` | `"ERROR"` | `"NONE"`** — all upper-case, matching the grpc-js enum member names. Values pass straight to `setLogVerbosity`. **Case-sensitive** and **fails silently**: mis-cased spellings like `"debug"` are looked up on the `LogVerbosity` object, resolve to `undefined`, and grpc-js keeps its previous verbosity — no exception, no log line, no effect. When multiple CL/CLC instances coexist (process-global verbosity), the most verbose configured level wins.

**`GRPC_VERBOSITY` / `GRPC_TRACE` env vars are overridden** by this routing — use `cl.<name>.log.level: "DEBUG"` for verbose investigation instead.

### Regenerating gRPC stubs

```sh
npm run protoc      # grpc-tools + ts-proto (nice-grpc output)
```

## Role in dogsvr

The counterpart to inbound CLs like `@dogsvr/cl-tsrpc`: where a TSRPC CL handles a client-to-server link, `cl-grpc` handles server-to-server mesh. See the [dogsvr README](https://github.com/dogsvr/dogsvr) for how CL and CLC factories register and how routing works across the mesh.

## See also

- [`example-proj`](https://github.com/dogsvr/example-proj) — three-server reference that uses this CL/CLC between `zonesvr` (:20001) and `battlesvr` (:30001)
- [`@dogsvr/cl-tsrpc`](https://github.com/dogsvr/cl-tsrpc) — TSRPC CL for client-facing WS/HTTP endpoints
