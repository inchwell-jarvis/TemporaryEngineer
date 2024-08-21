<template>
	<view class="index">
		<u-navbar title="租车任务列表" :title-bold="true" title-color="#181C26" :is-back="false">
			<view class="right_icon">
				<image style="float: left" src="../static/icon/derection-left2.png" mode="" @click="custom_back()"></image>
				<image style="float: right" src="../static/icon/refresh.png" mode="" @click="start()"></image>
			</view>
		</u-navbar>
		<!-- 状态筛选 -->
		<div class="tabs"></div>

		<!-- 内容 -->
		<u-button type="primary" @click="">主要按钮</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: 'Hello',
			list: [
				{
					name: '待收货'
				},
				{
					name: '待付款'
				},
				{
					name: '待评价',
					count: 5
				}
			],
			current: 0
		};
	},
	onLoad() {},
	created() {
		this.start();
	},
	methods: {
		// 返回上一页
		custom_back() {
			uni.navigateBack({
				url: './login'
			});
		},
		// 获取城市未来15天限行政策
		async get_http() {
			console.log('开始请求');
			let data = await this.apix('https://eolink.o.apispace.com/5345645/lives_geo/v001/xianxing', { days: '15', areacode: '101010100' }, { headers: { 'X-APISpace-Token': 'hcdlax0fnmvp2zjap1ci6ttfz4caq9fx' } });
			console.log(data);
		},
		start() {}
	}
};
</script>

<style lang="scss" scoped>
.index {
	width: 100%;
	height: 100%;
	.right_icon {
		width: 100%;
		height: 100%;
		padding: 0 10px;
		box-sizing: border-box;
		image {
			width: 26px;
			height: 26px;
		}
	}
	//
	.tabs {
		width: 100%;
		height: 44px;
		background-color: #ccc;
	}
}
</style>
