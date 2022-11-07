import {createSignal, onMount, Show, createMemo} from "solid-js";
import {SvgDownload, SvgArrow, SvgSearch, SvgBook} from "./index";
// import {checkForNewerDocOnNetwork} from "../lib/datafetching";

/* 
{
  k: [
  v: {
  data: html,
  sortOrder
  }
  ]
}
*/

export default function ReaderPane(props) {
  // DO NOT DESTRUCTURE OUTSIDE A TRACKED CONTEXT IN SOLID.  YOU CAN DESTRUCTURE IN CREATEEFFECT, MEMO, OR JSX, notat the top;
  // firstBook, first Chapter
  console.log({props});

  const [chapterIdx, setChapterIdx] = createSignal(0);

  const [newerData, setNewerData] = createSignal({
    hasNewerData: false,
    response: null,
  });

  onMount(async () => {
    return;
    // todo: put hash routing back in:
    // todo: works: needs refinement:

    // debugger;
    if (!props.user && !props.repositoryName) return;
    let path = window.location.origin.concat(
      `/test.json?page=${props.user}/${props.repositoryName}`
    );
    let url = new URL(path);
    let body = JSON.stringify({
      queryFresh: true,
    });

    // SEMANTICALLY A POST REQUEST BC THIS WILL TRY TO FETCH FROM THE NETWORK AND MUTATE THE SQLITE DB IF SUCCESSFUL.
    let response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (data.dataIsSame) {
      return;
    } else {
      // debugger;
      console.log("oh! There was fresh data");
      setNewerData({
        hasNewerData: true,
        data: data.data,
      });
    }
  });

  function handle(dir) {
    if (dir === "prev") {
      return props.setChapterIdx((prev) => {
        return --prev;
      });
    } else {
      return props.setChapterIdx((prev) => {
        return ++prev;
      });
    }
  }
  function skip(num) {
    return props.setChapterIdx(num);
  }

  // todo: Would it not make more sense just to create a SW route that listens for fetch of this page using network first with query query param: If it succeeds save without
  // https://github.com/GoogleChrome/workbox/issues/2512
  // So.. request to current page onMount,
  async function updateReaderPane() {
    let newData = newerData();
    debugger;

    // setDataToUse(newData.data);
    setNewerData({hasNewerData: false, data: null});
    const cache = await caches.open("astro-pages");
    let req = `/read/${props.user}/${props.repositoryName}`;
    // let res = newData.response;
    // todo:
    console.log(`putting in cache ${req} and`);
    let reqUrl = new URL(window.location.origin.concat(req));
    let newReq = new Request(reqUrl);
    cache.add(newReq);
  }
  return (
    <>
      <div class="h-screen">
        <Show when={newerData() && newerData().hasNewerData}>
          <button onClick={updateReaderPane}>
            Newer Data is available for this page, click to update
          </button>
        </Show>

        <div class="flex justify-center content-center items-center  pt-12 h-[90%]">
          <button
            class="mr-20 w-14  h-full hover:bg-neutral-200 transition-colors duration-250"
            onClick={(e) => handle("prev")}
          >
            <SvgArrow className="text-slate-800 fill-current mx-auto " />
          </button>
          <div
            class="max-w-[85ch]  h-full overflow-y-scroll px-4 leading-relaxed"
            innerHTML={props.html()}
          />
          <button
            class=" ml-20 w-14 bg-zinc-200 h-full text-center"
            onClick={(e) => handle()}
          >
            <SvgArrow className="text-slate-800 fill-current mx-auto rotate-180" />
          </button>
        </div>
      </div>
    </>
  );
}

// read/gibson/ont_luk_text_reg/
// read/WycliffeAssociates/en_ulb
// read/lversaw/en_ulb

// todo: Add in the PWA layer to cache visted
/* 
1. pwa layer to cache visited documents;  See about editing the fetch request to change it cache control headers. 
2. cache network fetch requests in sqlite layer
3. add api route to cache in sqlite layer on demand;
IF WE PUT THIS ON CLOUDFLARE, x cache control headers? How long to set to?
4. Query params on reader to jump straight to a chapter
5. see what happens if server request is offline.  Can I just return a fetch failed status and try client side fetching to service worker?

6. Ask dan if I can peer take a gander at any of our existing cloudflare sites.   Pages vs. Traditional site setup; 
*/

// EMS wordpress tomorrow:
