<template>
	<view class="edit_">
		<!-- 导航栏 -->
		<u-navbar :background="{ background: backgroundColor }" title="任务详情" :back-icon-color="back_titleColor" :title-color="titleColor" :border-bottom="false"></u-navbar>

		<div class="h1">{{ data.StateStr2 }}</div>
		<!-- 车信息 -->
		<div class="vehicle_information">
			<div class="left_text">
				<div class="p1">{{ data.Plate }}</div>
				<div class="p2">
					<div class="car">{{ data.CarType }}</div>
					<span>{{ data.Feature }}</span>
				</div>
			</div>
			<div class="images">
				<u-image v-if="data.Image != 'null'" mode="widthFix" :src="data.Image" :show-loading="false" :fade="false"></u-image>
				<span v-else>未上传</span>
			</div>
		</div>
		<!-- 送车信息 -->
		<div class="time_and_location">
			<div class="left_icon left_icon_song" v-if="data.Direction == '送车'">送车</div>
			<div class="left_icon left_icon_qu" v-if="data.Direction == '取车'">取车</div>
			<div class="delivery_information">
				<p class="delivery_information_h1">{{ data.web_time }}</p>
				<p class="delivery_information_p1">{{ data.TargetAddress }}</p>
			</div>
		</div>
		<!-- 联系人 -->
		<div class="link_man">
			<div class="link_man_1">
				<image src="../static/icon/seller-full.png" mode=""></image>
				<span>联系人</span>
			</div>
			<div class="link_man_2">
				<div class="icon" @tap.stop="contact_customers()">
					<div class="phone"><u-icon name="phone-fill" color="#181C26"></u-icon></div>
				</div>
				<div class="man" v-if="data.LinkMan">
					<div class="man_name">
						{{ data.LinkMan.ChineseName }}
						<span class="link_kehu">客户</span>
					</div>
					<p>{{ data.LinkMan.MobilePhone }}</p>
				</div>
			</div>
			<div class="link_man_2">
				<div class="icon" @tap.stop="contact_customers()">
					<div class="phone"><u-icon name="phone-fill" color="#181C26"></u-icon></div>
				</div>
				<div class="man" v-if="data.LinkMan">
					<div class="man_name">
						{{ data.QuYuManager.ChineseName }}
						<span class="link_gcs">区域经理</span>
					</div>
					<p>{{ data.QuYuManager.MobilePhone }}</p>
				</div>
			</div>
			<div class="link_man_2">
				<div class="icon" @tap.stop="contact_customers()">
					<div class="phone"><u-icon name="phone-fill" color="#181C26"></u-icon></div>
				</div>
				<div class="man" v-if="data.LinkMan">
					<div class="man_name">
						{{ data.EngineerInfo.ChineseName }}
						<span class="link_gcs">司机</span>
					</div>
					<p>{{ data.EngineerInfo.MobilePhone }}</p>
				</div>
			</div>
		</div>
		<!-- 任务详情 -->
		<div class="order_information">
			<div class="title">
				<image src="../static/icon/order-full.png" mode=""></image>
				<span>任务详情</span>
			</div>

			<div class="order_information_item">
				<span>订单号</span>
				<span class="info">{{ data.OrderCode }}</span>
			</div>

			<div class="order_information_item">
				<span>订单类型</span>
				<span class="info">{{ data.Direction }}</span>
			</div>

			<div class="order_information_item" style="margin-bottom: 10px">
				<span>订单状态</span>
				<span class="info">{{ data.StateStr2 }}</span>
			</div>

			<u-time-line>
				<u-time-line-item v-for="(item, index) in data.SystemLog" :key="index" v-if="item">
					<template v-slot:content>
						<p>{{ item.split(' ')[0] + ' ' + item.split(' ')[1] }}</p>
						<p>{{ item.split(' ')[2] + ' ' + item.split(' ')[3] }}</p>
					</template>
				</u-time-line-item>
			</u-time-line>
		</div>

		<!-- 任务详情 -->
		<div class="order_information">
			<div class="title">
				<image src="../static/icon/order-full.png" mode=""></image>
				<span>订单详情</span>
			</div>

			<div class="order_information_item">
				<span>下单时间</span>
				<span class="info">{{ data.CreateDate }}</span>
			</div>

			<div class="order_information_item">
				<span>支付时间</span>
				<span class="info">支付时间</span>
			</div>

			<div class="order_information_item" style="margin-bottom: 10px">
				<span>支付方式</span>
				<span class="info">对公支付</span>
			</div>
		</div>

		<!--  -->
		<div class="operation_area" v-if="data.State != 4 && data.State != 9">
			<!-- 分配 -->
			<div class="but" v-if="data.State == 1">
				<div class="button" @tap.stop="update_order('分配')">分配</div>
			</div>
			<!-- 接受 / 拒绝 -->
			<div class="but" v-if="data.State == 2 || data.State == 5">
				<div class="refuse" @tap.stop="(reallocate_pop_ups2 = true), (reallocate_pop_data2 = data)">拒绝</div>
				<div class="accept" @tap.stop="operation_task(data, 1)">接受</div>
			</div>
			<!-- 送车 / 取车 -->
			<div class="but" v-if="data.State == 3 || data.State == 10 || data.State == 11">
				<div class="reassignment" @tap.stop="reallocate_pop_ups_fun(data)">申请重分配</div>
				<div class="contact_customers" @tap.stop="contact_customers()">
					<u-icon name="phone-fill" color="#181c26" size="28"></u-icon>
					联系客户
				</div>
				<div class="edit" v-if="data.State == 3" @click.stop="update_order('我已送达-去拍照')">我已送达-去拍照</div>
				<div class="edit" v-if="data.State == 10" style="background: #4170fc52">等待客户确认图片</div>
				<div class="edit" v-if="data.State == 11" @click.stop="update_order('输入取车码')">输入取车码</div>
			</div>
			<!-- 归位 -->
			<div class="but" v-if="data.State == 7">
				<div class="button" @tap.stop="the_car_has_returned(data)">车已归位</div>
			</div>
		</div>

		<!-- 取车码弹窗 -->
		<u-popup v-model="show" mode="bottom" border-radius="20">
			<view class="popclass">
				<div class="popclass_head">
					<div class="popclass_head_img">
						<u-image width="55px" height="55px" src="../static/icon/key_picture.png"></u-image>
					</div>
					<div class="popclass_head_h1">
						请输入
						<span>取车码</span>
					</div>
					<div class="popclass_head_h2">需要客户出示取车码才能够将车辆交接给客户</div>
				</div>
				<div class="popclass_number">
					<u-message-input mode="box" @change="input_y_change" v-model="input_y"></u-message-input>
				</div>
				<div class="popclass_but">
					<div class="popclass_buttton">
						<div class="edit_quxiao" @tap="show = false">取消</div>
						<div class="edit_queren" @tap="confirm_password()">确认</div>
					</div>
				</div>
			</view>
		</u-popup>

		<u-popup v-model="show2" mode="center" width="500rpx" height="150px" border-radius="20">
			<view class="return_the_car">
				<p class="p1">取车成功</p>
				<p class="p2">请将车辆开往指定的办事处，或者送到下一个客户的预定送车地点。</p>
				<div class="but" @tap="show2 = false">我知道了</div>
			</view>
		</u-popup>

		<u-popup v-model="reallocate_pop_ups" mode="center" width="500rpx" height="150px" border-radius="20">
			<view class="return_the_car">
				<p class="p1">申请重分配</p>
				<p class="p2">您确定要申请重分配 {{ reallocate_pop_data.web_time }} 任务吗？</p>
				<div class="but2">
					<div class="but2_1" @tap.stop="reallocate_pop_ups = false">再想想</div>
					<div class="but2_1" @tap.stop="operation_task(data, 0)">确定</div>
				</div>
			</view>
		</u-popup>

		<u-popup v-model="reallocate_pop_ups2" mode="center" width="500rpx" height="150px" border-radius="20">
			<view class="return_the_car">
				<p class="p1">申请重分配</p>
				<p class="p2">您确定要拒绝 {{ reallocate_pop_data2.web_time }} 任务吗？</p>
				<div class="but2">
					<div class="but2_1" @tap.stop="reallocate_pop_ups2 = false">再想想</div>
					<div class="but2_1" @tap.stop="operation_task(reallocate_pop_data2, 0)">确定</div>
				</div>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			backgroundColor: '#00000000',
			titleColor: '#00000000',
			back_titleColor: '#ffffff',
			Id: '',
			data: {},
			show: false, // 送车验证码弹窗
			show_item: {}, // 送车信息
			input_y: '',
			show2: false,
			reallocate_pop_ups: false, // 确认重新分配弹窗
			reallocate_pop_data: {},
			reallocate_pop_ups2: false, // 确认拒绝分配弹窗
			reallocate_pop_data2: {}
		};
	},
	onLoad(option) {
		let data = JSON.parse(decodeURIComponent(option.data));
		this.Id = data.ID;
		this.start();
	},
	onPageScroll(res) {
		// 假设我们有一个最大滚动值，比如页面高度的某个百分比或固定值
		const maxScroll = 200; // 你可以根据实际需要调整这个值
		// 计算当前滚动位置占最大滚动位置的比例
		const scrollRatio = res.scrollTop / maxScroll;
		// 透明度的范围是 0（完全透明）到 1（完全不透明）
		const alpha = Math.min(scrollRatio, 1);

		// 计算白色到黑色的过渡
		const colorValue = Math.floor(255 * (1 - scrollRatio));

		// 构造 RGBA 颜色字符串
		this.backgroundColor = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
		this.titleColor = `rgba(0, 0, 0, ${alpha.toFixed(2)})`;
		this.back_titleColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
	},
	onShow() {
		if (this.Id) {
			this.start();
		}
	},
	methods: {
		update_order(type) {
			console.log(type);
			let item = this.data;
			if (type == '分配') {
				uni.navigateTo({
					url: `/pages/select_driver?data=` + encodeURIComponent(JSON.stringify(item))
				});
			}
			//
			if (type == '我已送达-去拍照') {
				uni.navigateTo({
					url: `/pages/upload_image?data=` + encodeURIComponent(JSON.stringify(item))
				});
			}

			if (type == '输入取车码') {
				this.show = true;
				this.show_item = item;
			}
		},
		// 联系客户
		contact_customers() {
			// 综合正则表达式，适用于移动电话和固定电话
			const phoneRegex = /^(\+?86)?(0\d{2,3}-)?1[3-9]\d{9}$|^(0\d{2,3}-)?\d{7,8}$/;
			if (!phoneRegex.test(this.data.LinkMan.MobilePhone)) {
				uni.showToast({
					title: '电话格式不正确',
					duration: 2000,
					icon: 'error'
				});
				return;
			}

			uni.makePhoneCall({
				phoneNumber: this.data.LinkMan.MobilePhone //仅为示例
			});
		},
		// 重新分配弹窗
		reallocate_pop_ups_fun(data) {
			this.reallocate_pop_data = data;
			this.reallocate_pop_ups = true;
		},

		// 接收或拒绝任务
		operation_task(item, num) {
			this.apix('CarRental/UpdateCarSOOrderStateB', { id: item.ID, str: num }, { method: 'post' }).then((rv) => {
				this.reallocate_pop_ups = false;
				this.reallocate_pop_ups2 = false;
				uni.showToast({
					title: num ? '已接受' : '已拒绝',
					duration: 2000,
					icon: num ? 'success' : 'error'
				});
				uni.navigateTo({
					url: './index'
				});
			});
		},

		// 归位
		the_car_has_returned(item) {
			this.apix('CarRental/UpdateCarSOOrderStateE', { ID: item.ID }, { method: 'post' }).then((rv) => {
				uni.showToast({
					title: '归位成功',
					duration: 2000,
					icon: 'success'
				});
				uni.navigateTo({
					url: './index'
				});
			});
		},

		input_y_change(e) {
			this.input_y = e;
		},
		// 确认取车码
		confirm_password() {
			this.apix('CarRental/UpdateCarSOOrderStateC', { ID: this.show_item.ID, str: this.input_y }, { method: 'post' }).then((rv) => {
				uni.showToast({
					title: '送车成功',
					duration: 2000,
					icon: 'success'
				});
				this.show = false;
				uni.navigateTo({
					url: './index'
				});
			});
		},
		//
		start() {
			let data = { pageNum: 1, numPerPage: 999, orderField: '', orderDirection: '', search: '', area: '', cusName: '', plate: '', waitDo: -1, state: -1, Id: this.Id, cusId: '' };
			this.apix('CarRental/GetCarSOOrders', data).then((rv) => {
				this.data = rv.Data.Dtos[0];
				// 完善图片地址
				this.data.Image = this.$store.state.api_header + this.data.Image;
				// 联系人与电话
				this.data.LinkManStr = this.data.LinkMan.ChineseName + ' ' + this.data.LinkMan.MobilePhone;
				// 联系人与电话
				this.data.CreateDate = this.data.CreateDate.substring(0, this.data.CreateDate.indexOf('.')).replace('T', ' ');
				// 车辆特征
				if (this.data.Feature) {
					this.data.Feature = JSON.parse(this.data.Feature).join('、');
				}
				// rihi1
				if (this.data.SystemLog) {
					this.data.SystemLog = this.data.SystemLog.substring(1).split('@');
				} else {
					this.data.SystemLog = [];
				}

				this.data['web_time'] = this.date_conversion(this.data.TargetDate) + ' ' + (this.data.Direction == '送车' ? '送车上门' : '上门取车');

				console.log('订单数据');
				console.log(this.data);
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
.edit_ {
	width: 100%;
	padding-bottom: 100px;
	background-image: url('../static/icon/blue_background.png');
	background-repeat: no-repeat;
	background-size: 100% 172px; /* 或者具体的尺寸，如 '100px 100px' */
	box-sizing: border-box;
	overflow: auto;

	.h1 {
		width: 100%;
		height: 32px;
		font-size: 28px;
		font-weight: bold;
		line-height: 32px;
		text-align: left;
		margin: 15px 0;
		color: #ffffff;
		padding-left: 50rpx;
		box-sizing: border-box;
	}
	// 车辆信息
	.vehicle_information {
		width: calc(100% - 40rpx);
		min-height: 20px;
		background-color: #fff;
		border-radius: 8px;
		margin: 10px auto;
		padding: 12px 16px;
		box-sizing: border-box;
		display: flex; /* 启用Flex布局 */
		justify-content: space-between; /* 子元素两边分布 */

		//车部分
		.images {
			width: 72px;
			height: 54px;
			float: right;
		}

		.left_text {
			width: calc(100% - 60px);
			min-height: 54px;
			.p1 {
				width: 100%;
				height: 28px;
				font-size: 20px;
				font-weight: bold;
				margin-bottom: 5px;
			}
			.p2 {
				width: 100%;
				height: 20px;
				white-space: nowrap; /* 保持文本在一行显示 */
				overflow: hidden; /* 隐藏超出部分 */
				text-overflow: ellipsis; /* 超出部分显示省略号 */
				.car {
					min-width: 10rpx;
					height: 100%;
					background: #4170fc1a;
					color: #181c26;
					font-size: 11px;
					font-weight: 500;
					line-height: 18px;
					text-align: left;
					float: left;
					padding: 0 5px;
					box-sizing: border-box;
					border-radius: 2px;
					margin-right: 10px;
				}
				span {
					font-size: 13px;
					font-weight: 400;
					line-height: 18px;
					text-align: left;
					color: #181c26b2;
				}
			}
		}
		.left_icon {
			width: 32px;
			height: 20px;
			border-radius: 3px;
			color: #fff;
			text-align: center;
			line-height: 20px;
			font-size: 12px;
			margin-top: 4px;
		}
		.left_icon_song {
			background-color: #e54337;
		}
		.left_icon_qu {
			background-color: #4170fc;
		}

		.delivery_information {
			width: calc(100% - 40px);
			min-height: 100%;
			.delivery_information_h1 {
				width: 100%;
				height: 26px;
				line-height: 26px;
				font-size: 18px;
				font-weight: bold;
			}
			.delivery_information_p1 {
				line-height: 20px;
				font-size: 13px;
				color: #181c26b2;
			}
		}
	}

	.time_and_location {
		width: calc(100% - 40rpx);
		min-height: 20px;
		background-color: #fff;
		border-radius: 8px;
		margin: 10px auto;
		padding: 12px 16px;
		box-sizing: border-box;
		display: flex; /* 启用Flex布局 */
		justify-content: space-between; /* 子元素两边分布 */

		.left_icon {
			width: 32px;
			height: 20px;
			border-radius: 3px;
			color: #fff;
			text-align: center;
			line-height: 20px;
			font-size: 12px;
			margin-top: 4px;
		}
		.left_icon_song {
			background-color: #e54337;
		}
		.left_icon_qu {
			background-color: #4170fc;
		}

		.delivery_information {
			width: calc(100% - 40px);
			min-height: 100%;
			.delivery_information_h1 {
				width: 100%;
				height: 26px;
				line-height: 26px;
				font-size: 18px;
				font-weight: bold;
			}
			.delivery_information_p1 {
				line-height: 20px;
				font-size: 13px;
				color: #181c26b2;
			}
		}
	}

	.link_man {
		width: calc(100% - 40rpx);
		min-height: 20px;
		background-color: #fff;
		border-radius: 8px;
		margin: 10px auto;
		padding: 0 16px;
		box-sizing: border-box;
		.link_man_1 {
			width: 100%;
			height: 48px;
			border-bottom: 0.5px solid #090f2014;
			line-height: 48px;
			font-size: 16px;
			font-weight: bold;
			image {
				width: 20px;
				height: 20px;
				float: left;
				margin-top: 14px;
			}
			span {
				margin: 0 3px;
			}
		}
		.link_man_2 {
			width: 100%;
			height: 58px;
			padding: 8px 0;
			box-sizing: border-box;
			.icon {
				width: 30px;
				height: 100%;
				float: right;
				position: relative;
				.phone {
					width: 28px;
					height: 28px;
					background-color: #f5f6fa;
					border-radius: 4px;
					text-align: center;
					line-height: 28px;
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					margin: auto;
				}
			}
			.man {
				width: calc(100% - 30px);
				height: 100%;
				.man_name {
					width: 100%;
					height: 22px;
					line-height: 22px;
					font-size: 15px;
					font-weight: bold;
					.link_kehu {
						height: 18px;
						font-size: 10px;
						color: #ffffff;
						font-weight: normal;
						background: linear-gradient(114.95deg, #efb066 2.67%, #b56b16 83.89%);
						border-radius: 2px;
						padding: 0 4px;
						margin-left: 4px;
					}
					.link_gcs {
						height: 18px;
						font-size: 10px;
						color: #4170fc;
						font-weight: normal;
						background: #4170fc1a;
						border-radius: 2px;
						padding: 0 4px;
						margin-left: 4px;
					}
				}
				p {
					height: 20px;
					line-height: 20px;
					font-size: 13px;
					color: #181c26b2;
				}
			}
		}
	}

	.order_information {
		width: calc(100% - 40rpx);
		min-height: 20px;
		background-color: #fff;
		border-radius: 8px;
		margin: 10px auto;
		padding: 0 16px 5px;
		box-sizing: border-box;
		.title {
			width: 100%;
			height: 48px;
			border-bottom: 0.5px solid #090f2014;
			line-height: 48px;
			font-size: 16px;
			font-weight: bold;
			margin-bottom: 10px;
			image {
				width: 20px;
				height: 20px;
				float: left;
				margin-top: 14px;
			}
			span {
				margin: 0 3px;
			}
		}

		.order_information_item {
			width: 100%;
			height: 32px;
			font-size: 13px;
			font-weight: 400;
			line-height: 32px;
			text-align: left;
			color: #181c26b2;

			.info {
				display: block;
				float: right;
				text-align: right;
				color: #181c26;
			}
		}
	}

	.operation_area {
		width: 100%;
		height: 100px;
		position: fixed;
		left: 0;
		bottom: 0;
		background: #ffffff;
		border-top: 1px solid #ececee;
		padding: 20px 0 40px;
		box-sizing: border-box;
		z-index: 980;
		.but {
			width: 100%;
			height: 40px;
			padding: 0 10px;
			box-sizing: border-box;
			display: flex; /* 启用Flexbox布局 */
			justify-content: space-around;

			.button {
				width: 100%;
				height: 100%;
				background: #4170fc;
				border-radius: 6px;
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				line-height: 40px;
				color: #ffffff;
			}

			.refuse {
				width: 18%;
				height: 100%;
				margin: auto;
				background: #e543371a;
				border-radius: 6px;
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				line-height: 40px;
				color: #e54337;
			}

			.accept {
				width: 80%;
				height: 100%;
				margin: auto;
				background: #4170fc;
				border-radius: 6px;
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				line-height: 40px;
				color: #ffffff;
			}

			.reassignment {
				width: 20%;
				height: 100%;
				margin: auto;
				border-radius: 6px;
				font-size: 12px;
				text-align: center;
				line-height: 40px;
				color: #181c26b2;
			}
			.contact_customers {
				width: 30%;
				height: 100%;
				margin: auto;
				background: #f5f6fa;
				border-radius: 6px;
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				line-height: 40px;
				color: #181c26;
			}
			.edit {
				width: 40%;
				height: 100%;
				margin: auto;
				background: #4170fc;
				border-radius: 6px;
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				line-height: 40px;
				color: #ffffff;
			}
		}
	}

	.popclass {
		width: 100%;
		min-height: 10px;
		padding: 30px 20px 20px;
		box-sizing: border-box;
		.popclass_head {
			width: 100%;
			height: 120px;
			box-sizing: border-box;
			.popclass_head_img {
				width: 100%;
				height: 55px;
				display: flex;
				justify-content: center;
			}
			.popclass_head_h1 {
				width: 100%;
				height: 40px;
				line-height: 40px;
				font-size: 24px;
				color: #181c26;
				text-align: center;
				font-weight: bold;
				span {
					color: #e54337;
				}
			}
			.popclass_head_h2 {
				width: 100%;
				height: 20px;
				line-height: 20px;
				font-size: 14px;
				color: #181c26b2;
				text-align: center;
			}
		}
		.popclass_number {
			width: 100%;
			height: 80px;
			padding: 10px 0;
			box-sizing: border-box;
		}
		.popclass_but {
			width: 100%;
			height: 100px;
			padding: 30px 0px 20px;
			box-sizing: border-box;
			.popclass_buttton {
				width: 100%;
				height: 50px;
				box-sizing: border-box;
				display: flex; /* 启用Flexbox布局 */
				justify-content: space-around;
				.edit_quxiao {
					width: 20%;
					height: 100%;
					border-radius: 8px;
					background: #f5f6fa;
					text-align: center;
					line-height: 50px;
					font-size: 16px;
					font-weight: bold;
				}
				.edit_queren {
					width: 76%;
					height: 100%;
					border-radius: 8px;
					background: #4170fc;
					text-align: center;
					line-height: 50px;
					font-size: 16px;
					font-weight: bold;
					color: #ffffff;
				}
			}
		}
	}
	.return_the_car {
		width: 100%;
		height: 100%;
		padding: 15px;
		box-sizing: border-box;
		position: relative;
		.p1 {
			line-height: 26px;
			font-size: 18px;
			font-weight: bold;
			text-align: center;
		}
		.p2 {
			font-size: 13px;
			color: #181c26b2;
			line-height: 22px;
			text-align: center;
		}
		.but {
			width: calc(100% - 30px);
			height: 40px;
			border-radius: 8px;
			background-color: #2e7bfd;
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: bold;
			line-height: 40px;
			text-align: center;
			color: #ffffff;
			position: absolute;
			bottom: 15px;
			left: 15px;
			right: 15px;
		}

		.but2 {
			width: calc(100% - 30px);
			height: 40px;
			border-radius: 8px;
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: bold;
			line-height: 40px;
			text-align: center;
			color: #ffffff;
			position: absolute;
			bottom: 15px;
			left: 15px;
			right: 15px;
			display: flex; /* 启用flex布局 */
			justify-content: space-between; /* 子级元素平均分布，两端对齐 */

			.but2_1 {
				width: 44%;
				height: 100%;
				border-radius: 4px;
				background: #f5f6fa;
				color: #000;
				font-size: 14px;
				line-height: 40px;
				text-align: center;
			}
			.but2_1:nth-child(2) {
				background: #e543371a;
				color: #e54337;
			}
		}
	}
}
</style>
