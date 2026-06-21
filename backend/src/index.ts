const server = Bun.serve({
    routes: {
        "/health": Response.json({ ok : true }),

        "/*": new Response ("Lost in the forest?", { status : 404 })
    }
})

console.log(`Listening on ${server.url}`)