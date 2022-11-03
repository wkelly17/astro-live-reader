// import {readDb, writeToDb} from "../lib/db";
export async function get(req) {
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

// export async function post({request, url}) {
//   let body;
//   let page = url?.searchParams.get("page");
//   if (request.headers.get("Content-Type") === "application/json") {
//     body = await request.json();
//   }
//   let skipSqliteForCachedResponse = body.queryFresh ? true : false;

//   let data = await writeToDb(page, skipSqliteForCachedResponse);
//   return {
//     body: JSON.stringify({
//       message: "This was a POST!",
//       ...data,
//     }),
//   };
// }
