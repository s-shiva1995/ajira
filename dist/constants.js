"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = exports.CommandType = exports.DeviceType = void 0;
var DeviceType;
(function (DeviceType) {
    DeviceType["COMPUTER"] = "COMPUTER";
    DeviceType["REPEATER"] = "REPEATER";
})(DeviceType = exports.DeviceType || (exports.DeviceType = {}));
var CommandType;
(function (CommandType) {
    CommandType["CREATE"] = "CREATE";
    CommandType["MODIFY"] = "MODIFY";
    CommandType["FETCH"] = "FETCH";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
var Commands;
(function (Commands) {
    Commands["DEVICES"] = "/devices";
    Commands["CONNECTIONS"] = "/connections";
    Commands["INFO_ROUTES"] = "/info-routes";
})(Commands = exports.Commands || (exports.Commands = {}));
