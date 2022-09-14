// Write Javascript code!
/* var manifestUri =
  "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls-apple/master.m3u8"; */

function getParameter(parameterName) {
  let parameters = new URLSearchParams(window.location.search);
  return parameters.get(parameterName);
}

var manifestUri = getParameter("link");

async function init() {
  // When using the UI, the player is made automatically by the UI object.
  const video = document.getElementById("video");
  const ui = video["ui"];
  const controls = ui.getControls();
  const player = controls.getPlayer();
  const config = {
    customContextMenu: true,
    contextMenuElements: ["statistics"],
    statisticsList: [
      "width",
      "height",
      "playTime",
      "bufferingTime",
      "decodedFrames",
      "corruptedFrames",
    ],
    addBigPlayButton: false,
    seekBarColors: {
      base: "rgba(255, 255, 255, 0.3)",
      buffered: "rgba(255, 255, 255, 0.54)",
      /*played: "rgb(255, 176, 59)",*/
      played: "rgb(255, 0, 0)",
    },
    volumeBarColors: {
      base: "rgba(255, 255, 255, 0.3)",
      level: "rgb(255, 255, 255)",
    },
  };
  ui.configure(config);
  player.configure("streaming.forceTransmuxTS", true);

  // Attach player and ui to the window to make it easy to access in the JS console.
  window.player = player;
  window.ui = ui;

  // Listen for error events.
  player.addEventListener("error", onPlayerErrorEvent);
  controls.addEventListener("error", onUIErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log("The video has now been loaded!");
  } catch (error) {
    onPlayerError(error);
  }

  $(".shaka-overflow-menu-button").html("settings");
  $(".shaka-back-to-overflow-button .material-icons-round").html(
    "arrow_back_ios_new"
  );
}

function onPlayerErrorEvent(errorEvent) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function onPlayerError(error) {
  // Handle player error
  console.error("Error code", error.code, "object", error);
}

function onUIErrorEvent(errorEvent) {
  // Extract the shaka.util.Error object from the event.
  onPlayerError(event.detail);
}

function initFailed(errorEvent) {
  // Handle the failure to load; errorEvent.detail.reasonCode has a
  // shaka.ui.FailReasonCode describing why.
  console.error("Unable to load the UI library!");
}

// Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
document.addEventListener("shaka-ui-loaded", init);
// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener("shaka-ui-load-failed", initFailed);
