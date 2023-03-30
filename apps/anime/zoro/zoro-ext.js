function getParameter(parameterName) {
  let parameters = new URLSearchParams(window.location.search);
  return parameters.get(parameterName);
}

function getSpriteFromVtt(url) {
  const newUrl = url.replace(/sprite\.vtt$/, "sprite-0.jpg");
  return newUrl;
}

document.addEventListener("DOMContentLoaded", () => {
  const sourceZoro = getParameter("id").replace(/both$/, "dub");
  const videoElement = document.querySelector("video");
  const sourceUrl =
    "https://api.consumet.org/anime/zoro/watch?episodeId=" + sourceZoro;

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
  // Fallback option
  if (!Hls.isSupported()) {
    videoElement.src = source;
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
          (source) => source.quality === "auto"
        );
        var defaultQualitySource = defaultQualityObj.url;

        // Select the previews and subs.
        var subtitleArray = data.subtitles;
        var previewSrc = subtitleArray.find(
          (previews) => previews.lang === "Thumbnails"
        ).url;
        var engSrc = subtitleArray.find((subs) => subs.lang === "English").url;

        // Implement the subtitles and previews.
        document.getElementById("eng").setAttribute("src", engSrc);
        (defaultOptions.previewThumbnails = {
          enabled: true,
          src: previewSrc,
        }),
          videoElement.setAttribute(
            "data-poster",
            getSpriteFromVtt(previewSrc)
          );
        hls.loadSource(defaultQualitySource);
      });

    // Set "Auto" as default quality.
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      const availableQualities = hls.levels.map((l) => l.height);
      availableQualities.unshift(0);
      defaultOptions.quality = {
        default: 0,
        options: availableQualities,
        forced: true,
        onChange: (e) => updateQuality(e),
      };
      // Add "Auto" quality option.
      defaultOptions.i18n = {
        qualityLabel: {
          0: "Auto",
        },
      };
      // Show the available qualities.
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
      // construct the player.
      var player = new Plyr(videoElement, defaultOptions);
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
