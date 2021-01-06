var getBass = require("../tools/getBass");

const path = require("path");
var getPlatformDependenciesForOneFile = require("../tools/getPlatformDependenciesForOneFile");

var basslib = getBass({
  silent: true,
  generatedFfiFunDeclaration: {
    bass: {
      ffiFunDeclaration: {
        BASS_IsStarted: ["bool", []],
      },
    },
    webm: getPlatformDependenciesForOneFile(
      {
        BASS_WEBM_StreamCreateURL: [
          "int",
          ["string", "int", "int", "pointer", "pointer", "int"],
        ],
      },
      path.join(__dirname, "lib", "macOs", "libbasswebm.dylib"),
      path.join(__dirname, "lib", "win32", "basswebm.dll"),
      path.join(__dirname, "lib", "win64", "basswebm.dll"),
      path.join(__dirname, "lib", "linux32", "libbasswebm.so"),
      path.join(__dirname, "lib", "linux64", "libbasswebm.so")
    ),
  },
});

// const os = require("os");
// if (os.platform() !== "darwin") { // same folder, no problem on mac
basslib.EnableWebm(true);

test("test full new lib file linking", () => {
  expect(basslib.BASS_WEBM_StreamCreateURL()).toBe(0);
});

test("Is bass well loaded?", () => {
  expect(basslib.BASS_GetVersion()).toBe(33820416);
});
// }

test("test add a single fun to base lib bass", () => {
  expect(basslib.BASS_IsStarted()).toBe(false);
});
