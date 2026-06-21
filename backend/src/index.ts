import type { Spot } from "./types.ts"

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
            GET: () => Response.json(spots)
        },

        "/*": new Response ("Lost in the forest?", { status : 404 })
    }
})

console.log(`Listening on ${server.url}`)
