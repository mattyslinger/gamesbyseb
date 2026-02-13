export interface GameMeta {
  title: string;
  description: string;
  slug: string;
  path: string;
  thumbnail: string;
  tags: string[];
}

export const GAMES: GameMeta[] = [
  {
    title: "Parkour Legend",
    description:
      "Climb platforms, dodge obstacles, and swing your way to the top in this fast-paced parkour challenge.",
    slug: "parkour-legend",
    path: "/games/parkour-legend",
    thumbnail: "/thumbnails/parkour-legend.png",
    tags: ["Platformer", "Action"],
  },
];
