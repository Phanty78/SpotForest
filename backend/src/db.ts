import { Database } from "bun:sqlite";
import type { Spot } from "./types.ts";

const db = new Database("mydb.sqlite", { strict: true });

// 1. Schéma — db.exec multi-statement
db.run(`
    CREATE TABLE IF NOT EXISTS spots (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

// 2. Statements préparés
export const addSpot = db.prepare(`
    INSERT INTO spots (id, title, description, category, latitude, longitude, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

export const getAllSpots = db.prepare(`SELECT * FROM spots`);
export const getSpotById = db.prepare(`SELECT * FROM spots WHERE id = ?`);
export const deleteSpotById = db.prepare(`DELETE FROM spots WHERE id = ?`);

// 3. Mapping SQL → Spot (created_at → createdAt)
export const rowToSpot = (row: any): Spot => ({
	id: row.id,
	title: row.title,
	description: row.description,
	category: row.category,
	latitude: row.latitude,
	longitude: row.longitude,
	createdAt: row.created_at,
});
