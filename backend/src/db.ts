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
const insertSpot = db.prepare(`
    INSERT INTO spots (id, title, description, category, latitude, longitude, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

const selectAllSpots = db.prepare(`SELECT * FROM spots`);
const selectSpotById = db.prepare(`SELECT * FROM spots WHERE id = ?`);
const eraseSpotById = db.prepare(`DELETE FROM spots WHERE id = ?`);

// 3. Mapping SQL → Spot (created_at → createdAt)
const rowToSpot = (row: any): Spot => ({
	id: row.id,
	title: row.title,
	description: row.description,
	category: row.category,
	latitude: row.latitude,
	longitude: row.longitude,
	createdAt: row.created_at,
});

export function getAllSpots(): Spot[] {
  return selectAllSpots.all().map(rowToSpot)
}

export function getSpotById(id : string): Spot | null {
  const row = selectSpotById.get(id)
  return row ? rowToSpot(row) : null
}

export function addSpot(spot : Spot): void {
  insertSpot.run(spot.id, spot.title, spot.description, spot.category, spot.latitude, spot.longitude, spot.createdAt)
}

export function deleteSpotById(id : string): boolean {
  return eraseSpotById.run(id).changes === 1
}