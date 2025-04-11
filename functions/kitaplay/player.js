export async function onRequest(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    // Load static player.html
    const fallback = await fetch('https://postpsn.pages.dev/kitaplay/player.html');
    return fallback;
  }

  const videoMapping = {
    "sss": {
      url: "https://fta4-cdn-flr.visionplus.id/out/v1/6f5596513af749c19d0bcdac013dda3c/index.mpd",
      drm: "7faf299c35d84c57ba6cf3578df1e0cc:636537eab0d3f7c395721811fd3861c5"
    },
    // Tambahkan ID lain di sini
  };

  const entry = videoMapping[id];
  if (!entry) {
    return new Response('Invalid ID', { status: 404 });
  }

  const staticHTML = await fetch('https://postpsn.pages.dev/kitaplay/player.html');
  let html = await staticHTML.text();

  html = html
    .replace('__VIDEO_ID__', id)
    .replace('__VIDEO_URL__', entry.url)
    .replace('__VIDEO_DRM__', entry.drm);

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
