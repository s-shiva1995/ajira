"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessCommand = void 0;
var constants_1 = require("../constants");
var ProcessCommand = /** @class */ (function () {
    function ProcessCommand() {
    }
    ProcessCommand.processCommand = function (database, body) {
        return __awaiter(this, void 0, void 0, function () {
            var command, _a, _b, name_1, type, strength, result, _c, source, targets, result, result, strength, result, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 13, , 14]);
                        command = ProcessCommand.readCommand(body);
                        _a = command.type;
                        switch (_a) {
                            case constants_1.CommandType.CREATE: return [3 /*break*/, 1];
                            case constants_1.CommandType.FETCH: return [3 /*break*/, 6];
                            case constants_1.CommandType.MODIFY: return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 12];
                    case 1:
                        if (!(command.command === constants_1.Commands.DEVICES)) return [3 /*break*/, 3];
                        _b = command.value, name_1 = _b.name, type = _b.type, strength = _b.strength;
                        return [4 /*yield*/, database.createDevice(name_1, type, strength && !isNaN(Number(strength)) ? Number(strength) : undefined)];
                    case 2:
                        result = _d.sent();
                        console.log("2-------", command.type, result);
                        return [2 /*return*/, result];
                    case 3:
                        if (!(command.command === constants_1.Commands.CONNECTIONS)) return [3 /*break*/, 5];
                        _c = command.value, source = _c.source, targets = _c.targets;
                        return [4 /*yield*/, database.createConnection(source, targets)];
                    case 4:
                        result = _d.sent();
                        console.log("2-------", command.type, result);
                        return [2 /*return*/, result];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        if (!(command.command === constants_1.Commands.DEVICES)) return [3 /*break*/, 8];
                        return [4 /*yield*/, database.fetchDevice()];
                    case 7:
                        result = _d.sent();
                        console.log("2-------", command.type, result);
                        return [2 /*return*/, result];
                    case 8: return [3 /*break*/, 12];
                    case 9:
                        if (!(command.command === constants_1.Commands.DEVICES && command.deviceName)) return [3 /*break*/, 11];
                        strength = command.value.value;
                        return [4 /*yield*/, database.modifyDeviceStrength(command.deviceName, strength && !isNaN(Number(strength)) ? Number(strength) : undefined)];
                    case 10:
                        result = _d.sent();
                        console.log("2-------", command.type, result);
                        return [2 /*return*/, result];
                    case 11: return [3 /*break*/, 12];
                    case 12: return [2 /*return*/, undefined];
                    case 13:
                        error_1 = _d.sent();
                        console.log("1------", error_1);
                        console.error("Failed to process command due to: " + error_1.message);
                        throw new Error("Bad Request");
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    ProcessCommand.readCommand = function (body) {
        var _a, _b;
        var bodyLines = body.split("\n");
        var commandLine = bodyLines === null || bodyLines === void 0 ? void 0 : bodyLines[0].split(" ");
        var bodyLine = bodyLines === null || bodyLines === void 0 ? void 0 : bodyLines[2];
        return {
            type: ProcessCommand.mapStringToCommandType(commandLine[0]),
            command: ProcessCommand.mapStringToCommand(commandLine[1]),
            value: bodyLine ? JSON.parse(bodyLine) : undefined,
            deviceName: (_b = (_a = commandLine[1]) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b[2]
        };
    };
    ProcessCommand.mapStringToCommandType = function (commandTypeString) {
        switch (commandTypeString) {
            case "CREATE":
                return constants_1.CommandType.CREATE;
            case "MODIFY":
                return constants_1.CommandType.MODIFY;
            case "FETCH":
                return constants_1.CommandType.FETCH;
        }
        throw new Error("Invalid command type");
    };
    ProcessCommand.mapStringToCommand = function (commandString) {
        switch (commandString) {
            case "/devices":
                return constants_1.Commands.DEVICES;
            case "/connections":
                return constants_1.Commands.CONNECTIONS;
            case "/info-routes":
                return constants_1.Commands.INFO_ROUTES;
        }
        if (commandString.match(new RegExp("/devices.*/strength"))) {
            return constants_1.Commands.DEVICES;
        }
        throw new Error("Invalid command");
    };
    return ProcessCommand;
}());
exports.ProcessCommand = ProcessCommand;
