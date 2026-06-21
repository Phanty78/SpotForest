type Spot = {
      id: string
      title: string
      description: string | null
      category: "viewpoint" | "danger" | "water" | "parking" | "other"
      latitude: number
      longitude: number
      createdAt: string
    }