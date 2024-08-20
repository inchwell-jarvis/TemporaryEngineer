<template>
	<view class="verification">
		<!--  -->
		<u-navbar back-text="" :background="{ backgroundColor: '#ffffff00' }"></u-navbar>
		<!--  -->
		<div class="verification_view">
			<div class="enter_verification_code">输入验证码</div>
			<div class="has_been_sent">验证码已发送至 {{ user_data.mobile }}</div>
			<div class="item">
				<u-message-input class="verification_code" mode="box" :value="verification_code_value" :v-model="verification_code" @finish="finish" width="100%" :focus="true"></u-message-input>
			</div>
			<div class="resend" v-if="time">
				<span>{{ time }}s</span>
				后重新发送
			</div>
			<div class="resend_button" v-else @click="resend_verification_code()">重新发送</div>
		</div>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 倒计时
			time: 0,
			// 验证码
			verification_code: '',
			// 验证码初始值
			verification_code_value: '',
			// 用户信息
			user_data: {}
		};
	},
	onLoad(option) {
		let data = JSON.parse(decodeURIComponent(option.data));
		this.user_data = data;
	},
	created() {
		this.start_time();
	},
	methods: {
		// 验证码输入完成
		finish(e) {
			this.verification_code = e;
			// 开始验证验证码
			this.apix('http://39.100.116.85:6001/api/' + 'Account/AddTemporaryWorker', { Mobile: this.user_data.mobile, VerificationCode: this.verification_code, Name: this.user_data.name }, { method: 'post' })
				.then((rv) => {
					console.log(rv);
					// 存储信息
					uni.setStorageSync('token', rv.Data);
					uni.setStorageSync('name', this.user_data.name);
					uni.setStorageSync('mobile', this.user_data.mobile);
					uni.navigateTo({
						url: `/pages/index`
					});
				})
				.catch((err) => {
					this.verification_code_value = '';
				});
		},
		// 开始倒计时
		start_time() {
			var that = this;
			that.time = 60;
			var timer = setInterval(function () {
				that.time--;
				if (that.time <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		},
		// 重新发送验证码
		resend_verification_code() {
			this.apix('http://39.100.116.85:6001/api/' + 'Account/GetVerificationCode', { str: this.user_data.mobile }, { method: 'post' }).then((rv) => {
				console.log(rv);
				uni.showToast({
					title: '已重新发送',
					icon: 'none'
				});
				this.start_time();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.verification {
	width: 100%;
	height: 100%;
	background: #ffffff;
	background-image: url('../static/icon/verification_bg.png');
	background-repeat: no-repeat;
	background-size: contain;

	.verification_view {
		width: 100%;
		height: 250px;
		/* border: 1px solid #ccc; */
		box-sizing: border-box;
		padding: 24px;
		.enter_verification_code {
			font-size: 24px;
			font-weight: 600;
			line-height: 32px;
			text-align: left;
		}
		.has_been_sent {
			font-size: 14px;
			font-weight: 400;
			line-height: 22px;
			text-align: left;
			color: #181c26b2;
			margin-bottom: 30px;
		}
		.item {
			width: 100%;
			height: 80px;
			box-sizing: border-box;
			margin-bottom: 10px;
			// display: flex;
			// justify-content: center;
			// justify-content: space-between;
			.verification_code {
				width: 100%;
			}
		}
		.resend {
			line-height: 20px;
			font-size: 14px;
			color: #181c2673;
			span {
				color: #181c26;
			}
		}
		.resend_button {
			line-height: 20px;
			font-size: 14px;
			color: #4170fc;
		}
	}
}
</style>