import ScrollReveal from 'scrollreveal'

/**
 * Single shared instance for the whole app. Creating a new ScrollReveal()
 * per component and destroying it on effect cleanup causes elements to get
 * stuck at opacity:0 under React 18 StrictMode's mount→cleanup→mount replay,
 * since the observer that would reveal them gets torn down before it fires.
 * viewFactor is lowered so reveal fires as soon as an element is barely
 * on-screen, instead of requiring 60% of it to be visible.
 */
export const sr = ScrollReveal({ reset: false, viewFactor: 0.1 })

/**
 * Safety net: if anything scrollreveal tagged is still sitting at
 * opacity:0 well after load (a stuck observer, a throttled/backgrounded
 * tab, a missed intersection edge case), force it visible so content can
 * never get permanently stuck invisible.
 */
if (typeof window !== 'undefined') {
  window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>('[data-sr-id]').forEach((el) => {
      if (getComputedStyle(el).opacity === '0') {
        el.style.opacity = '1'
        el.style.transform = 'none'
      }
    })
  }, 4000)
}
