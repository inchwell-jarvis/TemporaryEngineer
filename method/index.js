import apix from './apix.js'
import path_to_base64 from './path_to_base64.js'
import compress_base64 from './compress_base64.js'
export default {
	install(Vue, options) {
		// apix
		Vue.prototype.apix = apix
		// path_to_base64
		Vue.prototype.path_to_base64 = path_to_base64
		Vue.prototype.compress_base64 = compress_base64

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