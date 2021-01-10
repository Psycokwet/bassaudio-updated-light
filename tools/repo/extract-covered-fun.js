var getBass = require("../getBass");
var basslib = getBass({ silent: true });

/////////////////////////PRETEST//////////////////////////////////

basslib.EnableAllAvailable(true);

var libNames = basslib.WRAP_DEBUG_getAllLibNameActivated();

const libnameCorres = {
  bass: "bass",
  encoder: "bassenc",
  mixer: "bassmix",
  encMP3: "bassenc_mp3",
};

for (let i in libNames) {
  var { ffiFunDeclaration } = basslib.WRAP_DEBUG_getDebugData(libNames[i]);
  console.log("\nFrom " + libNames[i] + " :");
  for (let fun in ffiFunDeclaration) {
    if (libnameCorres[libNames[i]])
      console.log(
        "- [" +
          fun +
          "](http://www.un4seen.com/doc/#" +
          libnameCorres[libNames[i]] +
          "/" +
          fun +
          ".html)\n"
      );
    else console.log("- " + fun + "\n");
  }
}

console.log(
  "If there is no link to the documentation, it may be available only when downloading the addon from un4seen, in the given archive."
);
