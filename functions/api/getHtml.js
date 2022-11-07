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
  let KVSTORE = env.HtmlFetched;
  let retVal;
  const url = new URL(request.url);
  let user = url.searchParams?.get("user");
  let repo = url.searchParams?.get("repo");
  if (request.method === "GET") {
    let storedRes = await KVSTORE.get(`${user}/${repo}`);
    if (storedRes) {
      console.log("STOREDVALHIT");
      retVal = storedRes;
      return new Response(retVal, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    if (!storedRes) {
      try {
        let fetchURL = "http://localhost:3005/repo" + `/${repo}`;
        let response = await fetch(fetchURL);
        let data = await response.json();
        let stringified = JSON.stringify(data);
        await KVSTORE.put(`${user}/${repo}`, stringified);
        retVal = stringified;
      } catch (error) {
        console.error(error);
      }
    }
  } else {
    let fetchURL = "http://localhost:3005/repo" + `/${repo}`;
    let response = await fetch(fetchURL);
    let data = await response.json();
    let stringified = JSON.stringify(data);
    await KVSTORE.put(`${user}/${repo}`, stringified);
    retVal = stringified;
    let retObj = {
      data,
      message: "revalidated via serverless fxn!",
    };
    retVal = JSON.stringify(retObj);
  }
  // console.log(context);
  return new Response(retVal, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
