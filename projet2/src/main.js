import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';




import ListeRestaurants from './components/ListeRestaurants.vue'
import Restaurant from './components/Restaurant.vue'


Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker)

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueMaterial)

//Définir les routes
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: ListeRestaurants
    },
    {
      path: '/restaurant/:id',
      component: Restaurant
    }
  ],
  mode: 'history'
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
