import { RunResult } from "sqlite3";
import { CommandType, Commands } from "../constants";
import { SqlLiteData } from "../data";
import { CreateDevicesRequest, CommandTypeResult, CreateConnectionsRequest, ModifyDeviceStrengthRequest } from "../interfaces";

export class ProcessCommand {
  public static async processCommand(database: SqlLiteData, body: string): Promise<RunResult | undefined> {
    try {
      const command = ProcessCommand.readCommand(body);
      switch(command.type) {
        case CommandType.CREATE:
          if (command.command === Commands.DEVICES) {
            const { name, type, strength } = command.value as CreateDevicesRequest;
            const result = await database.createDevice(name, type, strength && !isNaN(Number(strength)) ? Number(strength) : undefined);
            return result;
          } else if (command.command === Commands.CONNECTIONS) {
            const { source, targets } = command.value as CreateConnectionsRequest;
            const result = await database.createConnection(source, targets);
            return result;
          }
          break;
        case CommandType.FETCH:
          if (command.command === Commands.DEVICES) {
            const result = await database.fetchDevice();
            return result;
          }
          break;
        case CommandType.MODIFY:
          if (command.command === Commands.DEVICES && command.deviceName) {
            const strength = (command.value as ModifyDeviceStrengthRequest).value;
            const result = await database.modifyDeviceStrength(command.deviceName, strength && !isNaN(Number(strength)) ? Number(strength) : undefined);
            return result;
          } else if (command.command === Commands.INFO_ROUTES) {
            return undefined;
          }
          break;
      }
      return undefined;
    } catch (error) {
      console.error(`Failed to process command due to: ${error.message}`);
      throw new Error("Bad Request");
    }
  }

  private static readCommand(body: string): CommandTypeResult {
    const bodyLines = body.split("\n");
    const commandLine = bodyLines?.[0].split(" ");
    const bodyLine = bodyLines?.[2];

    return {
      type: ProcessCommand.mapStringToCommandType(commandLine[0]),
      command: ProcessCommand.mapStringToCommand(commandLine[1]),
      value: bodyLine ? JSON.parse(bodyLine) : undefined,
      deviceName: commandLine[1]?.split("/")?.[2]
    };
  }

  private static mapStringToCommandType(commandTypeString: string): CommandType {
    switch(commandTypeString) {
      case "CREATE":
        return CommandType.CREATE;
      case "MODIFY":
        return CommandType.MODIFY;
      case "FETCH":
        return CommandType.FETCH;
    }
    throw new Error("Invalid command type");
  }

  private static mapStringToCommand(commandString: string): Commands {
    switch(commandString) {
      case "/devices":
        return Commands.DEVICES;
      case "/connections":
        return Commands.CONNECTIONS;
    }
    if (commandString.match(new RegExp("/devices.*/strength"))) {
      return Commands.DEVICES;
    } else if (commandString.match(new RegExp("/info-routes?from=.*to=.*"))) {
      return Commands.INFO_ROUTES;
    }
    throw new Error("Invalid command");
  }
}