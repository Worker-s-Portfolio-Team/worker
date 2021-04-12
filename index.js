addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
  
async function handleRequest(req) {
    let url = new URL(req.url);
    let data = new Request(`https://api.predicthq.com/v1/events/?category=concerts%2Cfestivals&country=${req.cf.country}`);
    data.headers.set("Authorization", AUTH);
    let res = await fetch(data, {
        cf: {
            cacheTtl: 3600,
            cacheEverything: true
        }
      });
    data = render(await res.json());
    return new HTMLRewriter().on("section", new ElementHandler(data)).transform(await fetch("https://concert.goalastair.com"));
}
  
/* 
function render(results) {
    let list = "<div class=\"card-group\">";
    for (let result of results.results) {
        let now = new Date(result.start),
        badges = "";
        for(let label of result.labels)
            badges += `<span class="badge badge-info">${label}</span>&nbsp;`;
        date = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
        list += `<div class="card text-center">
            <div class="card-body">
                <a href="https://events.predicthq.com/events/${result.id}">${result.title}</a>
                <p class="card-text">Begins on ${date}</p>
                ${badges}
            </div>
        </div>`;
    }
    list += "</div>";
    return list;
} 
*/

function render(results) {
    let list = '<div class="container py-3">';
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
		list += `<a href="https://events.predicthq.com/events/${result.id}">${result.title}</a>`;
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