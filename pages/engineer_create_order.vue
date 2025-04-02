<template>
	<view class="engineer_create_order">
		<!-- 导航栏 -->
		<u-navbar title="创建订单" :title-bold="true" title-color="#181C26" :is-back="false">
			<view class="right_icon">
				<image style="float: left" src="../static/icon/derection-left2.png" mode="" @click="custom_back()"></image>
				<image v-if="submit_order_state == '等待提交'" style="float: right" src="../static/icon/check.png" mode="" @click="submit_order()"></image>
				<image v-if="submit_order_state == '创建中'" style="float: right" src="../static/icon/refresh.png" mode="" class="rotate"></image>
			</view>
		</u-navbar>
		<!--  -->

		<div class="content">
			<!-- 客户 -->
			<div class="item">
				<div class="lable">客户</div>
				<div class="value">
					<u-input v-model="SubmitCarSOData.Customer" type="text" placeholder="客户" @input="retrieve_customers" :clearable='false' />
				</div>
			</div>

			<!-- 搜索到的相关客户 -->
			<div v-for="(item,index) in retrieve_customers_list" class="retrieve_customers_item" @click="select_customers(item)">{{item.FullName}}</div>

			<!-- 联系人 -->
			<div class="item">
				<div class="lable">联系人</div>
				<div class="value">
					<u-input v-model="SubmitCarSOData.LinkMan.ChineseName" type="text" placeholder="联系人" />
				</div>
			</div>

			<!-- 手机号 -->
			<div class="item">
				<div class="lable">手机号</div>
				<div class="value">
					<u-input v-model="SubmitCarSOData.LinkMan.MobilePhone" type="text" placeholder="手机号" />
				</div>
			</div>


			<!-- 车辆 -->
			<div class="item">
				<div class="lable">车辆</div>
				<div class="value">
					<p @click="choose_vehicle()" style="color: #2979ff;">
						<span v-if="SubmitCarSOData.Plate">{{SubmitCarSOData.Plate}}</span>
						<span v-else>点击选择车辆</span>
					</p>
				</div>
			</div>


			<!-- 时间 -->
			<div class="item">
				<div class="lable">开始时间</div>
				<div class="value">
					<p @click="choose_time1()" style="color: #2979ff;">
						<span v-if="SubmitCarSOData.RentalFrom">{{SubmitCarSOData.RentalFrom}}</span>
						<span v-else>点击选择时间</span>
					</p>
				</div>
			</div>

			<!-- 时间 -->
			<div class="item">
				<div class="lable">结束时间</div>
				<div class="value">
					<p @click="choose_time0()" style="color: #2979ff;">
						<span v-if="SubmitCarSOData.RentalTo">{{SubmitCarSOData.RentalTo}}</span>
						<span v-else>点击选择时间</span>
					</p>
				</div>
			</div>

			<!-- 时间 -->
			<div class="item" v-if="SubmitCarSOData.RentalHour">
				<div class="lable">租赁时长</div>
				<div class="value">
					<p style="color: #2979ff;">
						{{SubmitCarSOData.RentalHour}} 小时
					</p>
				</div>
			</div>



			<!-- 地址 -->
			<div class="item">
				<div class="lable">
					地址
				</div>
				<!-- 点击 -->
				<div class="value_textarea">
					<u-input v-model="SubmitCarSOData.PickUpThecarAddress" style="margin: 10px 0;" type='textarea' placeholder="地址" />
				</div>
			</div>

			<u-picker mode="selector" v-model="vehicle_show" :range="vehicle_collection" range-key="_name" @confirm='confirm'></u-picker>
			<u-picker mode="time" v-model="time_show1" :params="{year: true,month: true,day: true,hour: true}" @confirm='confirm_time1'></u-picker>
			<u-picker mode="time" v-model="time_show0" :params="{year: true,month: true,day: true,hour: true}" @confirm='confirm_time0'></u-picker>

		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 
				SubmitCarSOData: {
					CarRentalId: '', // 汽车ID
					Plate: '', // 车牌 前端展示
					Customer: '', // 客户名称 ，前端展示
					CusId: '', // 客户ID
					LinkMan: {
						// 联系人需要姓名与电话
						ChineseName: '',
						MobilePhone: ''
					},
					// PickUpTheCarcity: '', //取还车城市编号，
					// PickUpTheCarcityStr: '', //取还车城市名称，
					PickUpThecarAddress: '', //取还车地点
					RentalFrom: '', //租赁开始日期 精确到时
					RentalTo: '', //租赁结束日期 精确到时
					RentalHour: '', //租赁时长

					Free: true, // true 无偿租车 工程师主动派送使用
				},

				// 检索到的客户
				retrieve_customers_list: [],
				// 车辆信息
				vehicle_collection: [],
				vehicle_show: false,
				time_show1: false,
				time_show0: false,
				submit_order_state: '等待提交'
			};
		},
		created() {
			this.get_vehicle()
		},
		computed: {
			watch_time() {
				return {
					time1: this.SubmitCarSOData.RentalFrom,
					time2: this.SubmitCarSOData.RentalTo
				}
			}
		},
		watch: {
			watch_time(data) {
				if (data.time1 && data.time2) {
					console.log(data)
					// 转换为 Date 对象
					const date1 = new Date(data.time1.replace(" ", "T") + "Z"); // 转为 UTC 时间
					const date2 = new Date(data.time2.replace(" ", "T") + "Z");

					// 计算时间差（毫秒）
					const diffInMs = date2 - date1;

					// 转换为小时（1 小时 = 3600000 毫秒）
					const diffInHours = diffInMs / (1000 * 60 * 60);


					this.SubmitCarSOData.RentalHour = diffInHours
					console.log(diffInHours); // 输出：72（小时）
				}
			}
		},
		methods: {
			confirm_time1(row) {
				const formattedTime = `${row.year}-${row.month}-${row.day} ${row.hour}:00:00`;
				console.log(formattedTime)
				this.SubmitCarSOData.RentalFrom = formattedTime
			},
			confirm_time0(row) {
				const formattedTime = `${row.year}-${row.month}-${row.day} ${row.hour}:00:00`;
				console.log(formattedTime)
				this.SubmitCarSOData.RentalTo = formattedTime
			},
			// 
			confirm(row) {
				let vehicle = this.vehicle_collection[row[0]]
				console.log(vehicle)
				this.SubmitCarSOData.CarRentalId = vehicle.ID
				this.SubmitCarSOData.Plate = vehicle.CarType + ' - ' + vehicle.Plate
			},
			// 选择车辆
			choose_vehicle() {
				this.vehicle_show = true
			},
			// 选择时间
			choose_time1() {
				this.time_show1 = true
			},
			// 选择时间
			choose_time0() {
				this.time_show0 = true
			},
			// 获取车辆
			get_vehicle() {
				function convertToChineseDate(isoDateString) {
					const date = new Date(isoDateString);
					const today = new Date();
					today.setHours(0, 0, 0, 0); // 将今天的时间设置为0时0分0秒，以避免时区影响
					date.setHours(0, 0, 0, 0); // 将目标日期的时间设置为0时0分0秒，以避免时区影响

					const chineseDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

					// 计算目标日期与今天相差的天数
					const diffDays = (date - today) / (1000 * 60 * 60 * 24);

					if (diffDays === 0) {
						return `今天(${chineseDays[date.getDay()]})`;
					} else if (diffDays === 1) {
						return `明天(${chineseDays[date.getDay()]})`;
					} else if (diffDays === -1) {
						return `昨天(${chineseDays[date.getDay()]})`;
					} else if (diffDays === 2) {
						return `后天(${chineseDays[date.getDay()]})`;
					} else {
						// 格式化为"年-月-日"形式，并确保月份和日期有前导零
						const year = date.getFullYear();
						const month = date.getMonth() + 1;
						const day = date.getDate();
						return `${year}年${month < 10 ? '0' + month : month}月${day < 10 ? '0' + day : day}日`;
					}
				}


				var data = {
					pageNum: 1,
					numPerPage: 9999,
					orderField: '',
					orderDirection: '',
					plate: '', //车牌号
					cityEnable: '', // 可用城市
					currentCus: '', // 当前客户
					enable: true, //是否启用
					state: -1, // 状态
					includeReservedDt: true, //包含被预定日期
					id: '',
					pickupLocation: ''
				};
				this.apix('CarRental/GetCarRentals', data)
					.then((rv) => {
						//车辆信息
						console.log(rv.Data.Dtos)
						this.vehicle_collection = rv.Data.Dtos;
						this.vehicle_collection.forEach((rv) => {
							// 如果 rv.Image 有值，则拼接图片 URL，否则设置为 'null'
							rv.Image = rv.Image ? this.$store.state.api_header + rv.Image : 'null';

							// 如果 rv.Feature 有值，则解析 JSON 并用 '、' 连接，否则保持原值
							rv.Feature = rv.Feature ? JSON.parse(rv.Feature).join('、') : rv.Feature;

							// 优化后端返回的最早可用字段
							rv.EarliestDateOfUse_z = convertToChineseDate(rv.EarliestDateOfUse);

							rv._name = rv.CarType + ' - ' + rv.Plate
						});

						// 输出查看
						console.log(this.vehicle_collection);
					});
			},
			custom_back() {
				uni.navigateBack({
					url: './index'
				});
			},
			// 获取客户
			retrieve_customers(search) {
				if (!search) {
					this.retrieve_customers_list = []
					return false
				}
				this.apix('CRM/GetCustomerMini', { search })
					.then(rv => {
						console.log('搜索客户')
						this.retrieve_customers_list = rv.Data.Dtos
					})
			},
			// 选择客户
			select_customers(item) {
				console.log(item)
				this.SubmitCarSOData.Customer = item.FullName
				this.SubmitCarSOData.CusId = item.CusId
				this.retrieve_customers_list = []
				// 获取客户联系人
				this.apix('CRM/GetCusLinkManMini', { CusId: item.CusId })
					.then(rv => {
						let data = rv.Data.Dtos
						// 1. 尝试找 Default: true 的项
						const defaultItem = data.filter(item => item.Default)
						console.log(defaultItem)
						// 2. 有默认的就使用第一个默认，没有则使用第一个
						const result = defaultItem.length ? defaultItem[0] : data[0];

						console.log(result)
						this.SubmitCarSOData.LinkMan.ChineseName = result.Name
						this.SubmitCarSOData.LinkMan.MobilePhone = result.Mobile
						this.SubmitCarSOData.PickUpThecarAddress = result.Address
					})
			},
			// 
			// 提交订单
			submit_order() {
				console.log(this.SubmitCarSOData)

				const requiredFields = {
					Customer: '客户名称',
					CusId: '客户ID',
					CarRentalId: '车辆信息',
					Plate: '车牌',
					'LinkMan.ChineseName': '联系人姓名',
					'LinkMan.MobilePhone': '联系人电话',
					PickUpThecarAddress: '取还车地点',
					RentalFrom: '租赁开始日期',
					RentalTo: '租赁结束日期',
					RentalHour: '租赁时长'
				};

				for (const key in requiredFields) {
					const keys = key.split('.');
					let value = this.SubmitCarSOData;

					for (const k of keys) {
						value = value?.[k];
						if (!value) {
							uni.showToast({
								title: `请补充${requiredFields[key]}`,
								icon: 'none'
							});
							return false;
						}
					}
				}

				this.submit_order_state = '创建中'
				// 创建订单
				this.apix('CarRental/SubmitCarSO', this.SubmitCarSOData, { method: 'POST' })
					.then((rv) => {
						console.log(rv.Data);
						this.generate_a_quotation(rv.Data)
					})
					.finally(() => {
						this.submit_order_state = '等待提交'
					});
			},
			// 生成报价单
			generate_a_quotation(Id) {
				this.apix('CarRental/UpdateCarSOStateB', { Id }, { method: 'POST' })
					.then((rv) => {
						uni.showToast({
							title: `创建成功！`,
							icon: 'none'
						});
						setTimeout(() => {
							this.custom_back()
						}, 1000)
					})
					.finally(() => {
						this.submit_order_state = '等待提交'
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.rotate {
		animation: rotate-animation 1s linear infinite;
	}

	.engineer_create_order {
		width: 100%;
		height: 100%;
		color: #181c26;
		background-color: #f5f6fa;
		position: relative;

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


		.content {
			width: calc(100% - 20px);
			min-height: 10px;
			border-radius: 8px;
			margin: 10px auto;
			background: #ffffff;
			padding: 0px 15px 0px 15px;
			box-sizing: border-box;

			.item {
				width: 100%;
				min-height: 52px;
				display: flex;
				justify-content: start;

				.lable {
					width: 80px;
					height: 100%;
					line-height: 52px;
					font-size: 15px;
					font-weight: 400;

					.xing {
						color: #f04135;
					}
				}

				.value {
					width: calc(100% - 82px);
					height: 52px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
				}

				.value_textarea {
					width: calc(100% - 82px);
					min-height: 52px;
				}
			}

			.item::after {
				content: '';
				display: table;
				clear: both;
			}

			.item {
				border-top: 0.5px solid #090f2014;
			}


			.retrieve_customers_item {
				width: 100%;
				min-height: 10px;
				line-height: 20px;
				padding-left: 80px;
				box-sizing: border-box;
				margin-bottom: 10px;
				color: #909399;
			}
		}


	}
</style>