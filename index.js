addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
  
async function handleRequest(req) {
    let url = new URL(req.url);
    let data = new Request(`https://api.predicthq.com/v1/events/?category=concerts%2Cfestivals&country=${req.cf.country}`);
    data.headers.set("Authorization", AUTH);
    let res = await fetch(data);
    data = render(await res.json());
    return new HTMLRewriter().on("ul", new ElementHandler(data)).transform(await fetch("https://concert.goalastair.com"));
}
  
function render(results) {
    let list = "";
    for (let result of results.results) list += `<li class="list-group-item"><a href="https://events.predicthq.com/events/${result.id}">${result.title}</a></li>`;
    return list;
} 

class ElementHandler {
    constructor(data) {
      this.data = data;
    }
    element(element) {
      console.log(this.data);
      element.setInnerContent(this.data, {html: true})
    }
  }