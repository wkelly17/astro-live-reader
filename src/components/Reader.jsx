import {createSignal, onMount, Show} from "solid-js";
// import {checkForNewerDocOnNetwork} from "../lib/datafetching";

export default function ReaderPane(props) {
  const [arrIdx, setArrIdx] = createSignal(0);

  const [dataToUse, setDataToUse] = createSignal(props.arr);
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
      return setArrIdx((prev) => {
        return --prev;
      });
    } else {
      return setArrIdx((prev) => {
        return ++prev;
      });
    }
  }
  function skip(num) {
    return setArrIdx(num);
  }

  // todo: Would it not make more sense just to create a SW route that listens for fetch of this page using network first with query query param: If it succeeds save without
  // https://github.com/GoogleChrome/workbox/issues/2512
  // So.. request to current page onMount,
  async function updateReaderPane() {
    let newData = newerData();
    debugger;

    setDataToUse(newData.data);
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
        <ul class="flex flex-wrap gap-2 h-1/6">
          <For each={dataToUse()}>
            {(item, idx) => <button onClick={() => skip(idx)}>{idx}</button>}
          </For>
        </ul>
        <div class="flex justify-between content-center items-center h-5/6">
          <button class="bg-red-300 h-full" onClick={(e) => handle("prev")}>
            Prev
          </button>
          <div
            class="w-4/5 h-full overflow-y-scroll py-4 px-8"
            innerHTML={dataToUse()[arrIdx()]}
          />
          <button class="bg-blue-300 h-full" onClick={(e) => handle()}>
            Next
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
