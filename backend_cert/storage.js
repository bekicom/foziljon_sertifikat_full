const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "db.json");

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(
      dataFile,
      JSON.stringify(
        {
          users: [
            {
              _id: "local-root-admin",
              username: "admin",
              password: "0000",
              role: "root",
              name: "Root",
              lastname: "Admin",
              subject: "root",
              permission: true,
            },
          ],
          certificates: [],
        },
        null,
        2
      )
    );
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeDb(db) {
  ensureDb();
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

function isMongoConnected() {
  return Boolean(process.env.DB_CONNECTION);
}

module.exports = {
  isMongoConnected,
  readDb,
  writeDb,
};
