/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { FieldMask } from "../google/protobuf/field_mask";
import { Timestamp } from "../google/protobuf/timestamp";
import {
  ExportFormat,
  exportFormatFromJSON,
  exportFormatToJSON,
  exportFormatToNumber,
  VCSType,
  vCSTypeFromJSON,
  vCSTypeToJSON,
  vCSTypeToNumber,
} from "./common";
import { ChangedResources } from "./database_service";

export const protobufPackage = "bytebase.v1";

export interface GetPlanRequest {
  /**
   * The name of the plan to retrieve.
   * Format: projects/{project}/plans/{plan}
   */
  name: string;
}

export interface ListPlansRequest {
  /**
   * The parent, which owns this collection of plans.
   * Format: projects/{project}
   * Use "projects/-" to list all plans from all projects.
   */
  parent: string;
  /**
   * The maximum number of plans to return. The service may return fewer than
   * this value.
   * If unspecified, at most 50 plans will be returned.
   * The maximum value is 1000; values above 1000 will be coerced to 1000.
   */
  pageSize: number;
  /**
   * A page token, received from a previous `ListPlans` call.
   * Provide this to retrieve the subsequent page.
   *
   * When paginating, all other parameters provided to `ListPlans` must match
   * the call that provided the page token.
   */
  pageToken: string;
}

export interface ListPlansResponse {
  /** The plans from the specified request. */
  plans: Plan[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken: string;
}

export interface SearchPlansRequest {
  /**
   * The parent, which owns this collection of plans.
   * Format: projects/{project}
   * Use "projects/-" to list all plans from all projects.
   */
  parent: string;
  /**
   * The maximum number of plans to return. The service may return fewer than
   * this value.
   * If unspecified, at most 50 plans will be returned.
   * The maximum value is 1000; values above 1000 will be coerced to 1000.
   */
  pageSize: number;
  /**
   * A page token, received from a previous `ListPlans` call.
   * Provide this to retrieve the subsequent page.
   *
   * When paginating, all other parameters provided to `ListPlans` must match
   * the call that provided the page token.
   */
  pageToken: string;
  /** Filter is used to filter plans returned in the list. */
  filter: string;
}

export interface SearchPlansResponse {
  /** The plans from the specified request. */
  plans: Plan[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken: string;
}

export interface CreatePlanRequest {
  /**
   * The parent project where this plan will be created.
   * Format: projects/{project}
   */
  parent: string;
  /** The plan to create. */
  plan: Plan | undefined;
}

export interface UpdatePlanRequest {
  /**
   * The plan to update.
   *
   * The plan's `name` field is used to identify the plan to update.
   * Format: projects/{project}/plans/{plan}
   */
  plan:
    | Plan
    | undefined;
  /** The list of fields to update. */
  updateMask: string[] | undefined;
}

export interface Plan {
  /**
   * The name of the plan.
   * `plan` is a system generated ID.
   * Format: projects/{project}/plans/{plan}
   */
  name: string;
  /** The system-assigned, unique identifier for a resource. */
  uid: string;
  /**
   * The resource name of the issue associated with this plan.
   * Format: projects/{project}/issues/{issue}
   */
  issue: string;
  title: string;
  description: string;
  steps: Plan_Step[];
  vcsSource:
    | Plan_VCSSource
    | undefined;
  /** Format: users/hello@world.com */
  creator: string;
  createTime: Date | undefined;
  updateTime:
    | Date
    | undefined;
  /**
   * The status count of the latest plan check runs.
   * Keys are:
   * - SUCCESS
   * - WARNING
   * - ERROR
   */
  planCheckRunStatusCount: { [key: string]: number };
}

export interface Plan_Step {
  title: string;
  specs: Plan_Spec[];
}

export interface Plan_Spec {
  /** earliest_allowed_time the earliest execution time of the change. */
  earliestAllowedTime:
    | Date
    | undefined;
  /** A UUID4 string that uniquely identifies the Spec. */
  id: string;
  /**
   * IDs of the specs that this spec depends on.
   * Must be a subset of the specs in the same step.
   */
  dependsOnSpecs: string[];
  createDatabaseConfig?: Plan_CreateDatabaseConfig | undefined;
  changeDatabaseConfig?: Plan_ChangeDatabaseConfig | undefined;
  exportDataConfig?: Plan_ExportDataConfig | undefined;
}

export interface Plan_PlanCheckRunStatusCountEntry {
  key: string;
  value: number;
}

export interface Plan_CreateDatabaseConfig {
  /**
   * The resource name of the instance on which the database is created.
   * Format: instances/{instance}
   */
  target: string;
  /** The name of the database to create. */
  database: string;
  /**
   * table is the name of the table, if it is not empty, Bytebase should create a table after creating the database.
   * For example, in MongoDB, it only creates the database when we first store data in that database.
   */
  table: string;
  /** character_set is the character set of the database. */
  characterSet: string;
  /** collation is the collation of the database. */
  collation: string;
  /** cluster is the cluster of the database. This is only applicable to ClickHouse for "ON CLUSTER <<cluster>>". */
  cluster: string;
  /** owner is the owner of the database. This is only applicable to Postgres for "WITH OWNER <<owner>>". */
  owner: string;
  /**
   * The environment resource.
   * Format: environments/prod where prod is the environment resource ID.
   */
  environment: string;
  /** labels of the database. */
  labels: { [key: string]: string };
}

export interface Plan_CreateDatabaseConfig_LabelsEntry {
  key: string;
  value: string;
}

export interface Plan_ChangeDatabaseConfig {
  /**
   * The resource name of the target.
   * Format: instances/{instance-id}/databases/{database-name}.
   * Format: projects/{project}/databaseGroups/{databaseGroup}.
   */
  target: string;
  /**
   * The resource name of the sheet.
   * Format: projects/{project}/sheets/{sheet}
   */
  sheet: string;
  type: Plan_ChangeDatabaseConfig_Type;
  /**
   * schema_version is parsed from VCS file name.
   * It is automatically generated in the UI workflow.
   */
  schemaVersion: string;
  ghostFlags: { [key: string]: string };
  /** If set, a backup of the modified data will be created automatically before any changes are applied. */
  preUpdateBackupDetail?: Plan_ChangeDatabaseConfig_PreUpdateBackupDetail | undefined;
}

/** Type is the database change type. */
export enum Plan_ChangeDatabaseConfig_Type {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  /**
   * BASELINE - Used for establishing schema baseline, this is used when
   * 1. Onboard the database into Bytebase since Bytebase needs to know the current database schema.
   * 2. Had schema drift and need to re-establish the baseline.
   */
  BASELINE = "BASELINE",
  /** MIGRATE - Used for DDL changes including CREATE DATABASE. */
  MIGRATE = "MIGRATE",
  /** MIGRATE_SDL - Used for schema changes via state-based schema migration including CREATE DATABASE. */
  MIGRATE_SDL = "MIGRATE_SDL",
  /** MIGRATE_GHOST - Used for DDL changes using gh-ost. */
  MIGRATE_GHOST = "MIGRATE_GHOST",
  /** DATA - Used for DML change. */
  DATA = "DATA",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function plan_ChangeDatabaseConfig_TypeFromJSON(object: any): Plan_ChangeDatabaseConfig_Type {
  switch (object) {
    case 0:
    case "TYPE_UNSPECIFIED":
      return Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED;
    case 1:
    case "BASELINE":
      return Plan_ChangeDatabaseConfig_Type.BASELINE;
    case 2:
    case "MIGRATE":
      return Plan_ChangeDatabaseConfig_Type.MIGRATE;
    case 3:
    case "MIGRATE_SDL":
      return Plan_ChangeDatabaseConfig_Type.MIGRATE_SDL;
    case 4:
    case "MIGRATE_GHOST":
      return Plan_ChangeDatabaseConfig_Type.MIGRATE_GHOST;
    case 6:
    case "DATA":
      return Plan_ChangeDatabaseConfig_Type.DATA;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Plan_ChangeDatabaseConfig_Type.UNRECOGNIZED;
  }
}

export function plan_ChangeDatabaseConfig_TypeToJSON(object: Plan_ChangeDatabaseConfig_Type): string {
  switch (object) {
    case Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED:
      return "TYPE_UNSPECIFIED";
    case Plan_ChangeDatabaseConfig_Type.BASELINE:
      return "BASELINE";
    case Plan_ChangeDatabaseConfig_Type.MIGRATE:
      return "MIGRATE";
    case Plan_ChangeDatabaseConfig_Type.MIGRATE_SDL:
      return "MIGRATE_SDL";
    case Plan_ChangeDatabaseConfig_Type.MIGRATE_GHOST:
      return "MIGRATE_GHOST";
    case Plan_ChangeDatabaseConfig_Type.DATA:
      return "DATA";
    case Plan_ChangeDatabaseConfig_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function plan_ChangeDatabaseConfig_TypeToNumber(object: Plan_ChangeDatabaseConfig_Type): number {
  switch (object) {
    case Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED:
      return 0;
    case Plan_ChangeDatabaseConfig_Type.BASELINE:
      return 1;
    case Plan_ChangeDatabaseConfig_Type.MIGRATE:
      return 2;
    case Plan_ChangeDatabaseConfig_Type.MIGRATE_SDL:
      return 3;
    case Plan_ChangeDatabaseConfig_Type.MIGRATE_GHOST:
      return 4;
    case Plan_ChangeDatabaseConfig_Type.DATA:
      return 6;
    case Plan_ChangeDatabaseConfig_Type.UNRECOGNIZED:
    default:
      return -1;
  }
}

export interface Plan_ChangeDatabaseConfig_GhostFlagsEntry {
  key: string;
  value: string;
}

export interface Plan_ChangeDatabaseConfig_PreUpdateBackupDetail {
  /**
   * The database for keeping the backup data.
   * Format: instances/{instance}/databases/{database}
   */
  database: string;
}

export interface Plan_ExportDataConfig {
  /**
   * The resource name of the target.
   * Format: instances/{instance-id}/databases/{database-name}
   */
  target: string;
  /**
   * The resource name of the sheet.
   * Format: projects/{project}/sheets/{sheet}
   */
  sheet: string;
  /** The format of the exported file. */
  format: ExportFormat;
  /**
   * The zip password provide by users.
   * Leave it empty if no needs to encrypt the zip file.
   */
  password?: string | undefined;
}

export interface Plan_VCSSource {
  vcsType: VCSType;
  /**
   * Optional.
   * If present, we will update the pull request for rollout status.
   * Format: projects/{project-ID}/vcsConnectors/{vcs-connector}
   */
  vcsConnector: string;
  pullRequestUrl: string;
}

export interface ListPlanCheckRunsRequest {
  /**
   * The parent, which owns this collection of plan check runs.
   * Format: projects/{project}/plans/{plan}
   */
  parent: string;
  /**
   * The maximum number of plan check runs to return. The service may return fewer than
   * this value.
   * If unspecified, at most 50 plans will be returned.
   * The maximum value is 1000; values above 1000 will be coerced to 1000.
   */
  pageSize: number;
  /**
   * A page token, received from a previous `ListPlanCheckRuns` call.
   * Provide this to retrieve the subsequent page.
   *
   * When paginating, all other parameters provided to `ListPlanCheckRuns` must match
   * the call that provided the page token.
   */
  pageToken: string;
}

export interface ListPlanCheckRunsResponse {
  /** The plan check runs from the specified request. */
  planCheckRuns: PlanCheckRun[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken: string;
}

export interface RunPlanChecksRequest {
  /**
   * The plan to run plan checks.
   * Format: projects/{project}/plans/{plan}
   */
  name: string;
}

export interface RunPlanChecksResponse {
}

export interface PlanCheckRun {
  /** Format: projects/{project}/plans/{plan}/planCheckRuns/{planCheckRun} */
  name: string;
  /** The system-assigned, unique identifier for a resource. */
  uid: string;
  type: PlanCheckRun_Type;
  status: PlanCheckRun_Status;
  /** Format: instances/{instance}/databases/{database} */
  target: string;
  /** Format: project/{project}/sheets/{sheet} */
  sheet: string;
  results: PlanCheckRun_Result[];
  /** error is set if the Status is FAILED. */
  error: string;
  createTime: Date | undefined;
}

export enum PlanCheckRun_Type {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  DATABASE_STATEMENT_FAKE_ADVISE = "DATABASE_STATEMENT_FAKE_ADVISE",
  DATABASE_STATEMENT_ADVISE = "DATABASE_STATEMENT_ADVISE",
  DATABASE_STATEMENT_SUMMARY_REPORT = "DATABASE_STATEMENT_SUMMARY_REPORT",
  DATABASE_CONNECT = "DATABASE_CONNECT",
  DATABASE_GHOST_SYNC = "DATABASE_GHOST_SYNC",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function planCheckRun_TypeFromJSON(object: any): PlanCheckRun_Type {
  switch (object) {
    case 0:
    case "TYPE_UNSPECIFIED":
      return PlanCheckRun_Type.TYPE_UNSPECIFIED;
    case 1:
    case "DATABASE_STATEMENT_FAKE_ADVISE":
      return PlanCheckRun_Type.DATABASE_STATEMENT_FAKE_ADVISE;
    case 3:
    case "DATABASE_STATEMENT_ADVISE":
      return PlanCheckRun_Type.DATABASE_STATEMENT_ADVISE;
    case 5:
    case "DATABASE_STATEMENT_SUMMARY_REPORT":
      return PlanCheckRun_Type.DATABASE_STATEMENT_SUMMARY_REPORT;
    case 6:
    case "DATABASE_CONNECT":
      return PlanCheckRun_Type.DATABASE_CONNECT;
    case 7:
    case "DATABASE_GHOST_SYNC":
      return PlanCheckRun_Type.DATABASE_GHOST_SYNC;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PlanCheckRun_Type.UNRECOGNIZED;
  }
}

export function planCheckRun_TypeToJSON(object: PlanCheckRun_Type): string {
  switch (object) {
    case PlanCheckRun_Type.TYPE_UNSPECIFIED:
      return "TYPE_UNSPECIFIED";
    case PlanCheckRun_Type.DATABASE_STATEMENT_FAKE_ADVISE:
      return "DATABASE_STATEMENT_FAKE_ADVISE";
    case PlanCheckRun_Type.DATABASE_STATEMENT_ADVISE:
      return "DATABASE_STATEMENT_ADVISE";
    case PlanCheckRun_Type.DATABASE_STATEMENT_SUMMARY_REPORT:
      return "DATABASE_STATEMENT_SUMMARY_REPORT";
    case PlanCheckRun_Type.DATABASE_CONNECT:
      return "DATABASE_CONNECT";
    case PlanCheckRun_Type.DATABASE_GHOST_SYNC:
      return "DATABASE_GHOST_SYNC";
    case PlanCheckRun_Type.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function planCheckRun_TypeToNumber(object: PlanCheckRun_Type): number {
  switch (object) {
    case PlanCheckRun_Type.TYPE_UNSPECIFIED:
      return 0;
    case PlanCheckRun_Type.DATABASE_STATEMENT_FAKE_ADVISE:
      return 1;
    case PlanCheckRun_Type.DATABASE_STATEMENT_ADVISE:
      return 3;
    case PlanCheckRun_Type.DATABASE_STATEMENT_SUMMARY_REPORT:
      return 5;
    case PlanCheckRun_Type.DATABASE_CONNECT:
      return 6;
    case PlanCheckRun_Type.DATABASE_GHOST_SYNC:
      return 7;
    case PlanCheckRun_Type.UNRECOGNIZED:
    default:
      return -1;
  }
}

export enum PlanCheckRun_Status {
  STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
  RUNNING = "RUNNING",
  DONE = "DONE",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function planCheckRun_StatusFromJSON(object: any): PlanCheckRun_Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return PlanCheckRun_Status.STATUS_UNSPECIFIED;
    case 1:
    case "RUNNING":
      return PlanCheckRun_Status.RUNNING;
    case 2:
    case "DONE":
      return PlanCheckRun_Status.DONE;
    case 3:
    case "FAILED":
      return PlanCheckRun_Status.FAILED;
    case 4:
    case "CANCELED":
      return PlanCheckRun_Status.CANCELED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PlanCheckRun_Status.UNRECOGNIZED;
  }
}

export function planCheckRun_StatusToJSON(object: PlanCheckRun_Status): string {
  switch (object) {
    case PlanCheckRun_Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case PlanCheckRun_Status.RUNNING:
      return "RUNNING";
    case PlanCheckRun_Status.DONE:
      return "DONE";
    case PlanCheckRun_Status.FAILED:
      return "FAILED";
    case PlanCheckRun_Status.CANCELED:
      return "CANCELED";
    case PlanCheckRun_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function planCheckRun_StatusToNumber(object: PlanCheckRun_Status): number {
  switch (object) {
    case PlanCheckRun_Status.STATUS_UNSPECIFIED:
      return 0;
    case PlanCheckRun_Status.RUNNING:
      return 1;
    case PlanCheckRun_Status.DONE:
      return 2;
    case PlanCheckRun_Status.FAILED:
      return 3;
    case PlanCheckRun_Status.CANCELED:
      return 4;
    case PlanCheckRun_Status.UNRECOGNIZED:
    default:
      return -1;
  }
}

export interface PlanCheckRun_Result {
  status: PlanCheckRun_Result_Status;
  title: string;
  content: string;
  code: number;
  sqlSummaryReport?: PlanCheckRun_Result_SqlSummaryReport | undefined;
  sqlReviewReport?: PlanCheckRun_Result_SqlReviewReport | undefined;
}

export enum PlanCheckRun_Result_Status {
  STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
  ERROR = "ERROR",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
  UNRECOGNIZED = "UNRECOGNIZED",
}

export function planCheckRun_Result_StatusFromJSON(object: any): PlanCheckRun_Result_Status {
  switch (object) {
    case 0:
    case "STATUS_UNSPECIFIED":
      return PlanCheckRun_Result_Status.STATUS_UNSPECIFIED;
    case 1:
    case "ERROR":
      return PlanCheckRun_Result_Status.ERROR;
    case 2:
    case "WARNING":
      return PlanCheckRun_Result_Status.WARNING;
    case 3:
    case "SUCCESS":
      return PlanCheckRun_Result_Status.SUCCESS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PlanCheckRun_Result_Status.UNRECOGNIZED;
  }
}

export function planCheckRun_Result_StatusToJSON(object: PlanCheckRun_Result_Status): string {
  switch (object) {
    case PlanCheckRun_Result_Status.STATUS_UNSPECIFIED:
      return "STATUS_UNSPECIFIED";
    case PlanCheckRun_Result_Status.ERROR:
      return "ERROR";
    case PlanCheckRun_Result_Status.WARNING:
      return "WARNING";
    case PlanCheckRun_Result_Status.SUCCESS:
      return "SUCCESS";
    case PlanCheckRun_Result_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export function planCheckRun_Result_StatusToNumber(object: PlanCheckRun_Result_Status): number {
  switch (object) {
    case PlanCheckRun_Result_Status.STATUS_UNSPECIFIED:
      return 0;
    case PlanCheckRun_Result_Status.ERROR:
      return 1;
    case PlanCheckRun_Result_Status.WARNING:
      return 2;
    case PlanCheckRun_Result_Status.SUCCESS:
      return 3;
    case PlanCheckRun_Result_Status.UNRECOGNIZED:
    default:
      return -1;
  }
}

export interface PlanCheckRun_Result_SqlSummaryReport {
  code: number;
  /** statement_types are the types of statements that are found in the sql. */
  statementTypes: string[];
  affectedRows: number;
  changedResources: ChangedResources | undefined;
}

export interface PlanCheckRun_Result_SqlReviewReport {
  line: number;
  column: number;
  detail: string;
  /** Code from sql review. */
  code: number;
}

function createBaseGetPlanRequest(): GetPlanRequest {
  return { name: "" };
}

export const GetPlanRequest = {
  encode(message: GetPlanRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPlanRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPlanRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetPlanRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: GetPlanRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create(base?: DeepPartial<GetPlanRequest>): GetPlanRequest {
    return GetPlanRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<GetPlanRequest>): GetPlanRequest {
    const message = createBaseGetPlanRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseListPlansRequest(): ListPlansRequest {
  return { parent: "", pageSize: 0, pageToken: "" };
}

export const ListPlansRequest = {
  encode(message: ListPlansRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parent !== "") {
      writer.uint32(10).string(message.parent);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(26).string(message.pageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListPlansRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListPlansRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.parent = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.pageSize = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListPlansRequest {
    return {
      parent: isSet(object.parent) ? globalThis.String(object.parent) : "",
      pageSize: isSet(object.pageSize) ? globalThis.Number(object.pageSize) : 0,
      pageToken: isSet(object.pageToken) ? globalThis.String(object.pageToken) : "",
    };
  },

  toJSON(message: ListPlansRequest): unknown {
    const obj: any = {};
    if (message.parent !== "") {
      obj.parent = message.parent;
    }
    if (message.pageSize !== 0) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.pageToken !== "") {
      obj.pageToken = message.pageToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListPlansRequest>): ListPlansRequest {
    return ListPlansRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListPlansRequest>): ListPlansRequest {
    const message = createBaseListPlansRequest();
    message.parent = object.parent ?? "";
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    return message;
  },
};

function createBaseListPlansResponse(): ListPlansResponse {
  return { plans: [], nextPageToken: "" };
}

export const ListPlansResponse = {
  encode(message: ListPlansResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.plans) {
      Plan.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListPlansResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListPlansResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.plans.push(Plan.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nextPageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListPlansResponse {
    return {
      plans: globalThis.Array.isArray(object?.plans) ? object.plans.map((e: any) => Plan.fromJSON(e)) : [],
      nextPageToken: isSet(object.nextPageToken) ? globalThis.String(object.nextPageToken) : "",
    };
  },

  toJSON(message: ListPlansResponse): unknown {
    const obj: any = {};
    if (message.plans?.length) {
      obj.plans = message.plans.map((e) => Plan.toJSON(e));
    }
    if (message.nextPageToken !== "") {
      obj.nextPageToken = message.nextPageToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListPlansResponse>): ListPlansResponse {
    return ListPlansResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListPlansResponse>): ListPlansResponse {
    const message = createBaseListPlansResponse();
    message.plans = object.plans?.map((e) => Plan.fromPartial(e)) || [];
    message.nextPageToken = object.nextPageToken ?? "";
    return message;
  },
};

function createBaseSearchPlansRequest(): SearchPlansRequest {
  return { parent: "", pageSize: 0, pageToken: "", filter: "" };
}

export const SearchPlansRequest = {
  encode(message: SearchPlansRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parent !== "") {
      writer.uint32(10).string(message.parent);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(26).string(message.pageToken);
    }
    if (message.filter !== "") {
      writer.uint32(34).string(message.filter);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchPlansRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchPlansRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.parent = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.pageSize = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pageToken = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.filter = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SearchPlansRequest {
    return {
      parent: isSet(object.parent) ? globalThis.String(object.parent) : "",
      pageSize: isSet(object.pageSize) ? globalThis.Number(object.pageSize) : 0,
      pageToken: isSet(object.pageToken) ? globalThis.String(object.pageToken) : "",
      filter: isSet(object.filter) ? globalThis.String(object.filter) : "",
    };
  },

  toJSON(message: SearchPlansRequest): unknown {
    const obj: any = {};
    if (message.parent !== "") {
      obj.parent = message.parent;
    }
    if (message.pageSize !== 0) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.pageToken !== "") {
      obj.pageToken = message.pageToken;
    }
    if (message.filter !== "") {
      obj.filter = message.filter;
    }
    return obj;
  },

  create(base?: DeepPartial<SearchPlansRequest>): SearchPlansRequest {
    return SearchPlansRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SearchPlansRequest>): SearchPlansRequest {
    const message = createBaseSearchPlansRequest();
    message.parent = object.parent ?? "";
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    message.filter = object.filter ?? "";
    return message;
  },
};

function createBaseSearchPlansResponse(): SearchPlansResponse {
  return { plans: [], nextPageToken: "" };
}

export const SearchPlansResponse = {
  encode(message: SearchPlansResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.plans) {
      Plan.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchPlansResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchPlansResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.plans.push(Plan.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nextPageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SearchPlansResponse {
    return {
      plans: globalThis.Array.isArray(object?.plans) ? object.plans.map((e: any) => Plan.fromJSON(e)) : [],
      nextPageToken: isSet(object.nextPageToken) ? globalThis.String(object.nextPageToken) : "",
    };
  },

  toJSON(message: SearchPlansResponse): unknown {
    const obj: any = {};
    if (message.plans?.length) {
      obj.plans = message.plans.map((e) => Plan.toJSON(e));
    }
    if (message.nextPageToken !== "") {
      obj.nextPageToken = message.nextPageToken;
    }
    return obj;
  },

  create(base?: DeepPartial<SearchPlansResponse>): SearchPlansResponse {
    return SearchPlansResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SearchPlansResponse>): SearchPlansResponse {
    const message = createBaseSearchPlansResponse();
    message.plans = object.plans?.map((e) => Plan.fromPartial(e)) || [];
    message.nextPageToken = object.nextPageToken ?? "";
    return message;
  },
};

function createBaseCreatePlanRequest(): CreatePlanRequest {
  return { parent: "", plan: undefined };
}

export const CreatePlanRequest = {
  encode(message: CreatePlanRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parent !== "") {
      writer.uint32(10).string(message.parent);
    }
    if (message.plan !== undefined) {
      Plan.encode(message.plan, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePlanRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePlanRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.parent = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.plan = Plan.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreatePlanRequest {
    return {
      parent: isSet(object.parent) ? globalThis.String(object.parent) : "",
      plan: isSet(object.plan) ? Plan.fromJSON(object.plan) : undefined,
    };
  },

  toJSON(message: CreatePlanRequest): unknown {
    const obj: any = {};
    if (message.parent !== "") {
      obj.parent = message.parent;
    }
    if (message.plan !== undefined) {
      obj.plan = Plan.toJSON(message.plan);
    }
    return obj;
  },

  create(base?: DeepPartial<CreatePlanRequest>): CreatePlanRequest {
    return CreatePlanRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreatePlanRequest>): CreatePlanRequest {
    const message = createBaseCreatePlanRequest();
    message.parent = object.parent ?? "";
    message.plan = (object.plan !== undefined && object.plan !== null) ? Plan.fromPartial(object.plan) : undefined;
    return message;
  },
};

function createBaseUpdatePlanRequest(): UpdatePlanRequest {
  return { plan: undefined, updateMask: undefined };
}

export const UpdatePlanRequest = {
  encode(message: UpdatePlanRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.plan !== undefined) {
      Plan.encode(message.plan, writer.uint32(10).fork()).ldelim();
    }
    if (message.updateMask !== undefined) {
      FieldMask.encode(FieldMask.wrap(message.updateMask), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePlanRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePlanRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.plan = Plan.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.updateMask = FieldMask.unwrap(FieldMask.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UpdatePlanRequest {
    return {
      plan: isSet(object.plan) ? Plan.fromJSON(object.plan) : undefined,
      updateMask: isSet(object.updateMask) ? FieldMask.unwrap(FieldMask.fromJSON(object.updateMask)) : undefined,
    };
  },

  toJSON(message: UpdatePlanRequest): unknown {
    const obj: any = {};
    if (message.plan !== undefined) {
      obj.plan = Plan.toJSON(message.plan);
    }
    if (message.updateMask !== undefined) {
      obj.updateMask = FieldMask.toJSON(FieldMask.wrap(message.updateMask));
    }
    return obj;
  },

  create(base?: DeepPartial<UpdatePlanRequest>): UpdatePlanRequest {
    return UpdatePlanRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UpdatePlanRequest>): UpdatePlanRequest {
    const message = createBaseUpdatePlanRequest();
    message.plan = (object.plan !== undefined && object.plan !== null) ? Plan.fromPartial(object.plan) : undefined;
    message.updateMask = object.updateMask ?? undefined;
    return message;
  },
};

function createBasePlan(): Plan {
  return {
    name: "",
    uid: "",
    issue: "",
    title: "",
    description: "",
    steps: [],
    vcsSource: undefined,
    creator: "",
    createTime: undefined,
    updateTime: undefined,
    planCheckRunStatusCount: {},
  };
}

export const Plan = {
  encode(message: Plan, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.uid !== "") {
      writer.uint32(18).string(message.uid);
    }
    if (message.issue !== "") {
      writer.uint32(26).string(message.issue);
    }
    if (message.title !== "") {
      writer.uint32(34).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    for (const v of message.steps) {
      Plan_Step.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.vcsSource !== undefined) {
      Plan_VCSSource.encode(message.vcsSource, writer.uint32(58).fork()).ldelim();
    }
    if (message.creator !== "") {
      writer.uint32(66).string(message.creator);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(toTimestamp(message.createTime), writer.uint32(74).fork()).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(toTimestamp(message.updateTime), writer.uint32(82).fork()).ldelim();
    }
    Object.entries(message.planCheckRunStatusCount).forEach(([key, value]) => {
      Plan_PlanCheckRunStatusCountEntry.encode({ key: key as any, value }, writer.uint32(90).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.uid = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.issue = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.title = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.description = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.steps.push(Plan_Step.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.vcsSource = Plan_VCSSource.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.createTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.updateTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          const entry11 = Plan_PlanCheckRunStatusCountEntry.decode(reader, reader.uint32());
          if (entry11.value !== undefined) {
            message.planCheckRunStatusCount[entry11.key] = entry11.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      uid: isSet(object.uid) ? globalThis.String(object.uid) : "",
      issue: isSet(object.issue) ? globalThis.String(object.issue) : "",
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      steps: globalThis.Array.isArray(object?.steps) ? object.steps.map((e: any) => Plan_Step.fromJSON(e)) : [],
      vcsSource: isSet(object.vcsSource) ? Plan_VCSSource.fromJSON(object.vcsSource) : undefined,
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      createTime: isSet(object.createTime) ? fromJsonTimestamp(object.createTime) : undefined,
      updateTime: isSet(object.updateTime) ? fromJsonTimestamp(object.updateTime) : undefined,
      planCheckRunStatusCount: isObject(object.planCheckRunStatusCount)
        ? Object.entries(object.planCheckRunStatusCount).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Plan): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.uid !== "") {
      obj.uid = message.uid;
    }
    if (message.issue !== "") {
      obj.issue = message.issue;
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.steps?.length) {
      obj.steps = message.steps.map((e) => Plan_Step.toJSON(e));
    }
    if (message.vcsSource !== undefined) {
      obj.vcsSource = Plan_VCSSource.toJSON(message.vcsSource);
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.createTime !== undefined) {
      obj.createTime = message.createTime.toISOString();
    }
    if (message.updateTime !== undefined) {
      obj.updateTime = message.updateTime.toISOString();
    }
    if (message.planCheckRunStatusCount) {
      const entries = Object.entries(message.planCheckRunStatusCount);
      if (entries.length > 0) {
        obj.planCheckRunStatusCount = {};
        entries.forEach(([k, v]) => {
          obj.planCheckRunStatusCount[k] = Math.round(v);
        });
      }
    }
    return obj;
  },

  create(base?: DeepPartial<Plan>): Plan {
    return Plan.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan>): Plan {
    const message = createBasePlan();
    message.name = object.name ?? "";
    message.uid = object.uid ?? "";
    message.issue = object.issue ?? "";
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.steps = object.steps?.map((e) => Plan_Step.fromPartial(e)) || [];
    message.vcsSource = (object.vcsSource !== undefined && object.vcsSource !== null)
      ? Plan_VCSSource.fromPartial(object.vcsSource)
      : undefined;
    message.creator = object.creator ?? "";
    message.createTime = object.createTime ?? undefined;
    message.updateTime = object.updateTime ?? undefined;
    message.planCheckRunStatusCount = Object.entries(object.planCheckRunStatusCount ?? {}).reduce<
      { [key: string]: number }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = globalThis.Number(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBasePlan_Step(): Plan_Step {
  return { title: "", specs: [] };
}

export const Plan_Step = {
  encode(message: Plan_Step, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    for (const v of message.specs) {
      Plan_Spec.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_Step {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_Step();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break;
          }

          message.title = reader.string();
          continue;
        case 1:
          if (tag !== 10) {
            break;
          }

          message.specs.push(Plan_Spec.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_Step {
    return {
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      specs: globalThis.Array.isArray(object?.specs) ? object.specs.map((e: any) => Plan_Spec.fromJSON(e)) : [],
    };
  },

  toJSON(message: Plan_Step): unknown {
    const obj: any = {};
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.specs?.length) {
      obj.specs = message.specs.map((e) => Plan_Spec.toJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_Step>): Plan_Step {
    return Plan_Step.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_Step>): Plan_Step {
    const message = createBasePlan_Step();
    message.title = object.title ?? "";
    message.specs = object.specs?.map((e) => Plan_Spec.fromPartial(e)) || [];
    return message;
  },
};

function createBasePlan_Spec(): Plan_Spec {
  return {
    earliestAllowedTime: undefined,
    id: "",
    dependsOnSpecs: [],
    createDatabaseConfig: undefined,
    changeDatabaseConfig: undefined,
    exportDataConfig: undefined,
  };
}

export const Plan_Spec = {
  encode(message: Plan_Spec, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.earliestAllowedTime !== undefined) {
      Timestamp.encode(toTimestamp(message.earliestAllowedTime), writer.uint32(34).fork()).ldelim();
    }
    if (message.id !== "") {
      writer.uint32(42).string(message.id);
    }
    for (const v of message.dependsOnSpecs) {
      writer.uint32(50).string(v!);
    }
    if (message.createDatabaseConfig !== undefined) {
      Plan_CreateDatabaseConfig.encode(message.createDatabaseConfig, writer.uint32(10).fork()).ldelim();
    }
    if (message.changeDatabaseConfig !== undefined) {
      Plan_ChangeDatabaseConfig.encode(message.changeDatabaseConfig, writer.uint32(18).fork()).ldelim();
    }
    if (message.exportDataConfig !== undefined) {
      Plan_ExportDataConfig.encode(message.exportDataConfig, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_Spec {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_Spec();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 4:
          if (tag !== 34) {
            break;
          }

          message.earliestAllowedTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.id = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.dependsOnSpecs.push(reader.string());
          continue;
        case 1:
          if (tag !== 10) {
            break;
          }

          message.createDatabaseConfig = Plan_CreateDatabaseConfig.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.changeDatabaseConfig = Plan_ChangeDatabaseConfig.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.exportDataConfig = Plan_ExportDataConfig.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_Spec {
    return {
      earliestAllowedTime: isSet(object.earliestAllowedTime)
        ? fromJsonTimestamp(object.earliestAllowedTime)
        : undefined,
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      dependsOnSpecs: globalThis.Array.isArray(object?.dependsOnSpecs)
        ? object.dependsOnSpecs.map((e: any) => globalThis.String(e))
        : [],
      createDatabaseConfig: isSet(object.createDatabaseConfig)
        ? Plan_CreateDatabaseConfig.fromJSON(object.createDatabaseConfig)
        : undefined,
      changeDatabaseConfig: isSet(object.changeDatabaseConfig)
        ? Plan_ChangeDatabaseConfig.fromJSON(object.changeDatabaseConfig)
        : undefined,
      exportDataConfig: isSet(object.exportDataConfig)
        ? Plan_ExportDataConfig.fromJSON(object.exportDataConfig)
        : undefined,
    };
  },

  toJSON(message: Plan_Spec): unknown {
    const obj: any = {};
    if (message.earliestAllowedTime !== undefined) {
      obj.earliestAllowedTime = message.earliestAllowedTime.toISOString();
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.dependsOnSpecs?.length) {
      obj.dependsOnSpecs = message.dependsOnSpecs;
    }
    if (message.createDatabaseConfig !== undefined) {
      obj.createDatabaseConfig = Plan_CreateDatabaseConfig.toJSON(message.createDatabaseConfig);
    }
    if (message.changeDatabaseConfig !== undefined) {
      obj.changeDatabaseConfig = Plan_ChangeDatabaseConfig.toJSON(message.changeDatabaseConfig);
    }
    if (message.exportDataConfig !== undefined) {
      obj.exportDataConfig = Plan_ExportDataConfig.toJSON(message.exportDataConfig);
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_Spec>): Plan_Spec {
    return Plan_Spec.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_Spec>): Plan_Spec {
    const message = createBasePlan_Spec();
    message.earliestAllowedTime = object.earliestAllowedTime ?? undefined;
    message.id = object.id ?? "";
    message.dependsOnSpecs = object.dependsOnSpecs?.map((e) => e) || [];
    message.createDatabaseConfig = (object.createDatabaseConfig !== undefined && object.createDatabaseConfig !== null)
      ? Plan_CreateDatabaseConfig.fromPartial(object.createDatabaseConfig)
      : undefined;
    message.changeDatabaseConfig = (object.changeDatabaseConfig !== undefined && object.changeDatabaseConfig !== null)
      ? Plan_ChangeDatabaseConfig.fromPartial(object.changeDatabaseConfig)
      : undefined;
    message.exportDataConfig = (object.exportDataConfig !== undefined && object.exportDataConfig !== null)
      ? Plan_ExportDataConfig.fromPartial(object.exportDataConfig)
      : undefined;
    return message;
  },
};

function createBasePlan_PlanCheckRunStatusCountEntry(): Plan_PlanCheckRunStatusCountEntry {
  return { key: "", value: 0 };
}

export const Plan_PlanCheckRunStatusCountEntry = {
  encode(message: Plan_PlanCheckRunStatusCountEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).int32(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_PlanCheckRunStatusCountEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_PlanCheckRunStatusCountEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_PlanCheckRunStatusCountEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.Number(object.value) : 0,
    };
  },

  toJSON(message: Plan_PlanCheckRunStatusCountEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_PlanCheckRunStatusCountEntry>): Plan_PlanCheckRunStatusCountEntry {
    return Plan_PlanCheckRunStatusCountEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_PlanCheckRunStatusCountEntry>): Plan_PlanCheckRunStatusCountEntry {
    const message = createBasePlan_PlanCheckRunStatusCountEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

function createBasePlan_CreateDatabaseConfig(): Plan_CreateDatabaseConfig {
  return {
    target: "",
    database: "",
    table: "",
    characterSet: "",
    collation: "",
    cluster: "",
    owner: "",
    environment: "",
    labels: {},
  };
}

export const Plan_CreateDatabaseConfig = {
  encode(message: Plan_CreateDatabaseConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.database !== "") {
      writer.uint32(18).string(message.database);
    }
    if (message.table !== "") {
      writer.uint32(26).string(message.table);
    }
    if (message.characterSet !== "") {
      writer.uint32(34).string(message.characterSet);
    }
    if (message.collation !== "") {
      writer.uint32(42).string(message.collation);
    }
    if (message.cluster !== "") {
      writer.uint32(50).string(message.cluster);
    }
    if (message.owner !== "") {
      writer.uint32(58).string(message.owner);
    }
    if (message.environment !== "") {
      writer.uint32(74).string(message.environment);
    }
    Object.entries(message.labels).forEach(([key, value]) => {
      Plan_CreateDatabaseConfig_LabelsEntry.encode({ key: key as any, value }, writer.uint32(82).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_CreateDatabaseConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_CreateDatabaseConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.database = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.table = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.characterSet = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.collation = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.cluster = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.owner = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.environment = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          const entry10 = Plan_CreateDatabaseConfig_LabelsEntry.decode(reader, reader.uint32());
          if (entry10.value !== undefined) {
            message.labels[entry10.key] = entry10.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_CreateDatabaseConfig {
    return {
      target: isSet(object.target) ? globalThis.String(object.target) : "",
      database: isSet(object.database) ? globalThis.String(object.database) : "",
      table: isSet(object.table) ? globalThis.String(object.table) : "",
      characterSet: isSet(object.characterSet) ? globalThis.String(object.characterSet) : "",
      collation: isSet(object.collation) ? globalThis.String(object.collation) : "",
      cluster: isSet(object.cluster) ? globalThis.String(object.cluster) : "",
      owner: isSet(object.owner) ? globalThis.String(object.owner) : "",
      environment: isSet(object.environment) ? globalThis.String(object.environment) : "",
      labels: isObject(object.labels)
        ? Object.entries(object.labels).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Plan_CreateDatabaseConfig): unknown {
    const obj: any = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.database !== "") {
      obj.database = message.database;
    }
    if (message.table !== "") {
      obj.table = message.table;
    }
    if (message.characterSet !== "") {
      obj.characterSet = message.characterSet;
    }
    if (message.collation !== "") {
      obj.collation = message.collation;
    }
    if (message.cluster !== "") {
      obj.cluster = message.cluster;
    }
    if (message.owner !== "") {
      obj.owner = message.owner;
    }
    if (message.environment !== "") {
      obj.environment = message.environment;
    }
    if (message.labels) {
      const entries = Object.entries(message.labels);
      if (entries.length > 0) {
        obj.labels = {};
        entries.forEach(([k, v]) => {
          obj.labels[k] = v;
        });
      }
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_CreateDatabaseConfig>): Plan_CreateDatabaseConfig {
    return Plan_CreateDatabaseConfig.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_CreateDatabaseConfig>): Plan_CreateDatabaseConfig {
    const message = createBasePlan_CreateDatabaseConfig();
    message.target = object.target ?? "";
    message.database = object.database ?? "";
    message.table = object.table ?? "";
    message.characterSet = object.characterSet ?? "";
    message.collation = object.collation ?? "";
    message.cluster = object.cluster ?? "";
    message.owner = object.owner ?? "";
    message.environment = object.environment ?? "";
    message.labels = Object.entries(object.labels ?? {}).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = globalThis.String(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBasePlan_CreateDatabaseConfig_LabelsEntry(): Plan_CreateDatabaseConfig_LabelsEntry {
  return { key: "", value: "" };
}

export const Plan_CreateDatabaseConfig_LabelsEntry = {
  encode(message: Plan_CreateDatabaseConfig_LabelsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_CreateDatabaseConfig_LabelsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_CreateDatabaseConfig_LabelsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_CreateDatabaseConfig_LabelsEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: Plan_CreateDatabaseConfig_LabelsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_CreateDatabaseConfig_LabelsEntry>): Plan_CreateDatabaseConfig_LabelsEntry {
    return Plan_CreateDatabaseConfig_LabelsEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_CreateDatabaseConfig_LabelsEntry>): Plan_CreateDatabaseConfig_LabelsEntry {
    const message = createBasePlan_CreateDatabaseConfig_LabelsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePlan_ChangeDatabaseConfig(): Plan_ChangeDatabaseConfig {
  return {
    target: "",
    sheet: "",
    type: Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED,
    schemaVersion: "",
    ghostFlags: {},
    preUpdateBackupDetail: undefined,
  };
}

export const Plan_ChangeDatabaseConfig = {
  encode(message: Plan_ChangeDatabaseConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.sheet !== "") {
      writer.uint32(18).string(message.sheet);
    }
    if (message.type !== Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED) {
      writer.uint32(24).int32(plan_ChangeDatabaseConfig_TypeToNumber(message.type));
    }
    if (message.schemaVersion !== "") {
      writer.uint32(34).string(message.schemaVersion);
    }
    Object.entries(message.ghostFlags).forEach(([key, value]) => {
      Plan_ChangeDatabaseConfig_GhostFlagsEntry.encode({ key: key as any, value }, writer.uint32(58).fork()).ldelim();
    });
    if (message.preUpdateBackupDetail !== undefined) {
      Plan_ChangeDatabaseConfig_PreUpdateBackupDetail.encode(message.preUpdateBackupDetail, writer.uint32(66).fork())
        .ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_ChangeDatabaseConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_ChangeDatabaseConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.sheet = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.type = plan_ChangeDatabaseConfig_TypeFromJSON(reader.int32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.schemaVersion = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          const entry7 = Plan_ChangeDatabaseConfig_GhostFlagsEntry.decode(reader, reader.uint32());
          if (entry7.value !== undefined) {
            message.ghostFlags[entry7.key] = entry7.value;
          }
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.preUpdateBackupDetail = Plan_ChangeDatabaseConfig_PreUpdateBackupDetail.decode(
            reader,
            reader.uint32(),
          );
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_ChangeDatabaseConfig {
    return {
      target: isSet(object.target) ? globalThis.String(object.target) : "",
      sheet: isSet(object.sheet) ? globalThis.String(object.sheet) : "",
      type: isSet(object.type)
        ? plan_ChangeDatabaseConfig_TypeFromJSON(object.type)
        : Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED,
      schemaVersion: isSet(object.schemaVersion) ? globalThis.String(object.schemaVersion) : "",
      ghostFlags: isObject(object.ghostFlags)
        ? Object.entries(object.ghostFlags).reduce<{ [key: string]: string }>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
        : {},
      preUpdateBackupDetail: isSet(object.preUpdateBackupDetail)
        ? Plan_ChangeDatabaseConfig_PreUpdateBackupDetail.fromJSON(object.preUpdateBackupDetail)
        : undefined,
    };
  },

  toJSON(message: Plan_ChangeDatabaseConfig): unknown {
    const obj: any = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.sheet !== "") {
      obj.sheet = message.sheet;
    }
    if (message.type !== Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED) {
      obj.type = plan_ChangeDatabaseConfig_TypeToJSON(message.type);
    }
    if (message.schemaVersion !== "") {
      obj.schemaVersion = message.schemaVersion;
    }
    if (message.ghostFlags) {
      const entries = Object.entries(message.ghostFlags);
      if (entries.length > 0) {
        obj.ghostFlags = {};
        entries.forEach(([k, v]) => {
          obj.ghostFlags[k] = v;
        });
      }
    }
    if (message.preUpdateBackupDetail !== undefined) {
      obj.preUpdateBackupDetail = Plan_ChangeDatabaseConfig_PreUpdateBackupDetail.toJSON(message.preUpdateBackupDetail);
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_ChangeDatabaseConfig>): Plan_ChangeDatabaseConfig {
    return Plan_ChangeDatabaseConfig.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_ChangeDatabaseConfig>): Plan_ChangeDatabaseConfig {
    const message = createBasePlan_ChangeDatabaseConfig();
    message.target = object.target ?? "";
    message.sheet = object.sheet ?? "";
    message.type = object.type ?? Plan_ChangeDatabaseConfig_Type.TYPE_UNSPECIFIED;
    message.schemaVersion = object.schemaVersion ?? "";
    message.ghostFlags = Object.entries(object.ghostFlags ?? {}).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = globalThis.String(value);
        }
        return acc;
      },
      {},
    );
    message.preUpdateBackupDetail =
      (object.preUpdateBackupDetail !== undefined && object.preUpdateBackupDetail !== null)
        ? Plan_ChangeDatabaseConfig_PreUpdateBackupDetail.fromPartial(object.preUpdateBackupDetail)
        : undefined;
    return message;
  },
};

function createBasePlan_ChangeDatabaseConfig_GhostFlagsEntry(): Plan_ChangeDatabaseConfig_GhostFlagsEntry {
  return { key: "", value: "" };
}

export const Plan_ChangeDatabaseConfig_GhostFlagsEntry = {
  encode(message: Plan_ChangeDatabaseConfig_GhostFlagsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_ChangeDatabaseConfig_GhostFlagsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_ChangeDatabaseConfig_GhostFlagsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_ChangeDatabaseConfig_GhostFlagsEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: Plan_ChangeDatabaseConfig_GhostFlagsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_ChangeDatabaseConfig_GhostFlagsEntry>): Plan_ChangeDatabaseConfig_GhostFlagsEntry {
    return Plan_ChangeDatabaseConfig_GhostFlagsEntry.fromPartial(base ?? {});
  },
  fromPartial(
    object: DeepPartial<Plan_ChangeDatabaseConfig_GhostFlagsEntry>,
  ): Plan_ChangeDatabaseConfig_GhostFlagsEntry {
    const message = createBasePlan_ChangeDatabaseConfig_GhostFlagsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePlan_ChangeDatabaseConfig_PreUpdateBackupDetail(): Plan_ChangeDatabaseConfig_PreUpdateBackupDetail {
  return { database: "" };
}

export const Plan_ChangeDatabaseConfig_PreUpdateBackupDetail = {
  encode(
    message: Plan_ChangeDatabaseConfig_PreUpdateBackupDetail,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.database !== "") {
      writer.uint32(10).string(message.database);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_ChangeDatabaseConfig_PreUpdateBackupDetail {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_ChangeDatabaseConfig_PreUpdateBackupDetail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.database = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_ChangeDatabaseConfig_PreUpdateBackupDetail {
    return { database: isSet(object.database) ? globalThis.String(object.database) : "" };
  },

  toJSON(message: Plan_ChangeDatabaseConfig_PreUpdateBackupDetail): unknown {
    const obj: any = {};
    if (message.database !== "") {
      obj.database = message.database;
    }
    return obj;
  },

  create(
    base?: DeepPartial<Plan_ChangeDatabaseConfig_PreUpdateBackupDetail>,
  ): Plan_ChangeDatabaseConfig_PreUpdateBackupDetail {
    return Plan_ChangeDatabaseConfig_PreUpdateBackupDetail.fromPartial(base ?? {});
  },
  fromPartial(
    object: DeepPartial<Plan_ChangeDatabaseConfig_PreUpdateBackupDetail>,
  ): Plan_ChangeDatabaseConfig_PreUpdateBackupDetail {
    const message = createBasePlan_ChangeDatabaseConfig_PreUpdateBackupDetail();
    message.database = object.database ?? "";
    return message;
  },
};

function createBasePlan_ExportDataConfig(): Plan_ExportDataConfig {
  return { target: "", sheet: "", format: ExportFormat.FORMAT_UNSPECIFIED, password: undefined };
}

export const Plan_ExportDataConfig = {
  encode(message: Plan_ExportDataConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.sheet !== "") {
      writer.uint32(18).string(message.sheet);
    }
    if (message.format !== ExportFormat.FORMAT_UNSPECIFIED) {
      writer.uint32(24).int32(exportFormatToNumber(message.format));
    }
    if (message.password !== undefined) {
      writer.uint32(34).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_ExportDataConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_ExportDataConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.sheet = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.format = exportFormatFromJSON(reader.int32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_ExportDataConfig {
    return {
      target: isSet(object.target) ? globalThis.String(object.target) : "",
      sheet: isSet(object.sheet) ? globalThis.String(object.sheet) : "",
      format: isSet(object.format) ? exportFormatFromJSON(object.format) : ExportFormat.FORMAT_UNSPECIFIED,
      password: isSet(object.password) ? globalThis.String(object.password) : undefined,
    };
  },

  toJSON(message: Plan_ExportDataConfig): unknown {
    const obj: any = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.sheet !== "") {
      obj.sheet = message.sheet;
    }
    if (message.format !== ExportFormat.FORMAT_UNSPECIFIED) {
      obj.format = exportFormatToJSON(message.format);
    }
    if (message.password !== undefined) {
      obj.password = message.password;
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_ExportDataConfig>): Plan_ExportDataConfig {
    return Plan_ExportDataConfig.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_ExportDataConfig>): Plan_ExportDataConfig {
    const message = createBasePlan_ExportDataConfig();
    message.target = object.target ?? "";
    message.sheet = object.sheet ?? "";
    message.format = object.format ?? ExportFormat.FORMAT_UNSPECIFIED;
    message.password = object.password ?? undefined;
    return message;
  },
};

function createBasePlan_VCSSource(): Plan_VCSSource {
  return { vcsType: VCSType.VCS_TYPE_UNSPECIFIED, vcsConnector: "", pullRequestUrl: "" };
}

export const Plan_VCSSource = {
  encode(message: Plan_VCSSource, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.vcsType !== VCSType.VCS_TYPE_UNSPECIFIED) {
      writer.uint32(8).int32(vCSTypeToNumber(message.vcsType));
    }
    if (message.vcsConnector !== "") {
      writer.uint32(18).string(message.vcsConnector);
    }
    if (message.pullRequestUrl !== "") {
      writer.uint32(26).string(message.pullRequestUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Plan_VCSSource {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlan_VCSSource();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.vcsType = vCSTypeFromJSON(reader.int32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.vcsConnector = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pullRequestUrl = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Plan_VCSSource {
    return {
      vcsType: isSet(object.vcsType) ? vCSTypeFromJSON(object.vcsType) : VCSType.VCS_TYPE_UNSPECIFIED,
      vcsConnector: isSet(object.vcsConnector) ? globalThis.String(object.vcsConnector) : "",
      pullRequestUrl: isSet(object.pullRequestUrl) ? globalThis.String(object.pullRequestUrl) : "",
    };
  },

  toJSON(message: Plan_VCSSource): unknown {
    const obj: any = {};
    if (message.vcsType !== VCSType.VCS_TYPE_UNSPECIFIED) {
      obj.vcsType = vCSTypeToJSON(message.vcsType);
    }
    if (message.vcsConnector !== "") {
      obj.vcsConnector = message.vcsConnector;
    }
    if (message.pullRequestUrl !== "") {
      obj.pullRequestUrl = message.pullRequestUrl;
    }
    return obj;
  },

  create(base?: DeepPartial<Plan_VCSSource>): Plan_VCSSource {
    return Plan_VCSSource.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Plan_VCSSource>): Plan_VCSSource {
    const message = createBasePlan_VCSSource();
    message.vcsType = object.vcsType ?? VCSType.VCS_TYPE_UNSPECIFIED;
    message.vcsConnector = object.vcsConnector ?? "";
    message.pullRequestUrl = object.pullRequestUrl ?? "";
    return message;
  },
};

function createBaseListPlanCheckRunsRequest(): ListPlanCheckRunsRequest {
  return { parent: "", pageSize: 0, pageToken: "" };
}

export const ListPlanCheckRunsRequest = {
  encode(message: ListPlanCheckRunsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parent !== "") {
      writer.uint32(10).string(message.parent);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(26).string(message.pageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListPlanCheckRunsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListPlanCheckRunsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.parent = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.pageSize = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListPlanCheckRunsRequest {
    return {
      parent: isSet(object.parent) ? globalThis.String(object.parent) : "",
      pageSize: isSet(object.pageSize) ? globalThis.Number(object.pageSize) : 0,
      pageToken: isSet(object.pageToken) ? globalThis.String(object.pageToken) : "",
    };
  },

  toJSON(message: ListPlanCheckRunsRequest): unknown {
    const obj: any = {};
    if (message.parent !== "") {
      obj.parent = message.parent;
    }
    if (message.pageSize !== 0) {
      obj.pageSize = Math.round(message.pageSize);
    }
    if (message.pageToken !== "") {
      obj.pageToken = message.pageToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListPlanCheckRunsRequest>): ListPlanCheckRunsRequest {
    return ListPlanCheckRunsRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListPlanCheckRunsRequest>): ListPlanCheckRunsRequest {
    const message = createBaseListPlanCheckRunsRequest();
    message.parent = object.parent ?? "";
    message.pageSize = object.pageSize ?? 0;
    message.pageToken = object.pageToken ?? "";
    return message;
  },
};

function createBaseListPlanCheckRunsResponse(): ListPlanCheckRunsResponse {
  return { planCheckRuns: [], nextPageToken: "" };
}

export const ListPlanCheckRunsResponse = {
  encode(message: ListPlanCheckRunsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.planCheckRuns) {
      PlanCheckRun.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListPlanCheckRunsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListPlanCheckRunsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.planCheckRuns.push(PlanCheckRun.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nextPageToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ListPlanCheckRunsResponse {
    return {
      planCheckRuns: globalThis.Array.isArray(object?.planCheckRuns)
        ? object.planCheckRuns.map((e: any) => PlanCheckRun.fromJSON(e))
        : [],
      nextPageToken: isSet(object.nextPageToken) ? globalThis.String(object.nextPageToken) : "",
    };
  },

  toJSON(message: ListPlanCheckRunsResponse): unknown {
    const obj: any = {};
    if (message.planCheckRuns?.length) {
      obj.planCheckRuns = message.planCheckRuns.map((e) => PlanCheckRun.toJSON(e));
    }
    if (message.nextPageToken !== "") {
      obj.nextPageToken = message.nextPageToken;
    }
    return obj;
  },

  create(base?: DeepPartial<ListPlanCheckRunsResponse>): ListPlanCheckRunsResponse {
    return ListPlanCheckRunsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ListPlanCheckRunsResponse>): ListPlanCheckRunsResponse {
    const message = createBaseListPlanCheckRunsResponse();
    message.planCheckRuns = object.planCheckRuns?.map((e) => PlanCheckRun.fromPartial(e)) || [];
    message.nextPageToken = object.nextPageToken ?? "";
    return message;
  },
};

function createBaseRunPlanChecksRequest(): RunPlanChecksRequest {
  return { name: "" };
}

export const RunPlanChecksRequest = {
  encode(message: RunPlanChecksRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunPlanChecksRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunPlanChecksRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RunPlanChecksRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: RunPlanChecksRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create(base?: DeepPartial<RunPlanChecksRequest>): RunPlanChecksRequest {
    return RunPlanChecksRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RunPlanChecksRequest>): RunPlanChecksRequest {
    const message = createBaseRunPlanChecksRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseRunPlanChecksResponse(): RunPlanChecksResponse {
  return {};
}

export const RunPlanChecksResponse = {
  encode(_: RunPlanChecksResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RunPlanChecksResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRunPlanChecksResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): RunPlanChecksResponse {
    return {};
  },

  toJSON(_: RunPlanChecksResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<RunPlanChecksResponse>): RunPlanChecksResponse {
    return RunPlanChecksResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<RunPlanChecksResponse>): RunPlanChecksResponse {
    const message = createBaseRunPlanChecksResponse();
    return message;
  },
};

function createBasePlanCheckRun(): PlanCheckRun {
  return {
    name: "",
    uid: "",
    type: PlanCheckRun_Type.TYPE_UNSPECIFIED,
    status: PlanCheckRun_Status.STATUS_UNSPECIFIED,
    target: "",
    sheet: "",
    results: [],
    error: "",
    createTime: undefined,
  };
}

export const PlanCheckRun = {
  encode(message: PlanCheckRun, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.uid !== "") {
      writer.uint32(18).string(message.uid);
    }
    if (message.type !== PlanCheckRun_Type.TYPE_UNSPECIFIED) {
      writer.uint32(24).int32(planCheckRun_TypeToNumber(message.type));
    }
    if (message.status !== PlanCheckRun_Status.STATUS_UNSPECIFIED) {
      writer.uint32(32).int32(planCheckRun_StatusToNumber(message.status));
    }
    if (message.target !== "") {
      writer.uint32(42).string(message.target);
    }
    if (message.sheet !== "") {
      writer.uint32(50).string(message.sheet);
    }
    for (const v of message.results) {
      PlanCheckRun_Result.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.error !== "") {
      writer.uint32(66).string(message.error);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(toTimestamp(message.createTime), writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PlanCheckRun {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlanCheckRun();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.uid = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.type = planCheckRun_TypeFromJSON(reader.int32());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.status = planCheckRun_StatusFromJSON(reader.int32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.target = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.sheet = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.results.push(PlanCheckRun_Result.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.error = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.createTime = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlanCheckRun {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      uid: isSet(object.uid) ? globalThis.String(object.uid) : "",
      type: isSet(object.type) ? planCheckRun_TypeFromJSON(object.type) : PlanCheckRun_Type.TYPE_UNSPECIFIED,
      status: isSet(object.status)
        ? planCheckRun_StatusFromJSON(object.status)
        : PlanCheckRun_Status.STATUS_UNSPECIFIED,
      target: isSet(object.target) ? globalThis.String(object.target) : "",
      sheet: isSet(object.sheet) ? globalThis.String(object.sheet) : "",
      results: globalThis.Array.isArray(object?.results)
        ? object.results.map((e: any) => PlanCheckRun_Result.fromJSON(e))
        : [],
      error: isSet(object.error) ? globalThis.String(object.error) : "",
      createTime: isSet(object.createTime) ? fromJsonTimestamp(object.createTime) : undefined,
    };
  },

  toJSON(message: PlanCheckRun): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.uid !== "") {
      obj.uid = message.uid;
    }
    if (message.type !== PlanCheckRun_Type.TYPE_UNSPECIFIED) {
      obj.type = planCheckRun_TypeToJSON(message.type);
    }
    if (message.status !== PlanCheckRun_Status.STATUS_UNSPECIFIED) {
      obj.status = planCheckRun_StatusToJSON(message.status);
    }
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.sheet !== "") {
      obj.sheet = message.sheet;
    }
    if (message.results?.length) {
      obj.results = message.results.map((e) => PlanCheckRun_Result.toJSON(e));
    }
    if (message.error !== "") {
      obj.error = message.error;
    }
    if (message.createTime !== undefined) {
      obj.createTime = message.createTime.toISOString();
    }
    return obj;
  },

  create(base?: DeepPartial<PlanCheckRun>): PlanCheckRun {
    return PlanCheckRun.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PlanCheckRun>): PlanCheckRun {
    const message = createBasePlanCheckRun();
    message.name = object.name ?? "";
    message.uid = object.uid ?? "";
    message.type = object.type ?? PlanCheckRun_Type.TYPE_UNSPECIFIED;
    message.status = object.status ?? PlanCheckRun_Status.STATUS_UNSPECIFIED;
    message.target = object.target ?? "";
    message.sheet = object.sheet ?? "";
    message.results = object.results?.map((e) => PlanCheckRun_Result.fromPartial(e)) || [];
    message.error = object.error ?? "";
    message.createTime = object.createTime ?? undefined;
    return message;
  },
};

function createBasePlanCheckRun_Result(): PlanCheckRun_Result {
  return {
    status: PlanCheckRun_Result_Status.STATUS_UNSPECIFIED,
    title: "",
    content: "",
    code: 0,
    sqlSummaryReport: undefined,
    sqlReviewReport: undefined,
  };
}

export const PlanCheckRun_Result = {
  encode(message: PlanCheckRun_Result, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== PlanCheckRun_Result_Status.STATUS_UNSPECIFIED) {
      writer.uint32(8).int32(planCheckRun_Result_StatusToNumber(message.status));
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.content !== "") {
      writer.uint32(26).string(message.content);
    }
    if (message.code !== 0) {
      writer.uint32(32).int32(message.code);
    }
    if (message.sqlSummaryReport !== undefined) {
      PlanCheckRun_Result_SqlSummaryReport.encode(message.sqlSummaryReport, writer.uint32(42).fork()).ldelim();
    }
    if (message.sqlReviewReport !== undefined) {
      PlanCheckRun_Result_SqlReviewReport.encode(message.sqlReviewReport, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PlanCheckRun_Result {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlanCheckRun_Result();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.status = planCheckRun_Result_StatusFromJSON(reader.int32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.title = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.content = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.code = reader.int32();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.sqlSummaryReport = PlanCheckRun_Result_SqlSummaryReport.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.sqlReviewReport = PlanCheckRun_Result_SqlReviewReport.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlanCheckRun_Result {
    return {
      status: isSet(object.status)
        ? planCheckRun_Result_StatusFromJSON(object.status)
        : PlanCheckRun_Result_Status.STATUS_UNSPECIFIED,
      title: isSet(object.title) ? globalThis.String(object.title) : "",
      content: isSet(object.content) ? globalThis.String(object.content) : "",
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      sqlSummaryReport: isSet(object.sqlSummaryReport)
        ? PlanCheckRun_Result_SqlSummaryReport.fromJSON(object.sqlSummaryReport)
        : undefined,
      sqlReviewReport: isSet(object.sqlReviewReport)
        ? PlanCheckRun_Result_SqlReviewReport.fromJSON(object.sqlReviewReport)
        : undefined,
    };
  },

  toJSON(message: PlanCheckRun_Result): unknown {
    const obj: any = {};
    if (message.status !== PlanCheckRun_Result_Status.STATUS_UNSPECIFIED) {
      obj.status = planCheckRun_Result_StatusToJSON(message.status);
    }
    if (message.title !== "") {
      obj.title = message.title;
    }
    if (message.content !== "") {
      obj.content = message.content;
    }
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    if (message.sqlSummaryReport !== undefined) {
      obj.sqlSummaryReport = PlanCheckRun_Result_SqlSummaryReport.toJSON(message.sqlSummaryReport);
    }
    if (message.sqlReviewReport !== undefined) {
      obj.sqlReviewReport = PlanCheckRun_Result_SqlReviewReport.toJSON(message.sqlReviewReport);
    }
    return obj;
  },

  create(base?: DeepPartial<PlanCheckRun_Result>): PlanCheckRun_Result {
    return PlanCheckRun_Result.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PlanCheckRun_Result>): PlanCheckRun_Result {
    const message = createBasePlanCheckRun_Result();
    message.status = object.status ?? PlanCheckRun_Result_Status.STATUS_UNSPECIFIED;
    message.title = object.title ?? "";
    message.content = object.content ?? "";
    message.code = object.code ?? 0;
    message.sqlSummaryReport = (object.sqlSummaryReport !== undefined && object.sqlSummaryReport !== null)
      ? PlanCheckRun_Result_SqlSummaryReport.fromPartial(object.sqlSummaryReport)
      : undefined;
    message.sqlReviewReport = (object.sqlReviewReport !== undefined && object.sqlReviewReport !== null)
      ? PlanCheckRun_Result_SqlReviewReport.fromPartial(object.sqlReviewReport)
      : undefined;
    return message;
  },
};

function createBasePlanCheckRun_Result_SqlSummaryReport(): PlanCheckRun_Result_SqlSummaryReport {
  return { code: 0, statementTypes: [], affectedRows: 0, changedResources: undefined };
}

export const PlanCheckRun_Result_SqlSummaryReport = {
  encode(message: PlanCheckRun_Result_SqlSummaryReport, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    for (const v of message.statementTypes) {
      writer.uint32(18).string(v!);
    }
    if (message.affectedRows !== 0) {
      writer.uint32(24).int32(message.affectedRows);
    }
    if (message.changedResources !== undefined) {
      ChangedResources.encode(message.changedResources, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PlanCheckRun_Result_SqlSummaryReport {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlanCheckRun_Result_SqlSummaryReport();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.statementTypes.push(reader.string());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.affectedRows = reader.int32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.changedResources = ChangedResources.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlanCheckRun_Result_SqlSummaryReport {
    return {
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      statementTypes: globalThis.Array.isArray(object?.statementTypes)
        ? object.statementTypes.map((e: any) => globalThis.String(e))
        : [],
      affectedRows: isSet(object.affectedRows) ? globalThis.Number(object.affectedRows) : 0,
      changedResources: isSet(object.changedResources) ? ChangedResources.fromJSON(object.changedResources) : undefined,
    };
  },

  toJSON(message: PlanCheckRun_Result_SqlSummaryReport): unknown {
    const obj: any = {};
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    if (message.statementTypes?.length) {
      obj.statementTypes = message.statementTypes;
    }
    if (message.affectedRows !== 0) {
      obj.affectedRows = Math.round(message.affectedRows);
    }
    if (message.changedResources !== undefined) {
      obj.changedResources = ChangedResources.toJSON(message.changedResources);
    }
    return obj;
  },

  create(base?: DeepPartial<PlanCheckRun_Result_SqlSummaryReport>): PlanCheckRun_Result_SqlSummaryReport {
    return PlanCheckRun_Result_SqlSummaryReport.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PlanCheckRun_Result_SqlSummaryReport>): PlanCheckRun_Result_SqlSummaryReport {
    const message = createBasePlanCheckRun_Result_SqlSummaryReport();
    message.code = object.code ?? 0;
    message.statementTypes = object.statementTypes?.map((e) => e) || [];
    message.affectedRows = object.affectedRows ?? 0;
    message.changedResources = (object.changedResources !== undefined && object.changedResources !== null)
      ? ChangedResources.fromPartial(object.changedResources)
      : undefined;
    return message;
  },
};

function createBasePlanCheckRun_Result_SqlReviewReport(): PlanCheckRun_Result_SqlReviewReport {
  return { line: 0, column: 0, detail: "", code: 0 };
}

export const PlanCheckRun_Result_SqlReviewReport = {
  encode(message: PlanCheckRun_Result_SqlReviewReport, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.line !== 0) {
      writer.uint32(8).int32(message.line);
    }
    if (message.column !== 0) {
      writer.uint32(16).int32(message.column);
    }
    if (message.detail !== "") {
      writer.uint32(26).string(message.detail);
    }
    if (message.code !== 0) {
      writer.uint32(32).int32(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PlanCheckRun_Result_SqlReviewReport {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePlanCheckRun_Result_SqlReviewReport();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.line = reader.int32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.column = reader.int32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.detail = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.code = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PlanCheckRun_Result_SqlReviewReport {
    return {
      line: isSet(object.line) ? globalThis.Number(object.line) : 0,
      column: isSet(object.column) ? globalThis.Number(object.column) : 0,
      detail: isSet(object.detail) ? globalThis.String(object.detail) : "",
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
    };
  },

  toJSON(message: PlanCheckRun_Result_SqlReviewReport): unknown {
    const obj: any = {};
    if (message.line !== 0) {
      obj.line = Math.round(message.line);
    }
    if (message.column !== 0) {
      obj.column = Math.round(message.column);
    }
    if (message.detail !== "") {
      obj.detail = message.detail;
    }
    if (message.code !== 0) {
      obj.code = Math.round(message.code);
    }
    return obj;
  },

  create(base?: DeepPartial<PlanCheckRun_Result_SqlReviewReport>): PlanCheckRun_Result_SqlReviewReport {
    return PlanCheckRun_Result_SqlReviewReport.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PlanCheckRun_Result_SqlReviewReport>): PlanCheckRun_Result_SqlReviewReport {
    const message = createBasePlanCheckRun_Result_SqlReviewReport();
    message.line = object.line ?? 0;
    message.column = object.column ?? 0;
    message.detail = object.detail ?? "";
    message.code = object.code ?? 0;
    return message;
  },
};

export type PlanServiceDefinition = typeof PlanServiceDefinition;
export const PlanServiceDefinition = {
  name: "PlanService",
  fullName: "bytebase.v1.PlanService",
  methods: {
    getPlan: {
      name: "GetPlan",
      requestType: GetPlanRequest,
      requestStream: false,
      responseType: Plan,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([4, 110, 97, 109, 101])],
          578365826: [
            new Uint8Array([
              31,
              18,
              29,
              47,
              118,
              49,
              47,
              123,
              110,
              97,
              109,
              101,
              61,
              112,
              114,
              111,
              106,
              101,
              99,
              116,
              115,
              47,
              42,
              47,
              112,
              108,
              97,
              110,
              115,
              47,
              42,
              125,
            ]),
          ],
        },
      },
    },
    listPlans: {
      name: "ListPlans",
      requestType: ListPlansRequest,
      requestStream: false,
      responseType: ListPlansResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([6, 112, 97, 114, 101, 110, 116])],
          578365826: [
            new Uint8Array([
              31,
              18,
              29,
              47,
              118,
              49,
              47,
              123,
              112,
              97,
              114,
              101,
              110,
              116,
              61,
              112,
              114,
              111,
              106,
              101,
              99,
              116,
              115,
              47,
              42,
              125,
              47,
              112,
              108,
              97,
              110,
              115,
            ]),
          ],
        },
      },
    },
    searchPlans: {
      name: "SearchPlans",
      requestType: SearchPlansRequest,
      requestStream: false,
      responseType: SearchPlansResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([6, 112, 97, 114, 101, 110, 116])],
          578365826: [
            new Uint8Array([
              38,
              18,
              36,
              47,
              118,
              49,
              47,
              123,
              112,
              97,
              114,
              101,
              110,
              116,
              61,
              112,
              114,
              111,
              106,
              101,
              99,
              116,
              115,
              47,
              42,
              125,
              47,
              112,
              108,
              97,
              110,
              115,
              58,
              115,
              101,
              97,
              114,
              99,
              104,
            ]),
          ],
        },
      },
    },
    createPlan: {
      name: "CreatePlan",
      requestType: CreatePlanRequest,
      requestStream: false,
      responseType: Plan,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([11, 112, 97, 114, 101, 110, 116, 44, 112, 108, 97, 110])],
          578365826: [
            new Uint8Array([
              37,
              58,
              4,
              112,
              108,
              97,
              110,
              34,
              29,
              47,
              118,
              49,
              47,
              123,
              112,
              97,
              114,
              101,
              110,
              116,
              61,
              112,
              114,
              111,
              106,
              101,
              99,
              116,
              115,
              47,
              42,
              125,
              47,
              112,
              108,
              97,
              110,
              115,
            ]),
          ],
        },
      },
    },
    updatePlan: {
      name: "UpdatePlan",
      requestType: UpdatePlanRequest,
      requestStream: false,
      responseType: Plan,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([16, 112, 108, 97, 110, 44, 117, 112, 100, 97, 116, 101, 95, 109, 97, 115, 107])],
          578365826: [
            new Uint8Array([
              42,
              58,
              4,
              112,
              108,
              97,
              110,
              50,
              34,
              47,
              118,
              49,
              47,
              123,
              112,
              108,
              97,
              110,
              46,
              110,
              97,
              109,
              101,
              61,
              112,
              114,
              111,
              106,
              101,
              99,
              116,
              115,
              47,
              42,
              47,
              112,
              108,
              97,
              110,
              115,
              47,
              42,
              125,
            ]),
          ],
        },
      },
    },
    listPlanCheckRuns: {
      name: "ListPlanCheckRuns",
      requestType: ListPlanCheckRunsRequest,
      requestStream: false,
      responseType: ListPlanCheckRunsResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([6, 112, 97, 114, 101, 110, 116])],
          578365826: [
            new Uint8Array([
              47,
              18,
              45,
              47,
              118,
              49,
              47,
              123,
              112,
              97,
              114,
              101,
              110,
              116,
              61,
              112,
              114,
              111,
              106,
              101,
              99,
              116,
              115,
              47,
              42,
              47,
              112,
              108,
              97,
              110,
              115,
              47,
              42,
              125,
              47,
              112,
              108,
              97,
              110,
              67,
              104,
              101,
              99,
              107,
              82,
              117,
              110,
              115,
            ]),
          ],
        },
      },
    },
    runPlanChecks: {
      name: "RunPlanChecks",
      requestType: RunPlanChecksRequest,
      requestStream: false,
      responseType: RunPlanChecksResponse,
      responseStream: false,
      options: {
        _unknownFields: {
          8410: [new Uint8Array([4, 110, 97, 109, 101])],
          578365826: [
            new Uint8Array([
              48,
              58,
              1,
              42,
              34,
              43,
              47,
              118,
              49,
              47,
              123,
              110,
              97,
              109,
              101,
              61,
              112,
              114,
              111,
              106,
              101,
              99,
              116,
              115,
              47,
              42,
              47,
              112,
              108,
              97,
              110,
              115,
              47,
              42,
              125,
              58,
              114,
              117,
              110,
              80,
              108,
              97,
              110,
              67,
              104,
              101,
              99,
              107,
              115,
            ]),
          ],
        },
      },
    },
  },
} as const;

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Long ? string | number | Long : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds.toNumber() || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
