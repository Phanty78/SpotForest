export type Spot = {
	id: string;
	title: string;
	description: string | null;
	category: "viewpoint" | "danger" | "water" | "parking" | "other";
	latitude: number;
	longitude: number;
	createdAt: string;
};

export type ValidateSpotResult =
	| { ok: true; value: Spot }
	| {
			ok: false;
			message:
				| "invalid body"
				| "title missing"
				| "category missing"
				| "description missing"
				| "latitude missing"
				| "longitude missing"
				| "latitude invalid"
				| "longitude invalid"
				| "category invalid"
				| "title invalid"
				| "description invalid";
	  };

export type SpotError = Extract<ValidateSpotResult, { ok: false }>;

export type SpotId =
	| { ok: true; message: string }
	| { ok: false; message: string };
