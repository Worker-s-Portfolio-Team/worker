addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});
  
async function handleRequest(event) {
    let data = await dataFetch(event);
    data = render(await data.json(), event.request.cf.country.toLowerCase());
    return new HTMLRewriter().on("section", new ElementHandler(data)).transform(await fetch("https://concert.goalastair.com"));
}

async function dataFetch(event) {
    const fetchURL = `https://api.predicthq.com/v1/events/?category=concerts%2Cfestivals&country=${event.request.cf.country}`;
    let cacheKey = new Request(fetchURL);
    cacheKey.headers.set("Authorization", AUTH);
    const cache = caches.default;
    let res = await cache.match(cacheKey);
    if (!res) {
        res = await fetch(cacheKey);
        res = new Response(res.body, res);
        res.headers.append("Cache-Control", "s-maxage=3600");
        event.waitUntil(cache.put(cacheKey, res.clone()));
    }
    return res;
}

function render(results, country) {
    let list = '<div class="container py-3">';
    list += `<h2 class="text-center">Viewing results from <span id="cf-country" class="flag-icon flag-icon-${country}"></span></h2>`;
    list += '<div class="row">';
    for (let result of results.results) {
        let now = new Date(result.start),
        badges = "";
        for(let label of result.labels)
		badges += `<span class="badge badge-info text-capitalize">${label}</span>&nbsp;`;
		date = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
		list += `<div class="col-sm-12 col-md-12 col-lg-4">`;
		list += `<div class="card mb-2">`;
		list += `<div class="card-body">`;
		list += `<a href="https://events.predicthq.com/events/${result.id}" target="_blank">${result.title}</a>`;
		list += `<p class="card-text text-muted">Begins on ${date}</p>`;
		list += `${badges}`;
		list += `</div>`;
		list += `</div>`;
		list += `</div>`;		
    }
    list += "</div>";
    list += "</div>";
    return list;
} 

class ElementHandler {
    constructor(data) {
      this.data = data;
    }
    element(element) {
      console.log(this.data);
      element.replace(this.data, {html: true})
    }
}