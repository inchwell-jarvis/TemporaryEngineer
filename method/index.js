import apix from './apix.js'
export default {
	install(Vue, options) {
		// apix
		Vue.prototype.apix = apix

		//title
		Vue.prototype.hint = function(res) {
			uni.showToast({
				title: res,
				icon: "none"
			})
			return false
		}
	}
}