// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.4.2
//   protoc               v3.19.1
// source: common_api.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallContext, type CallOptions } from "nice-grpc-common";

export const protobufPackage = "dogsvr";

export interface CommonApiReq {
  cmdId: number;
  innerReq: Uint8Array;
}

export interface CommonApiRes {
  cmdId: number;
  innerRes: Uint8Array;
}

function createBaseCommonApiReq(): CommonApiReq {
  return { cmdId: 0, innerReq: new Uint8Array(0) };
}

export const CommonApiReq: MessageFns<CommonApiReq> = {
  encode(message: CommonApiReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cmdId !== 0) {
      writer.uint32(8).uint32(message.cmdId);
    }
    if (message.innerReq.length !== 0) {
      writer.uint32(18).bytes(message.innerReq);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CommonApiReq {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommonApiReq();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.cmdId = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.innerReq = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CommonApiReq {
    return {
      cmdId: isSet(object.cmdId) ? globalThis.Number(object.cmdId) : 0,
      innerReq: isSet(object.innerReq) ? bytesFromBase64(object.innerReq) : new Uint8Array(0),
    };
  },

  toJSON(message: CommonApiReq): unknown {
    const obj: any = {};
    if (message.cmdId !== 0) {
      obj.cmdId = Math.round(message.cmdId);
    }
    if (message.innerReq.length !== 0) {
      obj.innerReq = base64FromBytes(message.innerReq);
    }
    return obj;
  },

  create(base?: DeepPartial<CommonApiReq>): CommonApiReq {
    return CommonApiReq.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CommonApiReq>): CommonApiReq {
    const message = createBaseCommonApiReq();
    message.cmdId = object.cmdId ?? 0;
    message.innerReq = object.innerReq ?? new Uint8Array(0);
    return message;
  },
};

function createBaseCommonApiRes(): CommonApiRes {
  return { cmdId: 0, innerRes: new Uint8Array(0) };
}

export const CommonApiRes: MessageFns<CommonApiRes> = {
  encode(message: CommonApiRes, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cmdId !== 0) {
      writer.uint32(8).uint32(message.cmdId);
    }
    if (message.innerRes.length !== 0) {
      writer.uint32(18).bytes(message.innerRes);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CommonApiRes {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommonApiRes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.cmdId = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.innerRes = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CommonApiRes {
    return {
      cmdId: isSet(object.cmdId) ? globalThis.Number(object.cmdId) : 0,
      innerRes: isSet(object.innerRes) ? bytesFromBase64(object.innerRes) : new Uint8Array(0),
    };
  },

  toJSON(message: CommonApiRes): unknown {
    const obj: any = {};
    if (message.cmdId !== 0) {
      obj.cmdId = Math.round(message.cmdId);
    }
    if (message.innerRes.length !== 0) {
      obj.innerRes = base64FromBytes(message.innerRes);
    }
    return obj;
  },

  create(base?: DeepPartial<CommonApiRes>): CommonApiRes {
    return CommonApiRes.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CommonApiRes>): CommonApiRes {
    const message = createBaseCommonApiRes();
    message.cmdId = object.cmdId ?? 0;
    message.innerRes = object.innerRes ?? new Uint8Array(0);
    return message;
  },
};

export type CommonApiServiceDefinition = typeof CommonApiServiceDefinition;
export const CommonApiServiceDefinition = {
  name: "CommonApiService",
  fullName: "dogsvr.CommonApiService",
  methods: {
    commonUnaryApi: {
      name: "CommonUnaryApi",
      requestType: CommonApiReq,
      requestStream: false,
      responseType: CommonApiRes,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface CommonApiServiceImplementation<CallContextExt = {}> {
  commonUnaryApi(request: CommonApiReq, context: CallContext & CallContextExt): Promise<DeepPartial<CommonApiRes>>;
}

export interface CommonApiServiceClient<CallOptionsExt = {}> {
  commonUnaryApi(request: DeepPartial<CommonApiReq>, options?: CallOptions & CallOptionsExt): Promise<CommonApiRes>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create(base?: DeepPartial<T>): T;
  fromPartial(object: DeepPartial<T>): T;
}
