const { JsonDB, Config } = require("node-json-db");

module.exports = {
  moment: require("moment"),
  getDB: (filename) => {
    return new JsonDB(new Config(`DB/${filename}`, true, true, "/"));
  },
  nullSignature:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABLCAYAAACGGCK3AAAAAXNSR0IArs4c6QAAARJJREFUeF7t00ERAAAIhECvf2lr7AMTMODtOsrAKJpgriDYExSkIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbz5rwATN41fQwAAAAASUVORK5CYII=",
};
