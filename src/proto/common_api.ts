// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.4.2
//   protoc               v3.19.1
// source: common_api.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { type CallContext, type CallOptions } from "nice-grpc-common";

export const protobufPackage = "dogsvr";

export interface Head {
  cmdId: number;
  openId: string;
  zoneId: number;
}

export interface CommonApiReq {
  head: Head | undefined;
  innerReq: string;
}

export interface CommonApiRes {
  head: Head | undefined;
  innerRes: string;
}

function createBaseHead(): Head {
  return { cmdId: 0, openId: "", zoneId: 0 };
}

export const Head: MessageFns<Head> = {
  encode(message: Head, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cmdId !== 0) {
      writer.uint32(8).uint32(message.cmdId);
    }
    if (message.openId !== "") {
      writer.uint32(18).string(message.openId);
    }
    if (message.zoneId !== 0) {
      writer.uint32(24).uint32(message.zoneId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Head {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHead();
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

          message.openId = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.zoneId = reader.uint32();
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

  fromJSON(object: any): Head {
    return {
      cmdId: isSet(object.cmdId) ? globalThis.Number(object.cmdId) : 0,
      openId: isSet(object.openId) ? globalThis.String(object.openId) : "",
      zoneId: isSet(object.zoneId) ? globalThis.Number(object.zoneId) : 0,
    };
  },

  toJSON(message: Head): unknown {
    const obj: any = {};
    if (message.cmdId !== 0) {
      obj.cmdId = Math.round(message.cmdId);
    }
    if (message.openId !== "") {
      obj.openId = message.openId;
    }
    if (message.zoneId !== 0) {
      obj.zoneId = Math.round(message.zoneId);
    }
    return obj;
  },

  create(base?: DeepPartial<Head>): Head {
    return Head.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Head>): Head {
    const message = createBaseHead();
    message.cmdId = object.cmdId ?? 0;
    message.openId = object.openId ?? "";
    message.zoneId = object.zoneId ?? 0;
    return message;
  },
};

function createBaseCommonApiReq(): CommonApiReq {
  return { head: undefined, innerReq: "" };
}

export const CommonApiReq: MessageFns<CommonApiReq> = {
  encode(message: CommonApiReq, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.head !== undefined) {
      Head.encode(message.head, writer.uint32(10).fork()).join();
    }
    if (message.innerReq !== "") {
      writer.uint32(18).string(message.innerReq);
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
          if (tag !== 10) {
            break;
          }

          message.head = Head.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.innerReq = reader.string();
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
      head: isSet(object.head) ? Head.fromJSON(object.head) : undefined,
      innerReq: isSet(object.innerReq) ? globalThis.String(object.innerReq) : "",
    };
  },

  toJSON(message: CommonApiReq): unknown {
    const obj: any = {};
    if (message.head !== undefined) {
      obj.head = Head.toJSON(message.head);
    }
    if (message.innerReq !== "") {
      obj.innerReq = message.innerReq;
    }
    return obj;
  },

  create(base?: DeepPartial<CommonApiReq>): CommonApiReq {
    return CommonApiReq.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CommonApiReq>): CommonApiReq {
    const message = createBaseCommonApiReq();
    message.head = (object.head !== undefined && object.head !== null) ? Head.fromPartial(object.head) : undefined;
    message.innerReq = object.innerReq ?? "";
    return message;
  },
};

function createBaseCommonApiRes(): CommonApiRes {
  return { head: undefined, innerRes: "" };
}

export const CommonApiRes: MessageFns<CommonApiRes> = {
  encode(message: CommonApiRes, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.head !== undefined) {
      Head.encode(message.head, writer.uint32(10).fork()).join();
    }
    if (message.innerRes !== "") {
      writer.uint32(18).string(message.innerRes);
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
          if (tag !== 10) {
            break;
          }

          message.head = Head.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.innerRes = reader.string();
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
      head: isSet(object.head) ? Head.fromJSON(object.head) : undefined,
      innerRes: isSet(object.innerRes) ? globalThis.String(object.innerRes) : "",
    };
  },

  toJSON(message: CommonApiRes): unknown {
    const obj: any = {};
    if (message.head !== undefined) {
      obj.head = Head.toJSON(message.head);
    }
    if (message.innerRes !== "") {
      obj.innerRes = message.innerRes;
    }
    return obj;
  },

  create(base?: DeepPartial<CommonApiRes>): CommonApiRes {
    return CommonApiRes.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CommonApiRes>): CommonApiRes {
    const message = createBaseCommonApiRes();
    message.head = (object.head !== undefined && object.head !== null) ? Head.fromPartial(object.head) : undefined;
    message.innerRes = object.innerRes ?? "";
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
