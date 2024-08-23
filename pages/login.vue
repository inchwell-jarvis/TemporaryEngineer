<template>
	<view class="login">
		<!--  -->
		<div class="header">
			<div class="logo">
				<div class="inchwell">
					<image src="../static/icon/logo.png" alt="" />
				</div>
				<div class="text">
					<p>欢迎登录</p>
					<p>
						英之杰天祥
						<span>租车派单系统</span>
					</p>
				</div>
			</div>
			<div class="img">
				<image src="../static/icon/paishou.png" alt="" />
			</div>
		</div>

		<!--  -->
		<div class="content">
			<!-- 输入姓名 -->
			<div class="input" :style="{ border: name_error ? '1px solid #E54337' : '' }">
				<input class="mobile_number" type="text" v-model="name" placeholder="请输入姓名" name="" id="" />
				<div class="eliminate" v-if="name" @click="name = ''">
					<image src="../static/icon/close-full.png" alt="" />
				</div>
			</div>
			<!-- 输入框报错 -->
			<div class="mobile_number_error" :style="{ height: name_error ? '20px' : '0px' }">{{ name_error_text }}</div>

			<!-- 输入手机号 -->
			<div class="input" :style="{ border: mobile_number_error ? '1px solid #E54337' : '' }">
				<input class="mobile_number" type="text" v-model="mobile_number" placeholder="请输入手机号" name="" id="" />
				<div class="eliminate" v-if="mobile_number" @click="mobile_number = ''">
					<image src="../static/icon/close-full.png" alt="" />
				</div>
			</div>
			<!-- 输入框报错 -->
			<div class="mobile_number_error" :style="{ height: mobile_number_error ? '20px' : '0px' }">{{ mobile_number_error_text }}</div>

			<!-- 获取验证码按钮 -->
			<div class="send" :style="{ background: mobile_number ? '#4170FC' : '#4170FC52' }" @click="get_verification_code()">获取验证码</div>
			<!-- 模拟区域经理登录 -->
			<div class="send" :style="{ background: mobile_number ? '#4170FC' : '#4170FC52' }" @click="simulation_area_manager()">区域经理</div>

			<!-- 协议 -->
			<div class="protocol" @click="is_agree = !is_agree">
				<!-- left icon -->
				<div class="left_icon">
					<div class="left_icon_yuan" v-if="!is_agree"></div>
					<div class="left_icon_yuan2" v-else>
						<image src="../static/icon/Subtract.png" alt="" />
					</div>
				</div>
				<!-- text -->
				<div class="right_text">
					我已阅读并同意
					<span>《英之杰天祥服务协议》</span>
					、
					<span>《英之杰天祥隐私权政策》</span>
				</div>
			</div>
		</div>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 输入名字 以及错误提示
			name: '赵鸿飞',
			name_error: false,
			name_error_text: '',

			// 输入手机号 以及错误提示
			mobile_number: '17856222886',
			mobile_number_error: false,
			mobile_number_error_text: '',

			// 是否同意协议
			is_agree: false
		};
	},
	created() {},
	mounted() {},
	watch: {
		mobile_number() {
			// 触发输入即收起错误提示
			this.mobile_number_error = false;
		},
		name() {
			// 触发输入即收起错误提示
			this.name_error = false;
		}
	},
	methods: {
		// 模拟区域经理登录
		simulation_area_manager() {
			// 存储信息
			uni.setStorageSync('token', '23f1ff20628549c585b5d59955020a46');
			uni.setStorageSync('name', '管理员');
			uni.setStorageSync('mobile', '18888888888');
			uni.navigateTo({
				url: `/pages/index`
			});
		},

		// 获取验证码
		get_verification_code() {
			// 判断姓名是否为空
			if (!this.name) {
				this.name_error = true;
				this.name_error_text = '请输入姓名';
			}
			// 判断手机号是否为空
			if (!this.mobile_number) {
				this.mobile_number_error = true;
				this.mobile_number_error_text = '请输入手机号';
			}
			// 判断手机号是否正确
			else if (!/^1[3456789]\d{9}$/.test(this.mobile_number)) {
				this.mobile_number_error = true;
				this.mobile_number_error_text = '手机号格式不正确';
			}
			// 判断是否同意协议
			else if (!this.is_agree) {
				this.$refs.uToast.show({ title: '请同意协议' });
			}
			// 发送验证码
			else {
				this.apix('Account/GetVerificationCode', { str: this.mobile_number }, { method: 'post' })
					.then((rv) => {
						console.log(rv);
						// 前往输入验证码页面

						let data = {
							name: this.name,
							mobile: this.mobile_number
						};
						uni.navigateTo({
							url: `/pages/verification?data=` + encodeURIComponent(JSON.stringify(data))
						});
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.login {
	width: 100%;
	height: 100%;
	background: #bacbfe;
	position: relative;
	background-image: url('../static/icon/bg_chahua.png');
	background-repeat: no-repeat;
	background-size: 70%;
	background-position: right top;
	.header {
		width: 100%;
		height: 180px;
		padding: 40px 0px 0 20px;
		box-sizing: border-box;

		.logo {
			width: 200px;
			height: 130px;
			float: left;
			/* border: 1px solid #fff; */
			box-sizing: border-box;
			.inchwell {
				width: 100%;
				height: 44px;
				image {
					width: 44px;
					height: 44px;
				}
			}

			.text {
				width: 100%;
				height: 64px;
				/* border: 1px solid #fff; */
				box-sizing: border-box;
				margin-top: 22px;
				line-height: 32px;
				font-size: 20px;
				font-weight: bold;
				span {
					font-size: 14px;
					color: #fff;
					font-weight: normal;
					background: #4170fc;
					padding: 2px 4px;
					border-radius: 4px;
					margin-left: 4px;
				}
			}
		}

		.img {
			width: 128px;
			height: 132px;
			float: right;
			/* border: 1px solid #fff; */
			box-sizing: border-box;
			margin-top: 8px;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	/* 输入 */
	.content {
		width: 100%;
		height: calc(100% - 180px);
		background: #ffffff;
		border-radius: 16px 16px 0 0;
		box-sizing: border-box;
		padding: 32px 24px;
	}

	.content .input {
		width: 100%;
		height: 48px;
		border-radius: 8px;
		background: #f5f6fa;
		font-size: 16px;
		box-sizing: border-box;
		border: 1px solid #090f2029;
		padding-right: 48px;
		position: relative;
		margin-bottom: 8px;
	}
	.content .input input {
		width: 100%;
		height: 48px;
		background: #ffffff00;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		padding: 12px 16px;
		box-sizing: border-box;
		/* 去除input选中样式 */
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		outline: none;
	}
	.content .input .eliminate {
		width: 48px;
		height: 48px;
		position: absolute;
		right: 0;
		top: 0;
		padding: 12px;
		box-sizing: border-box;
		/* background: #000; */
	}
	.content .input .eliminate image {
		width: 100%;
		height: 100%;
	}

	.content .mobile_number_error {
		width: 100%;
		height: 0px;
		overflow: hidden;
		font-size: 14px;
		color: #e54337;
		line-height: 20px;
		transition: all 0.3s;
	}

	.content .send {
		width: 100%;
		height: 48px;
		border-radius: 8px;
		font-size: 16px;
		box-sizing: border-box;
		color: #ffffff;
		text-align: center;
		line-height: 48px;
		transition: all 0.3s;
		margin-bottom: 16px;
		margin-top: 8px;
	}

	.content .protocol {
		width: 100%;
		min-height: 20px;
	}
	.content .protocol .left_icon {
		width: 20px;
		height: 100%;
		float: left;
		/* border: 1px solid #000; */
		box-sizing: border-box;
		padding-top: 3px;
	}
	.content .protocol .left_icon .left_icon_yuan {
		width: 12px;
		height: 12px;
		border: 1px solid #090f2029;
		border-radius: 50%;
		box-sizing: border-box;
	}

	.content .protocol .left_icon .left_icon_yuan2 {
		width: 12px;
		height: 12px;
		box-sizing: border-box;
	}
	.content .protocol .left_icon .left_icon_yuan2 image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.content .protocol .right_text {
		width: calc(100% - 20px);
		height: 100%;
		float: left;
		font-size: 12px;
		color: #969fa3;
		line-height: 20px;
	}
	.content .protocol .right_text span {
		color: #4170fc;
	}
}
</style>
