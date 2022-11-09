export async function get(req) {
  const user = req.url?.searchParams.get("user");
  const repo = req.url?.searchParams.get("repo");

  // ex: http://localhost/u/WA-Catalog/en_ulb/index.json
  let base = "http://localhost/u";
  let url = base + `/${user}/${repo}/` + "index.json";
  console.log("HERE index url");
  console.log({url});
  const response = await fetch(url);
  const html = await response.json();
  return new Response(
    JSON.stringify({
      html,
      generatedAt: new Date().toLocaleString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
