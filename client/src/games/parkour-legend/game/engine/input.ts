// Keyboard input manager — tracks held & just-pressed keys per frame

const held = new Set<string>();
const justPressed = new Set<string>();
const processed = new Set<string>();   // keys already consumed by justPressed this frame

function onKeyDown(e: KeyboardEvent) {
  const code = e.code;
  if (!held.has(code)) {
    justPressed.add(code);
  }
  held.add(code);
  // prevent page scroll on Space / arrows
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(code)) {
    e.preventDefault();
  }
}

function onKeyUp(e: KeyboardEvent) {
  held.delete(e.code);
  processed.delete(e.code);
}

export function initInput() {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}

export function teardownInput() {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  held.clear();
  justPressed.clear();
  processed.clear();
}

/** Call once per frame AFTER consuming input */
export function flushInput() {
  justPressed.clear();
}

export function isHeld(code: string): boolean {
  return held.has(code);
}

export function wasJustPressed(code: string): boolean {
  if (justPressed.has(code) && !processed.has(code)) {
    processed.add(code);
    return true;
  }
  return false;
}

// Convenience helpers
export function leftHeld(): boolean {
  return isHeld("ArrowLeft") || isHeld("KeyA");
}

export function rightHeld(): boolean {
  return isHeld("ArrowRight") || isHeld("KeyD");
}

export function jumpPressed(): boolean {
  return wasJustPressed("Space") || wasJustPressed("ArrowUp") || wasJustPressed("KeyW");
}
