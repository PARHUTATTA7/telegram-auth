document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const sources = {
    sss: {
      url: "https://fta4-cdn-flr.visionplus.id/out/v1/6f5596513af749c19d0bcdac013dda3c/index.mpd",
      drm: "7faf299c35d84c57ba6cf3578df1e0cc:636537eab0d3f7c395721811fd3861c5"
    }
  };

  if (sources[id]) {
    initializePlayer(sources[id]);
  } else {
    console.error("ID not found:", id);
    document.body.innerHTML = "<h1>Error: Content ID not found</h1>";
  }

  async function initializePlayer(videoData) {
    // Install polyfills if needed
    shaka.polyfill.installAll();
    
    // Check if the browser supports the basic features we need
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Browser not supported!");
      document.body.innerHTML = "<h1>Error: Browser not supported</h1>";
      return;
    }

    const video = document.getElementById('video');
    const player = new shaka.Player(video);
    const ui = new shaka.ui.Overlay(player, video, document.getElementById('controls-container'));

    // Set up error event listeners
    player.addEventListener('error', onPlayerError);
    
    // Configure DRM
    const [keyId, key] = videoData.drm.split(':');
    player.configure({
      drm: {
        clearKeys: {
          [keyId]: key
        },
        advanced: {
          'com.widevine.alpha': {
            videoRobustness: 'SW_SECURE_DECODE',
            audioRobustness: 'SW_SECURE_DECODE'
          }
        }
      }
    });

    try {
      await player.load(videoData.url);
      console.log("Video loaded successfully!");
    } catch (error) {
      console.error("Error loading video:", error);
      onPlayerError(error);
    }
  }

  function onPlayerError(error) {
    console.error("Player error:", error);
    document.getElementById('error-message').textContent = 
      `Error code: ${error.code} (${error.severity}) - ${error.message}`;
  }
});
