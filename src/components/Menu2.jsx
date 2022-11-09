import {createSignal, onMount, Show, createMemo, createEffect} from "solid-js";
import {SvgDownload, SvgArrow, SvgSearch, SvgBook} from "./index";
import {useParams, useNavigate} from "@solidjs/router";

export default function Menu2(props) {
  const [menuIsOpen, setMenuIsOpen] = createSignal(false);

  const [currentBookChapters, setCurrentBookChapters] = createSignal(
    props.repoIndex.html[props.book()]
  );

  // const params = useParams();
  currentBookChapters().forEach((chap, idx) => {
    let propsChap = props.chapter();
    if (chap === props.chapter()) {
      debugger;
    }
  });

  const navigate = useNavigate();

  const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  };

  function setNewChapIdx(arrIdx) {
    console.log({arrIdx});
    props.setChapterIdx(arrIdx);
    togglePanel(false);
  }
  const jumpToNewChapIdx2 = debounce((evt) => {
    let val = evt.target?.value;
    console.log({val});
    if (!val || val < 0) return;
    navigate(`/${props.user}/${props.repo}/${props.book()}/${val}`);
    togglePanel(false);
  }, 300);

  const jumpToNewChapIdx = debounce((evt) => {
    let val = evt.target?.value - 1;
    console.log({val});
    if (!val || val < 0) return;
    if (val > props.currentBook().contents.length) {
      val = props.currentBook().contents.length - 1;
    }
    props.setChapterIdx(val);
    togglePanel(false);
  }, 300);
  const restoreNumber = debounce((evt) => {
    let {target} = evt;
    target.value = props.chapter() + 1;
  }, 400);
  const togglePanel = (bool) => {
    let val = bool === false ? bool : !menuIsOpen();
    setMenuIsOpen(val);
  };

  return (
    <div class="max-w-[112ch] mx-auto flex py-2 items-center">
      {/* "publication" */}
      <div class="w-1/5 font-bold uppercase">{props.book()}</div>

      {/* menu button / info */}
      <div class="relative w-3/5 ">
        <div class=" border-true-gray-400 border bg-neutral-200  rounded-lg overflow-hidden w-full flex justify-between">
          <button
            class="rounded-md w-full flex items-center pl-2"
            onClick={(e) => togglePanel()}
          >
            <SvgBook className="inline-block mr-2 fill-current fill-dark-900" />
            <span class="capitalize">{props.book()}</span>
          </button>
          <input
            class="bg-gray-50 ml-auto h-full py-2 w-12 text-center"
            value={props.chapter()}
            onBlur={(e) => restoreNumber(e)}
            type="number"
            min={0}
            // max={props.currentBook().contents.length}
            onInput={(e) => jumpToNewChapIdx2(e)}
          />
        </div>
        <Show when={menuIsOpen()}>
          <div class="w-[133%] absolute z-10 top-full   rounded-xl shadow-xl shadow-dark-300 border bg-white">
            <div class="flex ">
              {/* Books */}
              <div class="border-r border-netural-200 w-2/5">
                <div class="w-full">
                  <h2 class="ml-2 mt-2">Books</h2>
                  <div class="border-t border-neutral-200 pt-2 mt-2">
                    <div class="p-2">
                      <label htmlFor="" class=" block">
                        <input
                          type="text"
                          class="rounded-full border border-neutral-200 p-1 w-full"
                          placeholder="Search Books"
                        />
                      </label>
                      <ul>
                        <For each={Object.keys(props.repoIndex.html)}>
                          {(book) => (
                            <li
                              class={`${
                                book === props.book()
                                  ? "text-red-400"
                                  : "text-black"
                              }`}
                            >
                              {book}
                            </li>
                          )}
                        </For>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              {/* chapters */}

              <div class="w-3/5">
                <div class="w-full">
                  <h2 class="ml-2 mt-2">Chapters</h2>
                  <div class="border-t border-neutral-200 pt-2 mt-2 w-full">
                    <div class="p-2">
                      <ul class="grid grid-cols-5 gap-2 place-content-center">
                        <For each={currentBookChapters()}>
                          {(chapter, idx) => (
                            <li class="w-full text-center">
                              <button
                                class={`${
                                  chapter === Number(props.chapter())
                                    ? "text-red-400"
                                    : "text-black"
                                }`}
                                // class={`${1 === idx ? "text-red-400" : ""}`}
                                onClick={(e) => setNewChapIdx(idx)}
                              >
                                {chapter}
                              </button>
                            </li>
                          )}
                        </For>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
      <div class="w-1/5 ">
        <div class="ml-auto w-max border border-bg-neutral-200 px-6 py-2 rounded-md">
          <span class=" ">
            <SvgDownload class="" />
          </span>
        </div>
      </div>
    </div>
  );
}
