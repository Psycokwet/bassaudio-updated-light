function getBass(options) {
  if (!options) options = {};
  var bass = require("../");

  const os = require("os");
  const path = require("path");

  function getPlatformDependencies() {
    let platform = os.platform();
    let arch = os.arch();

    switch (platform) {
      case "win32":
        if (arch == "x64") {
          return "win64";
        } else if (arch == "x86") {
          return "win32";
        } else {
          return null;
        }
      case "darwin":
        return "macOs";
      case "linux":
        if (arch == "x64") {
          return "linux64";
        } else if (arch == "x86") {
          return "linux32";
        } else {
          return null;
        }
    }
    return null;
  }

  const basePath = path.join(
    path.join(process.cwd(), "tests", "lib", getPlatformDependencies())
  );

  options.basePath = basePath;
  return new bass(options);
}

exports = module.exports = getBass;
