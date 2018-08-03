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

let lastCalledTime = 1
// let fpsValue = 1
let delta = 1
let fpsCounter = 0
const fpsHistory = [... new Array(100)].map(() => 60)


const fpsmeter = document.createElement('div')
fpsmeter.setAttribute('id', 'fpsMeterContainer')
fpsmeter.setAttribute('class', 'fps')

const fps = document.createElement('p')
fps.setAttribute('class', 'fps__value')

const fpsHistoryContainer = document.createElement('div')
fpsHistoryContainer.setAttribute('class', 'fps__history')

const ticks = fpsHistory.map((t, i) => {
  const newTick = document.createElement('div')
  newTick.setAttribute('id', `tick-${`000${i}`.slice(-3)}`)
  newTick.setAttribute('class', 'fps__history--tick')
  return newTick
})

ticks.forEach(t => {
  fpsHistoryContainer.appendChild(t)
})

fpsmeter.appendChild(fps)
fpsmeter.appendChild(fpsHistoryContainer)
document.body.appendChild(fpsmeter)

const domTicks = [... document.querySelectorAll('.fps__history--tick')]
const domFpsValue = document.querySelector('.fps__value')


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
    const color = opacity => `hsla(${(Math.max(fpsValue - 10, 0) / 60) * 150}, 100%, 50%, ${opacity})`
    console.log('frame')
    domTicks.forEach((t, i) => {
      t.style.height = `${fpsHistory[i] / 60 * 100}%`
      t.style.background = color(0.4)
      t.style.borderTop = `solid 3px ${color(1)}`
    })
    fpsCounter = 0
  }
  fpsHistory.push(Math.min(1 / delta, 60))
  if (fpsHistory.length > 100) fpsHistory.shift()
  fpsCounter++
  window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)
