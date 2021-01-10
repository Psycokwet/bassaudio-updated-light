/**
 * Created by scarboni on 21.12.2020
 */

const enableLibInt = require("../enableLibInt");

function getFunName(baseName) {
  baseName = baseName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  baseName = baseName.replace(/\s/g, "");
  return baseName;
}

function setEnableLibs(bass) {
  bass.enableFuns = [];
  for (let libname in bass.libFiles) {
    if (libname === "bass") continue;
    const enableFunName = getFunName("enable " + libname);
    bass[enableFunName] = (value) => enableLib(bass, libname, value);
    bass.enableFuns.push(enableFunName);
    const isEnabledFunName = getFunName(libname + " enabled");
    bass[isEnabledFunName] = () => bass.libFiles[libname].isEnabled();
  }
}

function enableLib(bass, libname, value) {
  if (value) {
    // const ffiFunDeclaration = bass.FfiFunDeclarationIndex.get(libname);

    enableLibInt(bass, libname);
  } else {
    bass.libFiles[libname].disable();
  }
}

exports = module.exports = setEnableLibs;
