/*
                .___                                             .__
_________  ____| _/          ____ ___  ________    _____ ______ |  |   ____           _____  ______ ______
\____ \  \/ / __ |  ______ _/ __ \\  \/  /\__  \  /     \\____ \|  | _/ __ \   ______ \__  \ \____ \\____ \
|  |_> >   / /_/ | /_____/ \  ___/ >    <  / __ \|  Y Y  \  |_> >  |_\  ___/  /_____/  / __ \|  |_> >  |_> >
|   __/ \_/\____ |          \___  >__/\_ \(____  /__|_|  /   __/|____/\___  >         (____  /   __/|   __/
|__|            \/              \/      \/     \/      \/|__|             \/               \/|__|   |__|

*/

import Vue from 'vue';
import axios from 'axios';
import createStore from './store';
import configMixin from './util/config-mixin';
import App from './components/App.vue';
import mergeDeep from './util/merge-deep';
import config from './config.js'

import '@fortawesome/fontawesome-pro/js/all';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '../node_modules/phila-standards/dist/css/phila-app.min.css';
import './styles.css';

import philaVueDatafetch from '@cityofphiladelphia/phila-vue-datafetch';
const controllerMixin = philaVueDatafetch.controllerMixin;

const clientConfig = config;
const baseConfigUrl = config.baseConfig;
// get base config
axios.get(baseConfigUrl).then(response => {
  // console.log('in axios, clientConfig:', clientConfig);
  const data = response.data;
  const baseConfigFn = eval(data);
  const { gatekeeperKey } = clientConfig;
  const baseConfig = baseConfigFn({ gatekeeperKey });

  // deep merge base config and client config
  const config = mergeDeep(baseConfig, clientConfig);
  const store = createStore(config);

  // mix in controller
  Vue.use(controllerMixin, { config, store });

  Vue.component('font-awesome-icon', FontAwesomeIcon)

  // mount main vue
  const vm = new Vue({
    el: '#vue-app',
    render: h => h(App),
    store
  });

}).catch(err => {
  console.error('Error loading base config:', err);
});
