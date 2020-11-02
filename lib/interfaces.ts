import { Commands, CommandType, DeviceType } from "./constants";

export interface CreateDevicesRequest {
  type: DeviceType;
  name: string;
  strength?: string;
}

export interface CreateConnectionsRequest {
  source: string;
  targets: string[];
}

export interface ModifyDeviceStrengthRequest {
  value: string;
}

export interface FetchInfoRoutesRequest {
  from: string;
  to: string;
}

export interface CommandTypeResult {
  type: CommandType;
  command: Commands;
  value?: CreateDevicesRequest | CreateConnectionsRequest | ModifyDeviceStrengthRequest | FetchInfoRoutesRequest;
  deviceName?: string;
}