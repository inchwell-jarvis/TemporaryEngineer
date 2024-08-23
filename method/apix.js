import $store from '../store/index.js'
let api_header = $store.state.api_header + '/api/'
// 常量定义
const TOKEN_KEY = 'token';
// const LOGIN_PAGE_URL = '../pages/signIn/index';

/**
 * 调用接口的通用函数
 * @param {string} http - 接口地址
 * @param {object} [data={}] - 请求数据
 * @param {object} [methods={}] - 请求方法，默认是 GET
 * @returns {Promise} - 返回一个 Promise 对象
 */

export default async function apix(http, data = {}, methods = {}) {
	return new Promise((resolve, reject) => {
		// 获取本地存储的 token

		try {
			const token_value = uni.getStorageSync(TOKEN_KEY);

			// 获取到值了
			// if (token_value) {
			// 	console.log('token:' + token_value);
			// } else {
			// 	console.log('没有token')
			// }

			// 调接口
			uni.request({
				url: api_header + http,
				method: methods.method || 'GET',
				header: {
					'token': token_value,
					...methods.headers
				},
				data: data,
				success: (response) => {

					let api_response = {
						url: http,
						method: methods.method || 'GET',
						header: {
							'token': token_value,
							...methods.headers
						},
						data,
						response
					}
					console.log('接口记录 apix==>', api_response);


					console.log(response)
					// 解析响应数据
					let responseData = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

					let state = responseData.Code;

					if (state !== 0) {
						uni.showToast({ title: responseData.Msg, icon: "none" });

						// 身份过期
						if (state === 3) {
							uni.navigateTo({ url: LOGIN_PAGE_URL });
							uni.hideLoading();
						}
						reject(responseData)
						return;
					}
					resolve(responseData);
				},
				fail: (error) => {
					reject(error);
					uni.showToast({
						title: error,
						icon: "none"
					})
				},
				complete: () => {

				}
			});
		} catch (e) {
			console.log(e)
			uni.showToast({
				title: String(e),
				icon: "none"
			})
		}
	});
}