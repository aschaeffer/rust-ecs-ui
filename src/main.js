import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'bpmn-font/dist/css/bpmn.css'
import '../public/css/inexor-ecs/inexor-ecs.css'
import '../public/css/fira-code/fira-code.css'

import 'diagram-js/assets/diagram-js.css'
import 'diagram-js-minimap/assets/diagram-js-minimap.css'

import '../public/css/diagram-js.css'

import App from './App.vue'

Vue.config.productionTip = false

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
  render: h => h(App),
}).$mount('#app')
