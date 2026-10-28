// Coordinates the boot screen with the page: hero animations, smooth scroll and the
// Three.js dome's "assemble" all wait for the system to report armed.

let resolveIntro: () => void = () => {}

export const introReady = new Promise<void>((resolve) => {
  resolveIntro = resolve
})

export const markIntroDone = () => resolveIntro()

/** Web fonts loaded — but never wait more than 2.5s on a slow font CDN. */
export const fontsReady: Promise<unknown> = Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((r) => setTimeout(r, 2500)),
])
