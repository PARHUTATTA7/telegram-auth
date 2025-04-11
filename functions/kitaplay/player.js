export async function onRequest(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Missing ID', { status: 400 });
  }

  return Response.redirect(`/kitaplay/player.html?id=${id}`, 302);
}
