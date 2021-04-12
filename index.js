addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
  
async function handleRequest(request) {
    let req = new Request(`https://api.predicthq.com/v1/events/?category=concerts%2Cfestivals&country=${request.cf.country}`);
    req.headers.set("Authorization", AUTH);
    let res = await fetch(req),
        results = await res.json();
    return render(results);
}
  
async function render(results) {
    let list = "<ul class=\"list-group\">";
    for (let result of results.results) list += `<li class="list-group-item"><a href="https://events.predicthq.com/events/${result.id}">${result.title}</a></li>`;
    list += "</ul>";
    console.log(list);
    let res = new Response(list);
    res.headers.set("content-type", "text/html");
    return res;
}  