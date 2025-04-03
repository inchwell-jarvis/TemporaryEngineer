import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		index: 0,
		api_header: 'http://39.100.116.85:6001',
		// api_header: 'http://webapi.inchwell.com.cn'
	},
	mutations: {},
	actions: {},

})
export default store