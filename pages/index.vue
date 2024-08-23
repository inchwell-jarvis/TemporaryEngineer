<template>
	<view class="index">
		<u-navbar title="租车任务列表" :title-bold="true" title-color="#181C26" :is-back="false">
			<view class="right_icon">
				<image style="float: left" src="../static/icon/derection-left2.png" mode="" @click="custom_back()"></image>
				<image style="float: right" src="../static/icon/refresh.png" mode="" @click="start('刷新')"></image>
			</view>
		</u-navbar>
		<!-- 状态筛选 -->
		<div class="tabs">
			<div v-for="(item, index) in tabs" :key="index" @click="tab_click(index)" :class="{ tab_item: true, tab_item_activation: item.activation }">
				<div class="text">
					<span>{{ item.name }} {{ tab_count(item.count) || '' }}</span>
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

		<!-- 没有订单 -->
		<div class="no_orders" v-if="!orders.length">
			<image src="../static/icon/none.png" mode="aspectFit"></image>
		</div>

		<!-- 有订单 -->
		<div class="index_content" v-else>
			<!-- 单个订单 -->
			<div class="order_item" v-for="(item, index) in orders" :key="index">
				<!-- 车牌 与 订单状态 -->
				<div class="item_header">
					<!-- 车牌 -->
					<div class="license_plate">{{ item.Plate }}</div>
					<!-- 状态 -->
					<div class="order_state">
						<image src="../static/icon/derection-right.png" mode="aspectFit"></image>
						<span :style="{ color: edit_color(item) }">{{ item.StateStr2 }}</span>
					</div>
				</div>

				<!-- 地址 与 时间 -->
				<div class="item_delivery_information">
					<!-- 送车 还是 取车 -->
					<div class="dispatch_car">
						<div class="dispatch_car_icon_s" v-if="item.Direction == '送车'">送车</div>
						<div class="dispatch_car_icon_q" v-if="item.Direction == '取车'">取车</div>
					</div>
					<!-- 地址时间 -->
					<div class="address_time">
						<div class="door_to_door_time">{{ item.web_time }}</div>
						<div class="task_address">{{ item.TargetAddress }}</div>
					</div>
				</div>

				<!-- 操作按钮 -->
				<div class="item_footer_">
					<!-- 1 -->
					<div class="item_footer_box" v-if="item.State == 1">
						<div class="button" @click.stop="update_order('分配', item)">分配</div>
					</div>
					<!-- 2、5 -->
					<div class="item_footer_box" v-if="item.State == 2 || item.State == 5">
						<!-- 管理员查看 可以给司机打电话 -->
						<div class="admin_see1" v-if="item.IsAdmin && !item.IsMy" @click.stop="call_phone(item.EngineerInfo.MobilePhone)">
							<image src="../static/icon/phone-full_black.png" mode=""></image>
							司机-{{ item.EngineerInfo.ChineseName }}
						</div>
						<!-- 工程师操作 -->
						<div class="refuse" v-if="!(item.IsAdmin && !item.IsMy)" @click.stop="update_order('拒绝', item)">拒绝</div>
						<div class="accept" v-if="!(item.IsAdmin && !item.IsMy)" @click.stop="update_order('接受', item)">接受</div>
					</div>
					<!-- 3、6 -->
					<div class="item_footer_box" v-if="item.State == 3">
						<div class="reassignment" @click.stop="update_order('拒绝', item)">申请重分配</div>
						<div class="contact_customers" @click.stop="call_phone(item.LinkMan.MobilePhone)">
							<image src="../static/icon/phone-full_black.png" mode=""></image>
							联系客户
						</div>
						<div class="edit" v-if="item.State == 3" @click.stop="update_order('我已送达-去拍照', item)">我已送达-去拍照</div>
					</div>
					<!--  -->
					<div class="item_footer_box" v-if="item.State == 6">
						<div class="refuse" @click.stop="update_order('下线', item)">下线</div>
						<div class="accept" @click.stop="update_order('继续上线', item)">继续上线</div>
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
			// tab 切换
			tabs: [
				{
					name: '全部',
					activation: true,
					count: 0
				},
				{
					name: '待分配',
					activation: false,
					count: 1
				},
				{
					name: '待接收',
					activation: false,
					count: 2
				},
				{
					name: '待取送',
					activation: false,
					count: 3
				}
			],
			// 当前标签页下标
			tab_index: 0,
			// 标签页过滤规则
			filtering_rules: {
				0: [],
				1: [1],
				2: [2, 5],
				3: [3, 6, 7]
			},
			// -------------------------------------------
			//订单数据 备份
			orders_back: [],
			//订单数据 展示
			orders: []
		};
	},
	onLoad() {},
	onShow() {
		this.start();
	},
	created() {},
	onReachBottom() {
		console.log('123456');
		// this.pageNum += 1;
		// this.init();
	},
	methods: {
		// 打电话
		call_phone(Mobile) {
			console.log(Mobile);
			// 综合正则表达式，适用于移动电话和固定电话
			const phoneRegex = /^(\+?86)?(0\d{2,3}-)?1[3-9]\d{9}$|^(0\d{2,3}-)?\d{7,8}$/;
			if (!phoneRegex.test(Mobile)) {
				uni.showToast({
					title: '电话格式不正确',
					duration: 2000,
					icon: 'error'
				});
				return;
			}

			uni.makePhoneCall({
				phoneNumber: Mobile //仅为示例
			});
		},
		//
		update_order(type, item) {
			if (type == '分配') {
				uni.navigateTo({
					url: `/pages/select_driver?data=` + encodeURIComponent(JSON.stringify(item))
				});
			}

			if (type == '接受' || type == '拒绝') {
				this.apix('CarRental/UpdateCarSOOrderStateB', { ID: item.ID, str: type == '接受' ? 1 : 0 }, { method: 'post' }).then((rv) => {
					this.hint('已' + type + '！');
					this.start('静默刷新');
				});
			}

			if (type == '我已送达-去拍照') {
				uni.navigateTo({
					url: `/pages/upload_image?data=` + encodeURIComponent(JSON.stringify(item))
				});
			}
		},

		// 字体颜色
		edit_color(item) {
			const colorMap = {
				1: '#df8316',
				2: '#e54337',
				3: '#df8316',
				5: '#e54337',
				6: '#df8316',
				7: '#df8316'
			};

			return colorMap[item.State] || '#948b8b';
		},
		// tab 任务数量计算
		tab_count(index) {
			// 按照当前订单的状态符不符合当前标签包含的状态计算
			return this.orders_back.filter((item) => this.filtering_rules[index].includes(item.State)).length;
		},
		// tab切换同时切换orders
		tab_click(index) {
			// 记录当前页面下标
			this.tab_index = index;
			// 切换显示下标
			this.tabs.forEach((rv, count) => {
				rv.activation = count == index;
			});
			// 获取当前标签的规则
			const rules = this.filtering_rules[index];
			// 计算可以展示的数据
			this.orders = rules.length ? this.orders_back.filter((item) => rules.includes(item.State)) : this.orders_back;
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
			let data = await this.apix(
				'https://eolink.o.apispace.com/5345645/lives_geo/v001/xianxing',
				{
					days: '15',
					areacode: '101010100'
				},
				{
					headers: {
						'X-APISpace-Token': 'hcdlax0fnmvp2zjap1ci6ttfz4caq9fx'
					}
				}
			);
			console.log(data);
		},
		start(str) {
			let data = { pageNum: 1, numPerPage: 999, orderField: '', orderDirection: '', search: '', area: '', cusName: '', plate: '', waitDo: -1, state: -1, Id: '', cusId: '' };
			this.apix('CarRental/GetCarSOOrders', data).then((rv) => {
				console.log(rv);
				// 收集数据备份
				this.orders_back = rv.Data.Dtos;
				// 优化时间展示结构
				this.orders_back.forEach((rv) => {
					rv.web_time = this.date_conversion(rv.TargetDate) + ' ' + (rv.Direction == '送车' ? '送车上门' : '上门取车');
				});
				// 获取展示数据
				this.orders = this.orders_back;

				// 刷新后保持标签页
				// 获取当前标签的规则
				const rules = this.filtering_rules[this.tab_index];
				// 计算可以展示的数据
				this.orders = rules.length ? this.orders_back.filter((item) => rules.includes(item.State)) : this.orders_back;
				// 提示刷新成功
				if (str == '刷新')
					uni.showToast({
						title: '刷新成功!',
						icon: 'none'
					});
			});
		},
		// 日期转换
		date_conversion(dateStr) {
			const now = new Date();
			const targetDate = new Date(dateStr);
			const diffInMs = now - targetDate;
			const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

			let dayPart = '';
			let timePart = '';

			if (diffInDays === 0) {
				dayPart = '今天';
			} else if (diffInDays === 1) {
				dayPart = '昨天';
			} else if (diffInDays === 2) {
				dayPart = '前天';
			} else if (diffInDays > 2) {
				dayPart = `${diffInDays}天前`;
			} else {
				// 如果日期是未来的
				if (diffInDays < 0) {
					if (diffInDays === -1) {
						dayPart = '明天';
					} else if (diffInDays === -2) {
						dayPart = '后天';
					} else {
						dayPart = `${-diffInDays}天后`;
					}
				}
			}

			// 获取月份和日期部分
			const month = targetDate.getMonth() + 1; // getMonth() 返回的月份是从0开始的
			const day = targetDate.getDate();

			// 格式化时间
			const hours = targetDate.getHours();
			const minutes = targetDate.getMinutes().toString().padStart(2, '0');
			timePart = `${hours > 11 ? hours - 12 : hours}:${minutes}`;

			// 组合日期和时间字符串
			return `${month}月${day}日 ${dayPart} ${timePart}`;
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	width: 100%;
	height: 100%;
	color: #181c26;
	background-color: #f5f6fa;

	.no_orders {
		width: 100%;
		height: 100%;
		height: calc(100% - 172px - var(--status-bar-height));
		display: flex;
		justify-content: center;
		align-items: center;
		image {
			width: 150px;
		}
	}

	.index_content {
		width: 100%;
		min-height: 10px;
		height: calc(100% - 172px - var(--status-bar-height));
		// var(--status-bar-height);
		overflow: auto;
		.order_item {
			width: calc(100% - 20px);
			min-height: 100px;
			margin: 10px auto;
			border-radius: 8px;
			background-color: #ffffff;
			padding: 12px 0px;
			box-sizing: border-box;
			.item_header {
				width: 100%;
				height: 22px;
				padding: 0px 8px 0px 12px;
				box-sizing: border-box;
				.license_plate {
					display: inline-block;
					height: 100%;
					font-size: 14px;
					border: 1px solid #090f2029;
					box-sizing: border-box;
					line-height: 20px;
					background: linear-gradient(180deg, #f8f9fe 0%, #f5f8ff 100%);
					padding: 0 4px;
					border-radius: 2px;
				}
				.order_state {
					width: 50%;
					height: 100%;
					// background-color: #0050cc;
					float: right;
					span {
						float: right;
						font-size: 12px;
						line-height: 22px;
					}
					image {
						width: 16px;
						height: 16px;
						display: inline-block;
						float: right;
						// background-color: #09c;
						margin-top: 3px;
					}
				}
			}

			.item_delivery_information {
				width: 100%;
				height: 70px;
				margin-top: 10px;
				padding: 0px 6px 0px 12px;
				box-sizing: border-box;
				display: block;

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
						height: 26px;
						line-height: 26px;
						font-size: 20px;
						font-weight: bold;
						overflow: hidden;
					}
					.task_address {
						width: 100%;
						max-height: 44px;
						font-size: 14px;
						line-height: 22px;
						color: #181c26b2;
						overflow: hidden;
						word-break: break-all; /* break-all(允许在单词内换行。) */
						text-overflow: ellipsis; /* 超出部分省略号 */
						display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
						-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
						-webkit-line-clamp: 2; /** 显示的行数 **/
					}
				}
			}

			.item_footer_ {
				width: 100%;
				height: 40px;
				margin-top: 10px;
				padding: 0 12px;
				box-sizing: border-box;

				.item_footer_box {
					width: 100%;
					height: 100%;
					display: flex; /* 启用Flexbox布局 */
					justify-content: space-around;

					.button,
					.refuse,
					.accept,
					.reassignment,
					.contact_customers,
					.edit,
					.admin_see1 {
						height: 100%;
						border-radius: 6px;
						font-size: 16px;
						font-weight: bold;
						text-align: center;
						line-height: 40px;
					}

					.button {
						width: 100%;
						background: #4170fc;
						color: #ffffff;
					}

					// 管理员查看
					.admin_see1 {
						width: 100%;
						background: #f5f6fa;
						display: flex; /* 启用Flexbox布局 */
						justify-content: center;
						align-items: center;
						image {
							width: 18px;
							height: 18px;
							margin-right: 4px;
						}
					}

					.refuse {
						width: 18%;
						margin: auto;
						background: #e543371a;
						color: #e54337;
					}

					.accept {
						width: 80%;
						margin: auto;
						background: #4170fc;
						color: #ffffff;
					}

					.reassignment {
						width: 20%;
						margin: auto;
						font-size: 12px;
						color: #181c26b2;
					}

					.contact_customers {
						width: 30%;
						margin: auto;
						background: #f5f6fa;
						color: #181c26;
						display: flex; /* 启用Flexbox布局 */
						justify-content: center;
						align-items: center;
						image {
							width: 18px;
							height: 18px;
							margin-right: 4px;
						}
					}

					.edit {
						width: 40%;
						margin: auto;
						background: #4170fc;
						color: #ffffff;
					}
				}
			}
		}
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
		border-bottom: 0.5px solid #090f2014;
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
			color: #4170fc;
			font-weight: bold;

			.click {
				background-color: #4170fc;
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
			background: #f5f6fa;
			line-height: 16px;
			color: #181c26b2;
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
		background: #f1a22b1a;
		color: #df8316;
		font-size: 14px;
		line-height: 40px;
		padding-left: 20px;
		box-sizing: border-box;
		overflow: hidden;
	}
}
</style>
