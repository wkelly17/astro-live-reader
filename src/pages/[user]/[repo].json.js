// https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes
export async function get({params}) {
  console.log(params);
  let user = params.user;
  let repo = params.repo;

  console.log(repo);
  if (!repo) {
    return new Response(null, {
      status: 404,
      statusText: "No id",
    });
  }

  return new Response(
    JSON.stringify({
      status: "I worked!",
      params,
      user,
      repo,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
