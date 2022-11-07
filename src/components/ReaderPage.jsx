import {createSignal, onMount, Show, createMemo} from "solid-js";
import {Menu, Reader} from "./index";
export default function ReaderPage(props) {
  //=============== App state  =============

  const [currentBook, setCurrentBook] = createSignal({
    contents: props.data[props.books[0]],
    keyName: props.books[0],
  });
  const [currentHash, setCurrentHash] = createSignal();

  const [chapterIdx, setChapterIdx] = createSignal(0);
  const html = createMemo(() => {
    let retVal = currentBook().contents[chapterIdx()].data;
    return retVal;
  });

  onMount(() => {
    let hash = String(window.location.hash?.slice(1));
    const regex = /\d{1,3}/;
    let matches = regex.test(hash);
    let isNum = Number(hash);
    if (
      Number(hash) <= 0 ||
      hash > currentBook().contents.length ||
      !matches ||
      !isNum
    ) {
      return;
    } else {
      setChapterIdx(hash - 1);
    }
  });

  return (
    <>
      <Menu
        allBooks={props.books}
        currentBook={currentBook}
        chapterIdx={chapterIdx}
        setChapterIdx={setChapterIdx}
      />
      <Reader
        currentBook={currentBook}
        chapterIdx={chapterIdx}
        html={html}
        setChapterIdx={setChapterIdx}
      />
    </>
  );
}
