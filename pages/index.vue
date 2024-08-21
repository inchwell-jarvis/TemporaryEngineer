<template>
	<view class="index">
		<u-navbar title="租车任务列表" :title-bold="true" title-color="#181C26" :is-back="false">
			<view class="right_icon">
				<image style="float: left" src="../static/icon/derection-left2.png" mode="" @click="custom_back()"></image>
				<image style="float: right" src="../static/icon/refresh.png" mode="" @click="start()"></image>
			</view>
		</u-navbar>
		<!-- 状态筛选 -->
		<div class="tabs">
			<div v-for="(item,index) in tabs" :key="index" @click="tab_click(index)" :class="{'tab_item':true, 'tab_item_activation': item.activation}">
				<div class="text">
					<span>{{item.name}}</span>
					<div class="click"></div>
				</div>
			</div>
		</div>
		<!-- 接口筛选 -->
		<div class="features">
			<div class="features_item">
				<span>车牌</span>
				<image src="../static/icon/more.png" mode=""></image>
			</div>
			<div class="features_item">
				<span>司机</span>
				<image src="../static/icon/more.png" mode=""></image>
			</div>
			<div class="features_item">
				<span>送车区域</span>
				<image src="../static/icon/more.png" mode=""></image>
			</div>
		</div>
		<!-- 提示 -->
		<div class="tips">
			<u-icon name="info-circle"></u-icon>
			“送车”任务需要工程师提前30分钟送达
		</div>
		
		
		
		<div class="content">
			
		</div>
	
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{
					name: '全部',
					activation: true
				}, {
					name: '待分配',
					activation: false
				}, {
					name: '待接收',
					activation: false
				}, {
					name: '待取送',
					activation: false
				}],


			};
		},
		onLoad() {},
		created() {
			this.start();
		},
		methods: {
			tab_click(index) {
				// this.tabs
				this.tabs.forEach((rv, count) => {
					rv.activation = count == index
				})
			},
			// 返回上一页
			custom_back() {
				uni.navigateBack({
					url: './login'
				});
			},
			// 获取城市未来15天限行政策
			async get_http() {
				console.log('开始请求');
				let data = await this.apix('https://eolink.o.apispace.com/5345645/lives_geo/v001/xianxing', {
					days: '15',
					areacode: '101010100'
				}, {
					headers: {
						'X-APISpace-Token': 'hcdlax0fnmvp2zjap1ci6ttfz4caq9fx'
					}
				});
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
		color: #181C26;
		background-color: #f5f6fa;
		
		.content{
			width: 100%;
			height: 100%;
			height: calc(100% - 172px);
			// var(--status-bar-height);
			background: #000;
		}


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
			background-color: #fff;
			border-bottom: 0.5px solid #090F2014;
			box-sizing: border-box;

			.tab_item {
				width: 25%;
				height: 100%;
				float: left;
				display: flex;
				justify-content: center;

				.text {
					display: inline-block;
					height: 100%;
					line-height: 44px;
					font-size: 14px;
					position: relative;
					overflow: hidden;

					.click {
						width: 100%;
						height: 4px;
						border-radius: 4px;
						position: absolute;
						top: 42px;
					}
				}
			}

			.tab_item_activation {
				color: #4170FC;
				font-weight: bold;

				.click {
					background-color: #4170FC;
				}
			}
		}

		.features {
			width: 100%;
			height: 44px;
			background-color: #fff;
			padding-left: 10px;
			box-sizing: border-box;
			display: flex;
			justify-self: start;
			align-items: center;

			.features_item {
				display: inline-block;
				height: 28px;
				border-radius: 2px;
				background: #F5F6FA;
				line-height: 16px;
				color: #181C26B2;
				padding: 6px 10px;
				box-sizing: border-box;
				margin-left: 10px;
				font-size: 12px;

				span {
					float: left;
				}

				image {
					width: 16px;
					height: 16px;
					float: left;
				}
			}
		}

		.tips {
			width: 100%;
			height: 40px;
			background: #F1A22B1A;
			color: #DF8316;
			font-size: 14px;
			line-height: 40px;
			padding-left: 20px;
			box-sizing: border-box;
			overflow: hidden;
		}
	}
</style>