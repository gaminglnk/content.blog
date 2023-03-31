function getParameter(parameterName) {
  let parameters = new URLSearchParams(window.location.search);
  return parameters.get(parameterName);
}
document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.querySelector("video");
  const sourceUrl =
    "https://api.consumet.org/anime/gogoanime/watch/" + getParameter("id");

  const defaultOptions = {
    captions: {
      active: true,
      update: true,
      language: "en",
    },
    controls: [
      "play-large",
      "rewind",
      "play",
      "fast-forward",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "settings",
      "fullscreen",
    ],
  };
  if (!Hls.isSupported()) {
    var player = new Plyr(videoElement, defaultOptions);
  } else {
    // For more Hls.js options, see https://github.com/dailymotion/hls.js
    const hls = new Hls();

    // console.log("The url is :", sourceUrl);
    fetch(sourceUrl)
      .then((response) => response.json())
      .then((data) => {
        // Select the multiquality stream.
        var sourcesArray = data.sources;
        var defaultQualityObj = sourcesArray.find(
          (source) => source.quality === "backup"
        );
        var defaultQualitySource = defaultQualityObj.url;
        // console.log("The manifest is :", defaultQualitySource);
        hls.loadSource(defaultQualitySource);
      });

    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      const availableQualities = hls.levels.map((l) => l.height);
      availableQualities.unshift(0);
      defaultOptions.quality = {
        default: 0,
        options: availableQualities,
        forced: true,
        onChange: (e) => updateQuality(e),
      };
      defaultOptions.i18n = {
        qualityLabel: {
          0: "Auto",
        },
      };
      hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
        var span = document.querySelector(
          ".plyr__menu__container [data-plyr='quality'][value='0'] span"
        );
        if (hls.autoLevelEnabled) {
          span.innerHTML = `Auto (${hls.levels[data.level].height}p)`;
        } else {
          span.innerHTML = `Auto`;
        }
      });
      var player = new Plyr(videoElement, defaultOptions);

      // Lock orientation to landscape mode when in fullscreen mode
      player.on("enterfullscreen", () => {
        console.log("Entered fullscreen.");
        window.screen.orientation.lock("landscape");
      });

      // Unlock orientation when exiting fullscreen mode
      player.on("exitfullscreen", () => {
        console.log("Exit fullscreen.");
        window.screen.orientation.unlock();
      });
    });
    hls.attachMedia(videoElement);
    window.hls = hls;
  }

  function updateQuality(newQuality) {
    if (newQuality === 0) {
      window.hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
    } else {
      window.hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          console.log("Found quality match with " + newQuality);
          window.hls.currentLevel = levelIndex;
        }
      });
    }
  }
});
