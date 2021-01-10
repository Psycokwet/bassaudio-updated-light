var chalk = require("chalk");
var getBass = require("../tools/getBass");

let args = process.argv;
args.splice(0, 2);

console.log(args.length);
if (args.length < 3) {
  console.log(
    "Usage : node encoder.js [*.mp3] [complete_cast_url] [complete_ID]\nSee http://www.un4seen.com/doc/#bassenc/BASS_Encode_CastInit.html"
  );
  process.exit();
}
const filename = args[0];
const URL = args[1];
const ID = args[2];
console.log("Will try to play :" + filename + " and cast it");

var basslib = getBass({
  silent: true,
});

basslib.EnableMixer(true);
basslib.EnableEncoder(true);
basslib.EnableEncmp3(true);

var encoderEnabled = basslib.EncoderEnabled();
if (encoderEnabled) {
  console.log(chalk.bgGreen.white.bold("Encoder enabled"));
} else {
  console.log(chalk.bgRed.white.bold("Encoder disabled"));
  process.exit();
}

var mixerEnabled = basslib.MixerEnabled();
if (mixerEnabled) {
  console.log(chalk.bgGreen.white.bold("Mixer enabled"));
} else {
  console.log(chalk.bgRed.white.bold("Mixer disabled"));
  process.exit();
}

var encmp3Enabled = basslib.Encmp3Enabled();
if (encmp3Enabled) {
  console.log(chalk.bgGreen.white.bold("Encoder MP3 enabled"));
} else {
  console.log(chalk.bgRed.white.bold("Encoder MP3 disabled"));
  process.exit();
}

console.log(filename);
var LameModes = {
  Stereo: 2,
  Mono: 1,
};
var SampleRates = {
  Hz_8000: 8000,
  Hz_11025: 11025,
  Hz_16000: 16000,
  Hz_22050: 22050,
  Hz_32000: 32000,
  Hz_44100: 44100,
  Hz_48000: 48000,
  Hz_96000: 96000,
  Hz_192000: 192000,
};
var BitRates = {
  kbps_6: 6,
  kbps_8: 8,
  kbps_10: 10,
  kbps_12: 12,
  kbps_16: 16,
  kbps_20: 20,
  kbps_22: 22,
  kbps_24: 24,
  kbps_32: 32,
  kbps_40: 40,
  kbps_48: 48,
  kbps_56: 56,
  kbps_64: 64,
  kbps_80: 80,
  kbps_96: 96,
  kbps_112: 112,
  kbps_128: 128,
  kbps_144: 144,
  kbps_160: 160,
  kbps_192: 192,
  kbps_224: 224,
  kbps_256: 256,
  kbps_320: 320,
};
var Qualities = {
  Q0: 0,
  Q1: 1,
  Q2: 2,
  Q3: 3,
  Q4: 4,
  Q5: 5,
  Q6: 6,
  Q7: 7,
  Q8: 8,
  Q9: 9,
  None: 10,
  Speed: 11,
  Quality: 12,
};
var channels = {
  MONO: 1,
  STEREO: 2,
  QUAD: 4,
  FIVE_ONE: 6,
  SEVEN_ONE: 8,
};

var MODE = LameModes.Stereo;
var SAMPLE_RATE = SampleRates.Hz_22050;
var BIT_RATE = BitRates.kbps_56;

var lamestr = ` -r -m s -s ${SAMPLE_RATE} -b ${BIT_RATE} -`;

// BASS_Init
var init = basslib.BASS_Init(
  -1,
  44100,
  basslib.BASS_Initflags.BASS_DEVICE_STEREO
);
if (!init) {
  console.log(
    `${chalk.bgRed.white.bold(
      "error init sound card: "
    )} ${basslib.BASS_ErrorGetCode()}`
  );
}

console.log(
  `${chalk.bgBlue.white.bold("soundcard is init?: ")} ${
    basslib.getDevice(-1).IsInitialized
  }`
);

// BASS_Mixer_StreamCreate
var mixerFlag =
  basslib.BASS_Encode_Startflags.BASS_ENCODE_CAST_NOLIMIT |
  basslib.BASSFlags.BASS_STREAM_PRESCAN |
  basslib.BASSFlags.BASS_STREAM_AUTOFREE;

var mixer = basslib.BASS_Mixer_StreamCreate(
  SAMPLE_RATE,
  channels.STEREO,
  mixerFlag
);
if (mixer === 0) {
  console.log(
    `${chalk.bgRed.white.bold(
      "error at Mixer_StreamCreate: "
    )} ${basslib.BASS_ErrorGetCode()}`
  );
  process.exit();
} else {
  console.log(`${chalk.bgBlue.white.bold("Mixer channel: ")} ${mixer}`);
}

// BASS_StreamCreateFile
var createChannelFlag =
  basslib.BASSFlags.BASS_STREAM_DECODE | basslib.BASSFlags.BASS_SAMPLE_FLOAT;

var chan = basslib.BASS_StreamCreateFile(
  false,
  filename,
  0,
  0,
  createChannelFlag
);
if (chan === 0) {
  console.log(
    `${chalk.bgRed.white.bold(
      "error at BASS_StreamCreateFile: "
    )} ${basslib.BASS_ErrorGetCode()}`
  );
  process.exit();
} else {
  console.log(`${chalk.bgBlue.white.bold("chan: ")} ${chan}`);
}

// BASS_Mixer_StreamAddChannel
var addChannelFlag = basslib.BASS_MIXERsourceflags.BASS_MIXER_DOWNMIX;
var isAdded = basslib.BASS_Mixer_StreamAddChannel(mixer, chan, addChannelFlag);
if (!isAdded) {
  console.log(
    `${chalk.bgRed.white.bold(
      "error at BASS_Mixer_StreamAddChannel: "
    )} ${basslib.BASS_ErrorGetCode()}`
  );
}

// BASS_ChannelPlay
var success = basslib.BASS_ChannelPlay(mixer, true);
if (!success) {
  console.log(
    `${chalk.bgRed.white.bold(
      "error at ChannelPlay: "
    )} ${basslib.BASS_ErrorGetCode()}`
  );
}

// BASS_Encode_Start
var _encoder = basslib.BASS_Encode_MP3_Start(
  mixer,
  lamestr,
  basslib.BASS_Encode_Startflags.BASS_ENCODE_NOHEAD
);
if (_encoder === 0) {
  console.log(
    `${chalk.bgRed.white.bold(
      "error at BASS_Encode_MP3_Start: "
    )} ${basslib.BASS_ErrorGetCode()}`
  );
  process.exit();
} else {
  console.log(`${chalk.bgBlue.white.bold("Encoder channel: ")} ${_encoder}`);
}

// BASS_Encode_CastInit
setTimeout(() => {
  var isCast = basslib.BASS_Encode_CastInit(
    _encoder,
    URL,
    ID,
    "audio/mpeg",
    "Bassaudio encoder test",
    "",
    "",
    null,
    null,
    BIT_RATE,
    true
  );

  if (!isCast) {
    var errorCode = basslib.BASS_ErrorGetCode();
    console.log(
      chalk.bgRed.white.bold(
        "cast ERROR reason:" +
          errorCode +
          ":" +
          basslib.getCodeMessageFrom(errorCode, basslib.BASS_ErrorCode)
      )
    );
    return;
  } else {
    console.log(
      chalk.bgGreen.white.bold("CastInit success"),
      `listen @ ${URL}`
    );
  }
}, 5000);

setInterval(() => {
  console.log("Streaming stopped :" + basslib.BASS_Encode_Stop(_encoder));
}, 20000);
