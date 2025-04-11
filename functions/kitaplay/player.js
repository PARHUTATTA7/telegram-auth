
export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const id = searchParams.get("id");

  const streams = {
    sss: {
      url: "https://fta4-cdn-flr.visionplus.id/out/v1/6f5596513af749c19d0bcdac013dda3c/index.mpd",
      drm: "7faf299c35d84c57ba6cf3578df1e0cc:636537eab0d3f7c395721811fd3861c5"
    },
    ss22: {
      url: "https://fta4-cdn-flr.visionplus.id/out/v1/00f8003079de4928bca50fe7c346b6ab/index.mpd",
      drm: "5d5d9e0bb2cd4cd8954a894fd4377b6f:8c08b699ff6bff8e34ac518b334bafc2"
    }
  };

  const data = streams[id];
  if (!data) {
    return new Response("Invalid or missing ID", { status: 404 });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Shaka Player</title>
      <script src="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/shaka-player.ui.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.3.5/dist/controls.min.css">
      <style>html, body, video { height: 100%; margin: 0; background: black; }</style>
    </head>
    <body>
      <video id="video" class="shaka-video" autoplay controls></video>
      <div class="shaka-controls shaka-bottom-controls" id="controls"></div>

      <script>
        async function initializePlayer() {
          const video = document.getElementById('video');
          const ui = new shaka.ui.Overlay(new shaka.Player(video), video, document.body);
          const player = ui.getControls().getPlayer();

          player.configure({
            drm: {
              clearKeys: { "${data.drm.split(':')[0]}": "${data.drm.split(':')[1]}" }
            }
          });

          try {
            await player.load("${data.url}");
            console.log("Video loaded!");
          } catch (e) {
            console.error("Error loading video:", e);
          }
        }

        document.addEventListener('DOMContentLoaded', initializePlayer);
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "content-type": "text/html" }
  });
}
