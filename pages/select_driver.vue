<template>
	<view class="select_driver">
		<!--  -->
		<u-navbar title="选择工程师" :title-bold="true" title-color="#181C26" :is-back="false">
			<view class="right_icon">
				<image style="float: left" src="../static/icon/close.png" mode="" @click="custom_back()"></image>
			</view>
		</u-navbar>
		<!--  -->
		<div class="order_info">
			<!-- 送车 还是 取车 -->
			<div class="dispatch_car">
				<div class="dispatch_car_icon_s" v-if="user_data.Direction == '送车'">送车</div>
				<div class="dispatch_car_icon_q" v-if="user_data.Direction == '取车'">取车</div>
			</div>
			<!-- 地址时间 -->
			<div class="address_time">
				<div class="door_to_door_time">{{ user_data.web_time }}</div>
				<div class="task_address">{{ user_data.TargetAddress }}</div>
			</div>
		</div>
		<!--  -->
		<div class="search_for_driver">
			<div class="input_box">
				<div class="search_icon">
					<image src="../static/icon/search.png" mode=""></image>
				</div>
				<input type="text" v-model="search_driver" placeholder="搜索司机姓名" />
				<div class="search_close" v-if="search_driver" @click="search_driver = ''">
					<image src="../static/icon/close-full.png" mode=""></image>
				</div>
			</div>
		</div>
		<!--  -->
		<div class="content">
			<!--  -->
			<div class="engineers" v-for="(item, index) in engineers" :key="index" @tap="engineer_click(item)">
				<!-- 左侧工程师信息 -->
				<div class="info">
					<div class="icon" v-if="item.bool">
						<image src="../static/icon/selected-full.png" mode=""></image>
					</div>
					<div class="text">
						<div class="p1">{{ item.Name }}</div>
						<div class="p2">{{ item.Mobile }}</div>
					</div>
				</div>
				<!-- 右侧电话图标 -->
				<div class="phone">
					<div class="phone_icon" @click.stop="call_engineers(item)">
						<image src="../static/icon/phone-full.png" mode=""></image>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 订单信息
			user_data: {},
			// 检索工程师
			search_driver: '',
			// 工程师集合
			engineers_back: [],
			engineers: []
		};
	},
	onLoad(option) {
		let data = JSON.parse(decodeURIComponent(option.data));
		this.user_data = data;
		console.log(data);
	},
	created() {
		this.start();
	},
	watch: {
		search_driver(new_search_driver) {
			if (!new_search_driver) this.engineers = this.engineers_back;
			if (new_search_driver) this.engineers = this.engineers_back.filter((rv) => rv.Name.indexOf(new_search_driver.trim()) != -1);
		}
	},
	methods: {
		custom_back() {
			uni.navigateTo({
				url: `/pages/index`
			});
		},
		// 获取可用工程师
		start() {
			this.apix('System/GetEmployeeMini', { type: '15' }).then((rv) => {
				console.log(rv);
				this.engineers_back = rv.Data;
				this.engineers_back.forEach((rv) => {
					this.$set(rv, 'bool', false);
				});
				this.engineers = this.engineers_back;
			});
		},
		// 打电话
		call_engineers(item) {
			// 综合正则表达式，适用于移动电话和固定电话
			const phoneRegex = /^(\+?86)?(0\d{2,3}-)?1[3-9]\d{9}$|^(0\d{2,3}-)?\d{7,8}$/;
			if (!phoneRegex.test(item.Mobile)) {
				uni.showToast({
					title: '电话格式不正确',
					duration: 2000,
					icon: 'error'
				});
				return;
			}

			uni.makePhoneCall({
				phoneNumber: item.Mobile //仅为示例
			});
		},
		// 选择了工程师
		engineer_click(item) {
			//
			this.engineers.forEach((element) => {
				if (element.Mobile == item.Mobile) {
					element.bool = true;
				} else {
					element.bool = false;
				}
			});
			//
			this.apix('CarRental/UpdateCarSOOrderStateA', { id: this.user_data.ID, str: item.EmployeeId }, { method: 'post' }).then((rv) => {
				console.log(rv);
				uni.showToast({
					title: '任务分配成功!',
					icon: 'none'
				});
				uni.navigateBack({
					url: './index'
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.select_driver {
	width: 100%;
	height: 100%;
	color: #181c26;
	background-color: #f5f6fa;
	//
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
	.order_info {
		width: 100%;
		height: 58px;
		border-bottom: 0.5px solid #090f2014;
		box-sizing: border-box;
		background: #ffffff;
		padding: 8px 16px;
		.dispatch_car {
			width: 32px;
			height: 28px;
			float: left;
			.dispatch_car_icon_s {
				width: 100%;
				height: 20px;
				margin-top: 4px;
				border-radius: 3px;
				background-color: #e54337;
				font-size: 12px;
				text-align: center;
				line-height: 20px;
				color: #ffffff;
			}
			.dispatch_car_icon_q {
				width: 100%;
				height: 20px;
				margin-top: 4px;
				border-radius: 3px;
				background-color: #4170fc;
				font-size: 12px;
				text-align: center;
				line-height: 20px;
				color: #ffffff;
			}
		}
		.address_time {
			width: calc(100% - 42px);
			height: 100%;
			float: left;
			margin-left: 10px;
			.door_to_door_time {
				width: 100%;
				height: 22px;
				line-height: 22px;
				font-size: 14px;
				font-weight: bold;
				overflow: hidden;
			}
			.task_address {
				width: 100%;
				max-height: 20px;
				font-size: 14px;
				line-height: 22px;
				color: #181c26b2;
				overflow: hidden;
				word-break: break-all; /* break-all(允许在单词内换行。) */
				text-overflow: ellipsis; /* 超出部分省略号 */
				display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
				-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
				-webkit-line-clamp: 1; /** 显示的行数 **/
			}
		}
	}
	.search_for_driver {
		width: 100%;
		height: 52px;
		background: #ffffff;
		padding: 8px 16px;
		box-sizing: border-box;
		.input_box {
			width: 100%;
			height: 100%;
			background: #f5f6fa;
			border-radius: 6px;
			padding: 8px;
			box-sizing: border-box;
			.search_icon {
				width: 20px;
				height: 20px;
				float: left;
				padding: 2px;
				box-sizing: border-box;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.search_close {
				width: 20px;
				height: 20px;
				float: left;
				padding: 2px;
				box-sizing: border-box;
				image {
					width: 100%;
					height: 100%;
				}
			}
			input {
				width: calc(100% - 40px);
				height: 20px;
				float: left;
				font-size: 14px;
			}
		}
	}
	//
	.content {
		width: 100%;
		height: calc(100% - 58px - 52px - 44px - var(--status-bar-height));
		overflow: auto;
		padding: 0 10px;
		box-sizing: border-box;
		.engineers {
			width: 100%;
			height: 72px;
			background-color: #fff;
			border-radius: 8px;
			margin-top: 10px;
			padding: 12px;
			box-sizing: border-box;
			.info {
				width: calc(100% - 40px);
				height: 100%;
				float: left;
				.icon {
					width: 30px;
					height: 100%;
					float: left;
					image {
						width: 20px;
						height: 20px;
					}
				}
				.text {
					width: calc(100% - 30px);
					height: 100%;
					float: left;
					.p1 {
						width: 100%;
						height: 26px;
						line-height: 26px;
						font-weight: bold;
						font-size: 18px;
					}
					.p2 {
						width: 100%;
						height: 22px;
						line-height: 22px;
						font-size: 14px;
						color: #181c26b2;
					}
				}
			}
			.phone {
				width: 40px;
				height: 100%;
				float: right;
				display: flex;
				align-items: center;
				justify-content: end;

				.phone_icon {
					width: 28px;
					height: 28px;
					background: #f5f6fa;
					border-radius: 6px;
					padding: 6px;
					box-sizing: border-box;
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
}
</style>
