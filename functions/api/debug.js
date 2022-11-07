export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;
  // console.log(context);
  const {origin} = new URL(request.url);
  const test2 = await fetch(`${origin}/api/time`);
  const test3 = await test2.text();
  console.log("browser?");

  return new Response(
    JSON.stringify({
      test3,
      request,
      env,
      params,
      waitUntil,
      next,
      data,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
