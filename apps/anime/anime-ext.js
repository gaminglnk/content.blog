function getParameter(parameterName) {
  let parameters = new URLSearchParams(window.location.search);
  return parameters.get(parameterName);
}

// api variables
const api = "https://api.consumet.org/anime/gogoanime/watch/";
const anime_url = api + getParameter("id");

let afterRequest = (response) => {
  console.log(
    "Internal player is : " + response.data.headers.Referer,
    "\n\nDownload link is : " + response.data.download
  );
  let sources = response.data.sources;
  for (let source of sources) {
    if (source.quality == "default") {
      fetchedData = source.url;
    }
  }
};

let errorRequest = (error) => {
  console.error("Sorry! Unable to get the streaming link ready.");
};

let fetchedData = axios.get(anime_url).then(afterRequest).catch(errorRequest);
const final = str(fetchedData);
