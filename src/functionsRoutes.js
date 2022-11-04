let mode = import.meta.env.MODE;
let base =
  mode === "development"
    ? "http://127.0.0.1:8788/api/"
    : "https://astro-live-reader.pages.dev/api/";

const FUNCTIONS_ROUTES = {
  time: base + "time",
};
export default FUNCTIONS_ROUTES;
