export async function onRequestGet(req) {
  // console.log(params);

  let page = req ? req.url?.searchParams.get("page") : "no req given";
  // let rows = await readDb(page);

  return new Response(
    JSON.stringify({
      status: "I worked!",
      page,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
