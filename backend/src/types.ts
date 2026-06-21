export type Spot = {
      id: string
      title: string
      description: string | null
      category: "viewpoint" | "danger" | "water" | "parking" | "other"
      latitude: number
      longitude: number
      createdAt: string
    }

export type SpotError = {
  ok: false
  message: "invalid body" | "title missing" | "category missing" | "description missing" | "latitude missing" | "longitude missing" | "latitude invalid" | "longitude invalid" | "category invalid" | "title invalid" | "description invalid"
}