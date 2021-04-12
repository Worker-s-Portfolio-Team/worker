const concertPage = require("./lib/render.js");
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const page = new concertPage(await fetch(request));
    const results = await fetch(`https://api.songkick.com/api/3.0/metro_areas/${request.cf.metroCode}/calendar.json?apikey=${SongKickKey}`);
    response = await page.render(results);
    return response;
}