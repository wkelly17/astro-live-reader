import {getRepoHtml} from "../lib/datafetching";

export async function get({params}) {
  const allHtml = await getRepoHtml();
  return allHtml;
}
