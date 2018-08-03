let lastCalledTime = 1
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

function hsla ({ hue, alpha }) {
  return `hsla(${hue}, 100%, 50%, ${alpha || 1})`
}

function update () {
  if (!lastCalledTime) {
    lastCalledTime = Date.now()
    return
  }
  delta = (Date.now() - lastCalledTime) / 1000
  lastCalledTime = Date.now()
  const fpsValue = Math.min(1 / delta, 60)
  fpsHistory.push(fpsValue)

  if (fpsCounter === 32) {
    const fpsAverage = Math.round(fpsHistory.reduce((a, b) => a + b, 0) / 100)
    domFpsValue.innerText = `${Math.round(fpsValue)}fps | Average: ${fpsAverage}fps`
    fpsCounter = 0
  }

  if (fpsHistory.length > 100) fpsHistory.shift()
  domTicks.forEach((t, i) => {
    const hue = (Math.max(fpsHistory[i] - 10, 0) / 60) * 150
    t.style.height = `${fpsHistory[i] / 60 * 100}%`
    t.style.background = hsla({ hue, alpha: 0.4 })
    t.style.borderTop = `solid 3px ${hsla({ hue, alpha: 1 })}`
  })

  fpsCounter++
  window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)
