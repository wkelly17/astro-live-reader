import {
  createSignal,
  onMount,
  Show,
  createMemo,
  Suspense,
  createEffect,
  useTransition,
  Switch,
  Match,
} from "solid-js";
import {SvgDownload, SvgArrow, SvgSearch, SvgBook} from "./index";
import {useRouteData} from "@solidjs/router";
import {A, useParams, useIsRouting} from "@solidjs/router";

export default function ReaderPane2(props) {
  // DO NOT DESTRUCTURE OUTSIDE A TRACKED CONTEXT IN SOLID.  YOU CAN DESTRUCTURE IN CREATEEFFECT, MEMO, OR JSX, notat the top;
  // firstBook, first Chapter
  console.log({props});

  const params = useParams();
  const [pending, start] = useTransition();

  let navPath = `/${params.user}/${params.repo}/${params.book}`;

  const readerData = useRouteData();
  // const data = readerData;
  // console.log(data.html());
  // console.log(data());

  // return null;

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
  const isRouting = useIsRouting();
  createEffect(() => {
    // debugger;
    console.log(readerData?.loading);
    console.log(readerData?.state);
    console.log("is routing");
    console.log(isRouting());
  });

  function LoadingComponent() {
    console.log("loadingComp");
    return <div>Loading...</div>;
  }

  return (
    <Show when={!readerData.loading} fallback={LoadingComponent}>
      {/* <Suspense when={!readerData.loading} fallback={LoadingComponent}> */}
      <div class="h-screen">
        <div class="flex justify-center content-center items-center  pt-12 h-[90%]">
          {/* <button
            class="mr-20 w-14  h-full hover:bg-neutral-200 transition-colors duration-250"
            onClick={(e) => handle("prev")}
          > */}
          <A href={`${navPath}/${readerData()?.prevPage}`}>
            <SvgArrow className="text-slate-800 fill-current mx-auto " />
          </A>
          {/* </button> */}
          <div
            class="max-w-[85ch]  h-full overflow-y-scroll px-4 leading-relaxed"
            // innerHTML={readerData().html}
            // innerHTML={"<div> why? </div> "}
            innerHTML={readerData()?.html}
          />
          {/* <button
            class=" ml-20 w-14 bg-zinc-200 h-full text-center"
            onClick={(e) => handle()}
          > */}
          <A href={`${navPath}/${readerData()?.nextPage}`}>
            <SvgArrow className="text-slate-800 fill-current mx-auto rotate-180" />
          </A>
          {/* </button> */}
        </div>
      </div>
      {/* </Suspense> */}
    </Show>
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
