const fs = require("fs");
const path = require("path");

exports.writeToJson = ({ data, folder = "dist", filename }) => {
  fs.mkdir(
    path.join(__dirname, "../../", folder),
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );

  fs.writeFile(
    path.join(__dirname, "../../", folder, filename),
    JSON.stringify(data, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("could not save shareholders to file.");
      } else {
        console.log("Wrote to dist.");
      }
    }
  );
};
