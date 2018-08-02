// const template = `<div id="fpsmeter">
// <p>Current: {{ Math.round(fps) }}fps | Average: {{ Math.round(fpsHistory.reduce((a, b) => a + b, 0) / 100) }}</p>
// <div class="fpsHistory">
//   <div
//     v-for="(val, i) in fpsHistory"
//     :key="fps-${i}"
//     class="fpsHistory__notch"
//     :style="styles__fpsBar(val)"
//   ></div>
// </div>
// </div>`

const fpsmeter = document.createElement('div')
fpsmeter.setAttribute('id', 'fpsMeterContainer')
fpsmeter.setAttribute('class', 'fps')

const fps = document.createElement('p')
fps.setAtrribute('class', 'fps__value')

const fpsHistory = document.createElement('div')
fpsHistory.setAttribute('class', 'fps__history')

const ticks = fpsHistory.map((t, i) => {
  const newTick = document.createElement('div')
  newTick.setAttribute('id', `tick-${`000${i}`.slice(-3)}`)
  newTick.setAttribute('class', 'fps__meter--tick')
  return newTick
})

ticks.forEach(t => {
  fpsHistory.appendChild(t)
})

fpsmeter.appendChild(fps)
fpsmeter.appendChild(fpsHistory)
document.body.appendChild(fpsmeter)

const domTicks = [... document.querySelectorAll('.tick')]
const domFpsValue = document.querySelector('.fps__value')

let lastCalledTime = 1
// let fpsValue = 1
let delta = 1
let fpsCounter = 60
const fpsHistory = [... new Array(100)].map(() => 60)

function update () {
  if (!lastCalledTime) {
    lastCalledTime = Date.now()
    // fpsValue = 0
    return
  }
  delta = (Date.now() - lastCalledTime) / 1000
  lastCalledTime = Date.now()
  if (fpsCounter === 16) {
    // fpsValue = Math.min(1 / delta, 60)
    const fpsValue = Math.min(1 / delta, 60)
    const fpsAverage = Math.round(fpsHistory.reduce((a, b) => a + b, 0) / 100)
    domFpsValue.innerText = `${Math.round(fpsValue)}fps | Average: ${fpsAverage}`
    const color = opacity => `hsla(${(Math.max(fpsVal - 10, 0) / 60) * 150}, 100%, 50%, ${opacity})`
    domTicks.forEach(t => {
      t.style.height = `${fpsVal / 60 * 100}%`
      t.style.background = color(0.4)
      t.style.borderTop = `solid 3px ${color(1)}`
    })
    fpsCounter = 0
  }
  fpsValueHistory.push(Math.min(1 / delta, 60))
  if (fpsValueHistory.length > 100) fpsValueHistory.shift()
  fpsCounter++
  window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)
