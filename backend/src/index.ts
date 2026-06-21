import type { Spot, SpotError } from "./types.ts"

const spots: Spot[] = [
  {
    id: "spot-1",
    title: "Belvédère de la Dent de Crolles",
    description: "Vue panoramique sur la Chartreuse et Belledonne.",
    category: "viewpoint",
    latitude: 45.3042,
    longitude: 5.8539,
    createdAt: "2026-06-15T09:30:00.000Z"
  },
  {
    id: "spot-2",
    title: "Source du Guiers Mort",
    description: null,
    category: "water",
    latitude: 45.3897,
    longitude: 5.8125,
    createdAt: "2026-06-16T14:12:00.000Z"
  },
  {
    id: "spot-3",
    title: "Passage exposé - Couloir Nord",
    description: "Attention, câble recommandé, terre glissante par temps humide.",
    category: "danger",
    latitude: 45.3112,
    longitude: 5.8601,
    createdAt: "2026-06-18T08:05:00.000Z"
  }
]

const server = Bun.serve({
    routes: {
        "/health": {
            GET: () => Response.json({ ok : true })
        },

        "/spots": {
            GET: () => Response.json(spots),
            POST: async req => {
              try {
                const body = await req.json()
                const parsedBody = validateBody(body)
                if ("ok" in parsedBody){
                  return new Response (`${parsedBody.message}`, { status: 400 })
                }
                spots.push(parsedBody)
                return new Response ("new spot added", { status : 201 })
              } catch {
                return new Response ("invalid JSON", { status : 400 })
              }
            },
        },

        "/*": new Response ("Lost in the forest?", { status : 404 })
    }
})

function validateBody(body : unknown): Spot | SpotError{
    if (typeof body !== "object" || body === null){
        return { ok : false, message : "invalid body" }
    }
    if (!("title" in body)){
        return { ok : false, message : "title missing" }
    }
    if (!("category" in body)){
        return { ok : false, message : "category missing" }
    }
    if (!("latitude" in body)){
        return { ok : false, message : "latitude missing" }
    }
    if (!("longitude" in body)){
        return { ok : false, message : "longitude missing" }
    }

    if (typeof body.title !== "string"){
      return { ok : false, message : "title invalid" }
    }

    let description: string | null = null

    if ("description" in body) {
      if (body.description !== null && typeof body.description !== "string") {
        return { ok: false, message: "description invalid" }
      }

    description = body.description
    }

    const latitudeNumber = Number(body.latitude)
    const longitudeNumber = Number(body.longitude)
    if (Number.isNaN(latitudeNumber)){
        return { ok : false, message : "latitude invalid" }
    }
    if (Number.isNaN(longitudeNumber)){
        return { ok : false, message : "longitude invalid" }
    }

    if (body.category === "viewpoint" || body.category === "danger" || body.category === "water" || body.category === "parking" || body.category === "other") {
      return {
        id: crypto.randomUUID(),
        title: body.title,
        description: description,
        category: body.category,
        latitude: latitudeNumber,
        longitude: longitudeNumber,
        createdAt: new Date().toISOString()
      }
    } else {
      return { ok : false, message : "category invalid" }
    }
}

console.log(`Listening on ${server.url}`)
