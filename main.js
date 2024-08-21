import App from './App'
import Vue from 'vue'

import uView from "uview-ui";
Vue.use(uView);

// 插件
import method from './method/index.js'
Vue.use(method)

//引入vuex
import store from './store'
Vue.prototype.$store = store

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()