export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing 'id' parameter", { status: 400 });
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Kitaplay Player</title>
  <script src="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/shaka-player.ui.min.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/controls.css">
  <style>
    body { margin: 0; background: black; }
    video { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <video id="ss22" autoplay controls class="shaka-video"></video>
  <script type="text/javascript">
    async function initializePlayer(id, url, drmKeys, enableCustomConfig) {
        const video = document.getElementById(id);
        if (!video) return console.error("Video element not found");
        const ui = video['ui'];
        if (!ui) return console.error("Shaka UI not found");
        const controls = ui.getControls();
        const player = controls.getPlayer();
        const config = {
          controlPanelElements: ['play_pause', 'time_and_duration', 'playback_rate', 'mute', 'spacer', 'captions', 'language', 'quality', 'fullscreen'],
          playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
          seekBarColors: { base: 'rgba(255,255,255,.2)', buffered: 'rgba(255,255,255,.4)', played: 'rgb(255,0,0)' }
        };
        ui.configure(config);
        const drmKeyObj = {};
        drmKeys.split(';').forEach(pair => {
          const [k, v] = pair.trim().split(':');
          if (k && v) drmKeyObj[k.trim()] = v.trim();
        });
        player.configure({ drm: { clearKeys: drmKeyObj } });
        if (enableCustomConfig) {
          player.configure('manifest.dash.ignoreMinBufferTime', true);
          player.configure('streaming.rebufferingGoal', 3);
        }
        try {
          await player.load(url);
          console.log("Loaded!");
        } catch (e) {
          console.error("Error loading:", e);
        }
    }
    document.addEventListener('shaka-ui-loaded', function() {
      initializePlayer("sss", "https://fta4-cdn-flr.visionplus.id/out/v1/6f5596513af749c19d0bcdac013dda3c/index.mpd", "7faf299c35d84c57ba6cf3578df1e0cc:636537eab0d3f7c395721811fd3861c5", true);
    });
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" },
  });
}
