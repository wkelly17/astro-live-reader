import {getRepoHtml} from "../lib/datafetching";

export async function get(req) {
  console.log("getting from source");

  const query = req.url?.searchParams.get("slug");

  async function fetchHtmlContent(slug) {
    try {
      console.log(`I am fetching ${slug}`);
      // let fetchSlug = `https://read.bibletranslationtools.org/u/${slug}`;
      let fetchSlug =
        "https://read.bibletranslationtools.org/u/WycliffeAssociates/en_ulb/";
      // debugger
      let response = await fetch(fetchSlug);
      if (!response.ok) {
        throw new Error("Fetch not ok");
      }
      let data = await response.text();
      console.log({data});
      let justScripture = data.split(
        '<div class="col-md-6" role="main" id="outer-content">'
      )[1];
      let chapters = justScripture.split(/<div id="ch-\d+" class="chapter">/);
      let currentIdx = 0;

      // const chapArray = chapters.map((chapter) => {
      //   let data = parse(chapter, options);
      //   currentIdx += 1;
      //   return data;
      // });

      return chapters;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  try {
    let html = await fetchHtmlContent(query);
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
  } catch (err) {
    return err;
  }
}

/* 
const options = {
        replace: (domNode) => {
          if (domNode instanceof Element && domNode.attribs) {
            // ...
            if (domNode.attribs.class === "versemarker") {
              let verseNum = domNode.children[0]?.data;
              return (
                <VerseMarker id={`ch-${currentIdx}-v-${verseNum}`}>
                  {domToReact(domNode.children, options)}
                </VerseMarker>
              );
            }
            if (domNode.attribs.class === "chaptermarker") {
              // let chapterNum = domNode.children[0].data;

              return (
                <ChapterMarker>
                  {domToReact(domNode.children, options)}
                </ChapterMarker>
              );
            }
            if (domNode.attribs.class === "verse") {
              return <Verse>{domToReact(domNode.children, options)}</Verse>;
            }
            if (domNode.name === "p" && domNode.children?.length === 1) {
              return <Spacer />;
            }
            if (domNode.attribs.class === "footnotes") {
              return (
                <Footnotes>{domToReact(domNode.children, options)}</Footnotes>
              );
            }
          }
        },
      };

*/
