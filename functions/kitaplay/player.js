@ -10,53 +10,56 @@ document.addEventListener('shaka-ui-loaded', function () {
   };
 
   if (sources[id]) {
     initializePlayer("video", sources[id].url, sources[id].drm, true);
     const videoData = sources[id];
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
 
             const drmParts = "${videoData.drm}".split(':');
             const clearKeys = {};
             clearKeys[drmParts[0]] = drmParts[1];
 
             player.configure({
               drm: {
                 clearKeys: clearKeys
               }
             });
 
             try {
               await player.load("${videoData.url}");
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
   } else {
     console.error("ID tidak ditemukan:", id);
     return new Response("ID not found", { status: 404 });
   }
 });
 
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
