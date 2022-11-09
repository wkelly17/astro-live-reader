export async function get(req) {
  const user = req.url?.searchParams.get("user");
  const repo = req.url?.searchParams.get("repo");
  const book = req.url?.searchParams.get("book");
  const chapter = req.url?.searchParams.get("chapter");
  let base = "http://localhost/u";
  let url = base + `/${user}/${repo}/${book}/${chapter}` + ".html";
  console.log({url});
  const response = await fetch(url);
  const html = await response.text();
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
