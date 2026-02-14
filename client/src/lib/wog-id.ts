/**
 * WallOfGreen Element ID System
 *
 * Every UI element should have a data-wog-id attribute as its first attribute.
 * Format: 2-letter prefix + dash + 3-digit number (e.g., UT-001, HD-023, PR-102)
 *
 * Usage in JSX:
 *   <div data-wog-id={wogId("UT", 1)} className="...">  // "UT-001"
 *   <Button data-wog-id={wogId("HD", 5)} onClick={...}> // "HD-005"
 *
 * Or with the shorthand:
 *   <div {...wog("UT", 1)} className="...">
 *
 * This allows referencing elements by ID in instructions:
 *   "Move PR-012 inside UT-003"
 *   "Delete HD-005"
 *   "Add a button after EL-010"
 *
 * Prefixes by component:
 *   PR — Project workspace page
 *   BU — Builder mode
 *   UT — Unit tests mode
 *   E2 — E2E tests mode
 *   EL — Endpoint list
 *   RB — Request builder
 *   RV — Response viewer
 *   HD — Header
 *   FT — Footer
 *   LG — Logo
 *   NF — Not found (404)
 *   HM — Home page
 *   LP — Landing page
 *   SV — Swagger validation dialog
 *   ED — Edit test dialog
 *   EX — Export dialog
 *   IM — Import dialog
 *   TC — Test connection button
 *   PP — Privacy page
 *   TM — Terms page
 *   CT — Contact page
 *   TR — Test row
 */

/** Known prefixes for type safety */
export type WogPrefix =
  | "PR" | "BU" | "UT" | "E2" | "EL" | "RB" | "RV"
  | "HD" | "FT" | "LG" | "NF" | "HM" | "LP" | "SV"
  | "ED" | "EX" | "IM" | "TC" | "PP" | "TM" | "CT" | "TR";

/**
 * Generate a wog-id string with given prefix and number
 * Number is zero-padded to 3 digits for consistent format
 * Optional letter suffix for sub-elements
 *
 * @example
 * wogId("UT", 1)      // "UT-001"
 * wogId("PR", 42)     // "PR-042"
 * wogId("HD", 100)    // "HD-100"
 * wogId("TR", 16, "a") // "TR-016a"
 */
export function wogId(prefix: WogPrefix | string, num: number, suffix?: string): string {
  return `${prefix}-${num.toString().padStart(3, "0")}${suffix || ""}`;
}

/**
 * Generate a data-wog-id attribute object for spreading onto elements
 * This is a shorthand for adding the data-wog-id attribute
 *
 * @example
 * <div {...wog("UT", 1)} className="...">
 * // Equivalent to: <div data-wog-id="UT-001" className="...">
 * <div {...wog("TR", 16, "a")} className="...">
 * // Equivalent to: <div data-wog-id="TR-016a" className="...">
 */
export function wog(prefix: WogPrefix | string, num: number, suffix?: string): { "data-wog-id": string } {
  return { "data-wog-id": wogId(prefix, num, suffix) };
}

/**
 * Create a wog-id factory for a specific prefix
 * Useful when adding many IDs in a single component
 *
 * @example
 * const id = createWogFactory("UT");
 * <div data-wog-id={id(1)} className="...">    // "UT-001"
 * <div data-wog-id={id(2)} className="...">    // "UT-002"
 * <div data-wog-id={id(16, "a")} className="..."> // "UT-016a"
 */
export function createWogFactory(prefix: WogPrefix | string): (num: number, suffix?: string) => string {
  return (num: number, suffix?: string) => wogId(prefix, num, suffix);
}

/**
 * Create a wog attribute factory for a specific prefix
 * Returns spreadable objects for cleaner JSX
 *
 * @example
 * const wogUT = createWogAttrFactory("UT");
 * <div {...wogUT(1)} className="...">       // data-wog-id="UT-001"
 * <div {...wogUT(2)} className="...">       // data-wog-id="UT-002"
 * <div {...wogUT(16, "a")} className="..."> // data-wog-id="UT-016a"
 */
export function createWogAttrFactory(prefix: WogPrefix | string): (num: number, suffix?: string) => { "data-wog-id": string } {
  return (num: number, suffix?: string) => wog(prefix, num, suffix);
}

// Legacy support - keep old function name working
export const makeWogId = wogId;
