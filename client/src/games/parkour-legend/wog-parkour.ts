/**
 * WallOfGreen Element ID System — Parkour Legend
 *
 * Project-specific wog-id definitions for the Parkour Legend game.
 * See /wog-id.ts for the core system.
 *
 * Every UI element should have a data-wog-id attribute as its first attribute.
 * Format: 2-letter prefix + dash + 3-digit number (e.g., PK-001, LM-023)
 *
 * Usage in JSX:
 *   <div data-wog-id={wogId("PK", 1)} className="...">  // "PK-001"
 *   <button {...wog("LM", 5)} onClick={...}>             // "LM-005"
 *
 * Prefixes for Parkour Legend:
 *   PK — ParkourLegend root component (HUD, overlays, mute button)
 *   LM — Level menu (campaign list, custom level list, create button)
 *   GC — Game canvas and game loop
 *   LE — Level editor (canvas, mouse interactions)
 *   ET — Editor toolbar (tools, properties panel, actions)
 *   OV — Overlay screens (ready, ended, won)
 */

import { wogId, wog, createWogFactory, createWogAttrFactory } from "../../lib/wog-id";
import type { WogPrefix } from "../../lib/wog-id";

/** Parkour Legend specific prefixes */
export type ParkourWogPrefix =
  | "PK"   // ParkourLegend root
  | "LM"   // Level menu
  | "GC"   // Game canvas
  | "LE"   // Level editor
  | "ET"   // Editor toolbar
  | "OV";  // Overlays

// Re-export core utilities typed for convenience
export { wogId, wog, createWogFactory, createWogAttrFactory };
export type { WogPrefix };
