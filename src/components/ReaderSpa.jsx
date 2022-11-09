import {Router, Routes, Route, useParams, useNavigate} from "@solidjs/router";
import {
  createSignal,
  createResource,
  onMount,
  Show,
  createMemo,
  Suspense,
  createEffect,
} from "solid-js";
// import {Menu} from "./index";
import ReaderPane2 from "./Readerv2";
import Menu2 from "./Menu2";

export default function ReaderSpaPane(props) {
  const [currentBook, setCurrentBook] = createSignal(props.book);
  const [chapterIdx, setChapterIdx] = createSignal(props.chapter);
  // const navigate = useNavigate();
  // const params = useParams();

  async function fetchBookChapData({user, repo, book, chapter}) {
    // return <div> working real fast </div>;
    let base = "http://localhost:3000/getHtml.json";

    // ?user=WA-Catalog&repo=en_ulb&book=Gen&chapter=1
    let url =
      base +
      `?user=${user}&repo=${repo}&book=${book}&chapter=${chapter}` +
      ".html";
    // http://localhost/u/WA-Catalog/en_ulb/Gen/1.html
    const response = await fetch(url);

    const {html} = await response.json();
    let nextPage = String(Number(chapter) + 1);
    let prevPage = String(Number(chapter) - 1);
    const data = {
      nextPage,
      prevPage,
      html,
    };
    return data;
  }

  //Data function
  function PaneData({params, location, navigate, data}) {
    // https://www.solidjs.com/docs/latest/api#createresource
    // signature: const [data, { mutate, refetch }] = createResource(sourceSignal, fetchData);
    // debugger;

    const [readerData] = createResource(
      () => params.chapter || params.book || params.user || params.repo,
      () => fetchBookChapData(params)
    );
    createEffect(() => {
      setCurrentBook(params.book);
      setChapterIdx(params.chapter);
    });
    // console.log({html});
    return readerData;
  }
  // function navigateFromMenu(id) {
  //   return navigate(`/read/${params.user}/${params}`);
  // }

  return (
    <>
      <Router base={`/read`} url={props.ssrRoute}>
        <div>
          <Menu2
            book={currentBook}
            repoIndex={props.repoIndex}
            chapter={chapterIdx}
            user={props.user}
            repo={props.repo}
          />
        </div>
        <Routes>
          <Route path="/:user">
            <Route path="/:repo">
              <Route path="/:book">
                <Suspense fallback={<div>Suspense Loading...</div>}>
                  <Route
                    path="/:chapter"
                    component={ReaderPane2}
                    data={PaneData}
                  ></Route>
                </Suspense>
              </Route>
            </Route>
          </Route>
          {/* <Route
            path="/:user/:repo/:book/:chapter"
            component={ReaderPane2}
            data={PaneData}
          /> */}
        </Routes>
      </Router>
    </>
  );
}
