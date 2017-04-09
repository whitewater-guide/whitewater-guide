export default function currentStateSelector(state) {
  if (state.persistent && state.persistent.nav) {
    return currentStateSelector(state.persistent.nav);
  } else if (state.hasOwnProperty('routes') && state.hasOwnProperty('index')){
    return currentStateSelector(state.routes[state.index]);
  }
  return state;
}
