const server = Bun.serve({
    routes: {
        "/health": Response.json({ ok : true })
    }
})

console.log(`Listening on ${server.url}`)