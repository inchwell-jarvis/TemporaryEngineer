<script>
export default {
	onLaunch: function () {
		console.log('打开app');
		try {
			const value = uni.getStorageSync('token');
			if (value) {
				uni.navigateTo({
					url: `/pages/index`
				});
			}
		} catch (e) {
			// error
		}
	},
	onShow: function () {
		console.log('app进入前台');
	},
	onHide: function () {
		console.log('app进入后台');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
	html,
	body,
	uni-page-body,
	uni-page-refresh {
		width: 100%;
		height: 100%;
		background: #f6f6f6;
		font-size: 14px;
	}

	.box {
		width: 100%;
		height: 100%;
		background: #f6f6f6;
		overflow: auto;
	}

	/*每个页面公共css */
</style>
</style>
