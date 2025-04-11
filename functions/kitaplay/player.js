document.addEventListener('DOMContentLoaded', function () {
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
        // Inisialisasi player di sini
    } else {
        console.error('Browser tidak mendukung Shaka Player');
    }
});
    // Buat overlay jika belum ada
    const container = video.parentElement || document.body;
    const overlay = new shaka.ui.Overlay(new shaka.Player(video), video, container);
    const ui = overlay.getControls();
    const player = ui.getPlayer();

    // Konfigurasi UI
    const config = {
        controlPanelElements: [
            'play_pause', 'time_and_duration', 'playback_rate',
            'mute', 'spacer', 'captions', 'language', 'quality', 'fullscreen'
        ],
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        seekBarColors: {
            base: 'rgba(255,255,255,.2)',
            buffered: 'rgba(255,255,255,.4)',
            played: 'rgb(255,0,0)'
        }
    };
    ui.configure(config);

    // Parse DRM keys
    const drmKeyObj = {};
    drmKeys.split(';').forEach(pair => {
        const [key, value] = pair.split(':').map(str => str.trim());
        if (key && value) drmKeyObj[key] = value;
    });
    console.log("Configured DRM Keys:", drmKeyObj);

    player.configure({
        drm: {
            clearKeys: drmKeyObj
        }
    });

    if (enableCustomConfig) {
        player.configure('manifest.dash.ignoreMinBufferTime', true);
        player.configure('streaming.rebufferingGoal', 3); // seconds
    }

    // Error listeners
    player.addEventListener('error', e => console.error('Player Error:', e.detail));
    ui.addEventListener('error', e => console.error('UI Error:', e.detail));

    // Load video
    try {
        await player.load(url);
        console.log(`Video '${id}' loaded!`);
    } catch (err) {
        console.error(`Error loading video '${id}':`, err);
    }
}

document.addEventListener('shaka-ui-loaded', function () {
    initializePlayer('ss12', 'http/out/v1/89a6e4261cd7470f83e5869e90440cff/index.mpd', 'c63bd00e9ef14685be580fe5354b0e15:11838c8388010a9e72115f164226e97e');
    initializePlayer('ss22', 'https://fta4-cdn-flr.visionplus.id/out/v1/00f8003079de4928bca50fe7c346b6ab/index.mpd', '5d5d9e0bb2cd4cd8954a894fd4377b6f:8c08b699ff6bff8e34ac518b334bafc2');
    initializePlayer('sss', 'https://fta4-cdn-flr.visionplus.id/out/v1/6f5596513af749c19d0bcdac013dda3c/index.mpd', '7faf299c35d84c57ba6cf3578df1e0cc:636537eab0d3f7c395721811fd3861c5');
});
