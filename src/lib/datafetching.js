// http://localhost/u/WA-Catalog/en_ulb/index.json
// import {readDb, writeToDb} from "./db";
export async function getRepoHtml() {
  const response = await fetch(
    "http://localhost/u/WA-Catalog/en_ulb/index.json"
  );
  const indexToHtml = await response.json();
  const allHtml = await getAllHtml(indexToHtml);
  return allHtml;
}

export async function getRepoHtmlStraight(req, skipDb = false) {
  console.log("getting from source");
  // console.log(req);

  if (!req) return;
  let slug = req.url ? req.url?.searchParams.get("slug") : req;
  async function fetchHtmlContent(slug) {
    try {
      console.log(`I am fetching ${slug}`);
      // if (!skipDb) {
      //   let sqliteVersion = await readDb(slug);
      //   if (sqliteVersion) {
      //     console.log("sqlite version!");
      //     return JSON.parse(sqliteVersion.response);
      //   }
      // }
      let fetchSlug = `https://read.bibletranslationtools.org/u/${slug}`;
      // let fetchSlug =
      // "https://read.bibletranslationtools.org/u/WycliffeAssociates/en_ulb/";
      // debugger
      let response = await fetch(fetchSlug, {
        headers: {
          "Cache-Control": "max-age=30",
        },
      });
      if (!response.ok) {
        throw new Error("Fetch not ok");
      }
      let data = await response.text();
      let justScripture = data.split(
        '<div class="col-md-6" role="main" id="outer-content">'
      )[1];
      let chapters = justScripture.split(/<div id="ch-\d+" class="chapter">/);
      // let currentIdx = 0;

      // const chapArray = chapters.map((chapter) => {
      //   let data = parse(chapter, options);
      //   currentIdx += 1;
      //   return data;
      // });
      let unixEpoch = Date.now();

      chapters.unshift(
        `<div> This changes every minutes:  The current minute of the hour is ${new Date().getMinutes()} </div>`
      );
      return chapters;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  try {
    let html = await fetchHtmlContent(slug);
    return html;
  } catch (err) {
    return err;
  }
}

async function getAllHtml(indexToHtml) {
  const keys = Object.keys(indexToHtml);
  let promises = [];
  keys.forEach((key) => {
    let bookArr = [];
    indexToHtml[key].forEach((val) => {
      let promise = new Promise(async (res, rej) => {
        try {
          const response = await fetch(
            `http://localhost/u/WA-Catalog/en_ulb/${key}/${val}.html`
          );
          const data = await response.json();
          res(data);
        } catch (error) {
          rej(error);
          throw new Error(error);
        }
      });
      bookArr.push(promise);
    });
    promises.push(bookArr);
  });
  let final = indexToHtml;
  const thing = await unpackAll();
  async function unpackAll() {
    let data = promises.map(async (arr) => {
      let res = await Promise.all(arr);
      return res;
    });
    return data;
  }
  console.log({thing});
  return thing;
}
