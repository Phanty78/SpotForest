import { addSpot, deleteSpotById, getAllSpots, getSpotById } from "./db.ts";
import type { Spot, SpotError, SpotId, ValidateSpotResult } from "./types.ts";

const server = Bun.serve({
	routes: {
		"/health": {
			GET: () => Response.json({ ok: true }),
		},

		"/spots": {
			GET: () => Response.json(getAllSpots()),
			POST: async (req) => {
				try {
					const body = await req.json();
					const result = validateBody(body);
					if (!result.ok) {
						return renderSpotError(result);
					}
					addSpot(result.value);
					return Response.json(result.value, { status: 201 });
				} catch {
					return new Response("invalid JSON", { status: 400 });
				}
			},
		},

		"/spots/:id": {
			GET: (req) => {
				const id = req.params.id;
				const parsedId = validateSpotId(id);
				if (!parsedId.ok) {
					return new Response(`${parsedId.message}`, { status: 400 });
				} else {
					const spot = getSpotById(parsedId.message);
					if (!spot) {
						return new Response("spot is undefined", { status: 404 });
					}
					return Response.json(spot);
				}
			},
			DELETE: (req) => {
				const id = req.params.id;
				const parsedId = validateSpotId(id);
				if (!parsedId.ok) {
					return new Response(`${parsedId.message}`, { status: 400 });
				} else {
					const deleted = deleteSpotById(id);
					if (!deleted) return new Response("not found", { status: 404 });
					return new Response(null, { status: 204 });
				}
			},
		},

		"/*": new Response("Lost in the forest?", { status: 404 }),
	},
});

function validateSpotId(id: string): SpotId {
	if (id === "") {
		return { ok: false, message: "id can't be empty" };
	}
	return { ok: true, message: id };
}

function validateBody(body: unknown): ValidateSpotResult {
	if (typeof body !== "object" || body === null) {
		return { ok: false, message: "invalid body" };
	}
	if (!("title" in body)) {
		return { ok: false, message: "title missing" };
	}
	if (!("category" in body)) {
		return { ok: false, message: "category missing" };
	}
	if (!("latitude" in body)) {
		return { ok: false, message: "latitude missing" };
	}
	if (!("longitude" in body)) {
		return { ok: false, message: "longitude missing" };
	}

	if (typeof body.title !== "string") {
		return { ok: false, message: "title invalid" };
	}

	let description: string | null = null;

	if ("description" in body) {
		if (body.description !== null && typeof body.description !== "string") {
			return { ok: false, message: "description invalid" };
		}

		description = body.description;
	}

	const latitudeNumber = Number(body.latitude);
	const longitudeNumber = Number(body.longitude);
	if (Number.isNaN(latitudeNumber)) {
		return { ok: false, message: "latitude invalid" };
	}
	if (Number.isNaN(longitudeNumber)) {
		return { ok: false, message: "longitude invalid" };
	}

	if (
		body.category === "viewpoint" ||
		body.category === "danger" ||
		body.category === "water" ||
		body.category === "parking" ||
		body.category === "other"
	) {
		const spot = {
			id: crypto.randomUUID(),
			title: body.title,
			description: description,
			category: body.category,
			latitude: latitudeNumber,
			longitude: longitudeNumber,
			createdAt: new Date().toISOString(),
		};
		return {
			ok: true,
			value: spot as Spot,
		};
	} else {
		return { ok: false, message: "category invalid" };
	}
}

function renderSpotError(error: SpotError): Response {
	switch (error.message) {
		case "invalid body":
			return new Response("Invalid Spot Body", { status: 400 });
		case "title missing":
			return new Response("title is missing in Spot", { status: 400 });
		case "category missing":
			return new Response("category is missing in Spot", { status: 400 });
		case "description missing":
			return new Response("description is missing in Spot", { status: 400 });
		case "latitude missing":
			return new Response("latitude is missing in Spot", { status: 400 });
		case "longitude missing":
			return new Response("longitude is missing in Spot", { status: 400 });
		case "latitude invalid":
			return new Response("latitude is invalid in Spot", { status: 400 });
		case "longitude invalid":
			return new Response("longitude is invalid in Spot", { status: 400 });
		case "category invalid":
			return new Response("category is invalid in Spot", { status: 400 });
		case "title invalid":
			return new Response("title is invalid in Spot", { status: 400 });
		case "description invalid":
			return new Response("description is invalid in Spot", { status: 400 });
		default: {
			const _exhaustive: never = error.message;
			return new Response(_exhaustive, { status: 400 });
		}
	}
}

console.log(`Listening on ${server.url}`);
