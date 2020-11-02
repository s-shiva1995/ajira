import * as sqlite from "sqlite3";
import * as uuid from "uuid";
import { DeviceType } from "../constants";

export class SqlLiteData {
  db: sqlite.Database;
  constructor() {
    this.db = SqlLiteData.connect();
  }

  public init(): void {
    const devices = `CREATE TABLE IF NOT EXISTS devices (
      id string PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      strength INTEGER DEFAULT 5 CHECK(strength>=0)
    )`;
    const connections = `CREATE TABLE IF NOT EXISTS connections (
      source TEXT PRIMARY KEY,
      targets TEXT NOT NULL,
      FOREIGN KEY (source) REFERENCES devices (name)
    )`;
    const network = `CREATE TABLE IF NOT EXISTS network (
      name TEXT,
      connections TEXT NOT NULL,
      FOREIGN KEY (name) REFERENCES devices (name)
    )`;
    this.db.serialize(() => {
      this.db.run(devices)
        .run(connections)
        .run(network);
    });
  }

  public createDevice(name: string, type: DeviceType, strength = 5): Promise<sqlite.RunResult> {
    const insert = "INSERT INTO devices (id, name, type, strength) VALUES (?, ?, ?, ?)";
    const params = [uuid.v4(), name, type, strength];

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(insert, params, (result: sqlite.RunResult, error: Error | null) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      });
    });
  }

  public modifyDeviceStrength(name: string, strength = 5): Promise<sqlite.RunResult> {
    const update = "UPDATE devices SET strength = ? WHERE name = ?";
    const params = [strength, name];

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(update, params, (result: sqlite.RunResult, error: Error | null) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      });
    });
  }

  public fetchDevice(): Promise<sqlite.RunResult> {
    const fetch = "SELECT * FROM devices";

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all(fetch, (error: Error | null, result: sqlite.RunResult) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      });
    });
  }

  public createConnection(source: string, targets: string[]): Promise<sqlite.RunResult> {
    const insert = "INSERT INTO connections (source, targets) VALUES (?, ?)";
    const params = [source, targets.toString()];

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(insert, params, (result: sqlite.RunResult, error: Error | null) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        });
      });
    });
  }

  private static connect(): sqlite.Database {
    const sqlite3 = sqlite.verbose();

    try {
      const database = new sqlite3.Database(":memory:");
      console.info("Connected to database");
      return database;
    } catch (error) {
      console.error(`Failed to connect to database: ${error.message}`);
      throw error;
    }
  }
}
