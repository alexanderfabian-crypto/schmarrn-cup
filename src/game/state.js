export function createState() {
  return {
    time: 0,
  }
}

export function step(state, dt) {
  state.time += dt
}
