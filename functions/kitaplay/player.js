export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const sources = {
    sss: {
      url: "https://fta4-cdn-flr.visionplus.id/out/v1/6f5596513af749c19d0bcdac013dda3c/index.mpd",
      drm: "7faf299c35d84c57ba6cf3578df1e0cc:636537eab0d3f7c395721811fd3861c5"
    },
    // tambah id lainnya di sini...
  };

  if (id && sources[id]) {
    const videoData = sources[id];
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Kitaplay Player</title>
  <script src="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/shaka-player.ui.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/controls.min.css" />
  <style>
    html, body, video { height: 100%; margin: 0; background: black; }
  </style>
</head>
<body>
  <video id="video" class="shaka-video" autoplay controls></video>

  <script>
    document.addEventListener('shaka-ui-loaded', function () {
      const video = document.getElementById('video');
      const container = document.body;
      const overlay = new shaka.ui.Overlay(new shaka.Player(video), video, container);
      const player = overlay.getControls().getPlayer();

      const clearKeys = {};
      const [kid, key] = "${videoData.drm}".split(":");
      clearKeys[kid] = key;

      player.configure({ drm: { clearKeys } });

      player.load("${videoData.url}")
        .then(() => console.log("Video loaded!"))
        .catch(e => console.error("Error loading video:", e));
    });
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { "content-type": "text/html" }
    });
  }

  // Fallback ke static public/kitaplay/player.html
  return fetch("https://postpsn.pages.dev/kitaplay/player.html");
}
