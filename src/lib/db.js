// import sqlite3 from "sqlite3";
// import {open} from "sqlite";
// import {normalize, join} from "path";
// import {fileURLToPath} from "url";
// import {dirname} from "path";
// import {getRepoHtmlStraight} from "./datafetching";

// The import.meta object exposes context-specific metadata to a JavaScript module. It contains information about the module, like the module's URL.
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const dbFile = normalize(join(__dirname, "/astroResponses.db"));

// sqlite3.verbose();

// async function openDb() {
//   const db = await open({
//     filename: dbFile,
//     driver: sqlite3.cached.Database,
//   });
//   console.log({db});
//   return db;
// }

// export async function writeToDb(page, skipCacheCheck) {
//   // As an object with named parameters.
//   let db = await openDb();

//   let existingRecord = await readDb(page, db);
//   let data = await getRepoHtmlStraight(page, skipCacheCheck);
//   console.log("data");
//   let stringified = JSON.stringify(data);

//   // SAME DATA FROM FETCH AS LAYER AT EXISTING, NO NEED TO RUN OPS ON DB OR SEND DUP DATA OVER THE WIRE.
//   if (existingRecord && existingRecord.response === stringified) {
//     return {
//       dataIsSame: true,
//     };
//   }

//   // UPDATE THE EXISTING RECORD WITH THE NEW DATA FROM THE NETWORK
//   if (existingRecord) {
//     console.log(`updating db record ${page}`);
//     await db.run(
//       `UPDATE fetchcalls
//       SET url = $page,
//           response = $data,
//           datetime = $time
//       WHERE url = $page`,
//       {
//         $page: page,
//         $data: stringified,
//         $time: Date.now(),
//       }
//     );
//   } else {
//     // INSERTING A NEW FETCH REQUEST INTO THE DB
//     console.log(`creating new db record ${page}`);
//     await db.run(
//       `INSERT INTO fetchcalls (url, response, datetime) VALUES ($page, $data, $time);`,
//       {
//         $page: page,
//         $data: stringified,
//         $time: Date.now(),
//       }
//     );
//   }

//   return {
//     url: page,
//     data,
//     time: Date.now(),
//   };
// }

// export async function readDb(page, db) {
//   console.log("read db!");
//   let dbToUse = db ? db : await openDb();

//   const result = await dbToUse.get(
//     "SELECT * FROM fetchcalls WHERE url = $page",
//     {
//       $page: page,
//     }
//   );
//   // debugger;
//   return result;
// }
