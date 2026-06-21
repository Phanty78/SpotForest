const server = Bun.serve({
    routes: {
        "/health": {
            GET: () => Response.json({ ok : true })
        },

        "/spots": {
            GET: () => new Response("spots endpoint", { status : 200 })
        },

        "/*": new Response ("Lost in the forest?", { status : 404 })
    }
})

console.log(`Listening on ${server.url}`)