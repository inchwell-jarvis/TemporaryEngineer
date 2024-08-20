<template>
	<view class="index">
		<u-navbar title="租车任务列表" :title-bold="true" title-color="#181C26"></u-navbar>
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
	onLoad() {
		try {
			const value = uni.getStorageSync('token');
			if (value) {
				console.log(value);
			}
		} catch (e) {
			// error
		}
	},
	methods: {
		async get_http() {
			console.log('开始请求');
			let data = await this.apix('https://eolink.o.apispace.com/5345645/lives_geo/v001/xianxing', { days: '15', areacode: '101010100' }, { headers: { 'X-APISpace-Token': 'hcdlax0fnmvp2zjap1ci6ttfz4caq9fx' } });
			console.log(data);
		},
		change(index) {
			this.current = index;
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	width: 100%;
	height: 100%;
}
</style>
