"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlLiteData = void 0;
var sqlite = __importStar(require("sqlite3"));
var uuid = __importStar(require("uuid"));
var SqlLiteData = /** @class */ (function () {
    function SqlLiteData() {
        this.db = SqlLiteData.connect();
    }
    SqlLiteData.prototype.init = function () {
        var _this = this;
        var devices = "CREATE TABLE IF NOT EXISTS devices (\n      id string PRIMARY KEY,\n      name TEXT NOT NULL UNIQUE,\n      type TEXT NOT NULL,\n      strength INTEGER DEFAULT 5 CHECK(strength>=0)\n    )";
        var connections = "CREATE TABLE IF NOT EXISTS connections (\n      source TEXT PRIMARY KEY,\n      targets TEXT NOT NULL,\n      FOREIGN KEY (source) REFERENCES devices (name)\n    )";
        this.db.serialize(function () {
            _this.db.run(devices)
                .run(connections);
        });
    };
    SqlLiteData.prototype.createDevice = function (name, type, strength) {
        var _this = this;
        if (strength === void 0) { strength = 5; }
        var insert = "INSERT INTO devices (id, name, type, strength) VALUES (?, ?, ?, ?)";
        var params = [uuid.v4(), name, type, strength];
        return new Promise(function (resolve, reject) {
            _this.db.serialize(function () {
                _this.db.run(insert, params, function (result, error) {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });
        });
    };
    SqlLiteData.prototype.modifyDeviceStrength = function (name, strength) {
        var _this = this;
        if (strength === void 0) { strength = 5; }
        var update = "UPDATE devices SET strength = ? WHERE name = ?";
        var params = [strength, name];
        return new Promise(function (resolve, reject) {
            _this.db.serialize(function () {
                _this.db.run(update, params, function (result, error) {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });
        });
    };
    SqlLiteData.prototype.fetchDevice = function () {
        var _this = this;
        var fetch = "SELECT * FROM devices";
        return new Promise(function (resolve, reject) {
            _this.db.serialize(function () {
                _this.db.all(fetch, function (error, result) {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });
        });
    };
    SqlLiteData.prototype.createConnection = function (source, targets) {
        var _this = this;
        var insert = "INSERT INTO connections (source, targets) VALUES (?, ?)";
        var params = [source, targets.toString()];
        return new Promise(function (resolve, reject) {
            _this.db.serialize(function () {
                _this.db.run(insert, params, function (result, error) {
                    if (error) {
                        reject(error);
                    }
                    resolve(result);
                });
            });
        });
    };
    SqlLiteData.connect = function () {
        var sqlite3 = sqlite.verbose();
        try {
            var database = new sqlite3.Database("./db/test.db");
            console.info("Connected to database");
            return database;
        }
        catch (error) {
            console.error("Failed to connect to database: " + error.message);
            throw error;
        }
    };
    return SqlLiteData;
}());
exports.SqlLiteData = SqlLiteData;
