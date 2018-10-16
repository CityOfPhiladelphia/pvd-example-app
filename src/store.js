import Vue from 'vue';
import Vuex from 'vuex';
import mergeDeep from './util/merge-deep';
import philaVueDatafetch from '@cityofphiladelphia/phila-vue-datafetch'
const pvdStore = philaVueDatafetch.pvdStore

// when you load vuex from a script tag this seems to happen automatically
Vue.use(Vuex);

function createStore(config) {
  console.log('createStore is running, config:', config);
  const sources = pvdStore.createSources(config);
  const parcels = pvdStore.createParcels(config);

  const initialState = {
    candidates: [],
    addressEntered: null,
    parcels,
    sources,
  };

  const mb = {
    state: initialState,
    mutations: {
      setCandidates(state, payload) {
        state.candidates = payload;
      },
      setAddressEntered(state, payload) {
        state.addressEntered = payload;
      },
    }
  }

  let mergeStore = mergeDeep(mb, pvdStore.store);
  console.log('mergeStore:', mergeStore);

  // TODO standardize how payloads are passed around/handled
  return new Vuex.Store({
    state: mergeStore.state,
    getters: mergeStore.getters,
    mutations: mergeStore.mutations
  });
}

export default createStore;
