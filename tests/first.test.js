var bass = require("../index");
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

const basePath = path.join(__dirname, "lib", getPlatformDependencies());

const basslib = new bass({ basePath: basePath });

/////////////////////////PRETEST//////////////////////////////////

test("BASS_GetVersion", () => {
  expect(basslib.BASS_GetVersion()).toBe(33820416);
});
