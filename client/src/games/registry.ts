export interface GameMeta {
  title: string;
  description: string;
  slug: string;
  path: string;
  tags: string[];

  /** Tile appearance on the homepage */
  tile: {
    emoji: string;
    gradient: string;
    tagColor: string;
    tagBackground: string;
    tagBorder: string;
    hoverGlow: string;
  };
}

export const GAMES: GameMeta[] = [
  {
    title: "Parkour Legend",
    description:
      "Climb platforms, dodge obstacles, and swing your way to the top in this fast-paced parkour challenge.",
    slug: "parkour-legend",
    path: "/games/parkour-legend",
    tags: ["Platformer", "Action"],
    tile: {
      emoji: "🏃",
      gradient:
        "linear-gradient(135deg, #ff6b6b 0%, #ffc300 25%, #4ecdc4 50%, #9b59b6 75%, #2ecc71 100%)",
      tagColor: "#ffc300",
      tagBackground: "rgba(255,195,0,0.2)",
      tagBorder: "rgba(255,195,0,0.3)",
      hoverGlow: "0 12px 40px rgba(255,107,107,0.2), 0 4px 12px rgba(0,0,0,0.3)",
    },
  },
];
