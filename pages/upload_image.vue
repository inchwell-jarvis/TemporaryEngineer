<template>
	<view class="upload_image">
		<u-navbar title="上传图片" :title-bold="true" title-color="#181C26" :is-back="false">
			<view class="right_icon">
				<image style="float: left" src="../static/icon/derection-left2.png" mode="" @click="custom_back()"></image>
			</view>
		</u-navbar>

		<!-- 提示 -->
		<div class="tips">
			<u-icon name="info-circle"></u-icon>
			上传照片并让用户确认照片才能完成送车任务
		</div>
		<!-- 上传阶段 -->
		<div class="upload_phase">
			<div v-for="(item, index) in upload_image_group" :key="index" :class="{ upload_phase_item: true, upload_phase_item_bool: upload_tags == index }" @click="tab_upload_tags(item, index)">
				<div class="upload_phase_item_box">
					<p class="p1">{{ item.name }}</p>
					<p class="p2" v-if="!item.upload_completed">
						<span>·</span>
						未完成
					</p>
					<p class="p2 p3" v-else>
						<span>·</span>
						已完成
					</p>
				</div>
				<div class="triangle"></div>
			</div>
		</div>
		<!-- 上传图片 -->
		<div class="upload_process">
			<!-- 提示 -->
			<div class="title">
				<p class="p1">
					现场拍照
					<span>*</span>
				</p>
				<p class="p2">请务必按照示例里面的图片上传相关角度照片</p>
			</div>
			<!-- 图片部分 -->
			<div class="image_section">
				<div class="image_section_item" v-for="(item, index) in upload_image_group[upload_tags].images" :key="index">
					<!-- 未上传 -->
					<div class="not_uploaded" v-if="!item.upload_image" @click="befor_upload_image(item, index)">
						<!-- 缩略图 不过缩略图也得有图片才展示 -->
						<u-image width="100%" height="78px" mode="aspectFit" :src="item.teaching_diagram" v-if="item.teaching_diagram" :fade="false"></u-image>
						<!-- 遮罩 -->
						<div class="mask"></div>
						<!-- 示例号 -->
						<div class="example">示例{{ index + 1 }}</div>
						<!-- 拍照图标与提示词 -->
						<div class="tips_photograph_icon">
							<!-- 相机icon -->
							<div class="photograph_icon">
								<image src="../static/icon/camara.png" alt="" />
							</div>
							<!-- 拍照上传提示词 -->
							<div class="tips_text">拍照上传</div>
						</div>
					</div>

					<!-- 已上传 -->
					<div class="already_uploaded" v-else @click="view_picture(item.upload_image)">
						<!-- 图片 -->
						<u-image width="100%" height="78px" :src="item.upload_image" :fade="false"></u-image>
						<!-- 重新上传 -->
						<div class="re_upload" @click.stop="befor_upload_image(item, index)">重新上传</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部确认按钮 -->
		<div class="foolter_but">
			<!-- 下一步 -->
			<div class="next_step" v-if="upload_tags != 2" :style="{ background: upload_image_group[upload_tags].upload_completed ? '#4170FC' : '#4170fc52' }" @click="tab_upload_tags({}, upload_tags + 1)">下一步</div>
			<div class="next_step" v-else :style="{ background: upload_image_group[upload_tags].upload_completed ? '#4170FC' : '#4170fc52' }" @click="upload_completed()">确认</div>
		</div>

		<!-- 弹出层 -->
		<u-popup v-model="upload_image_popup" mode="bottom" border-radius="30" :closeable="true" :close-icon-color="'#181C26B2'">
			<view class="upload_image_box">
				<!-- header -->
				<div class="upload_image_header">示例说明</div>
				<!--  -->
				<div class="image_example">
					<div class="image_example_view">
						<u-image width="100%" height="100%" mode="aspectFit" v-if="upload_image_image" :src="upload_image_image" :fade="false"></u-image>
					</div>
					<div class="prompt">
						<div class="prompt_item">
							<u-image class="image" width="22px" height="22px" mode="aspectFit" src="../static/icon/selected-full2.png" :fade="false"></u-image>
							图片要清晰
						</div>
						<div class="prompt_item">
							<u-image class="image" width="22px" height="22px" mode="aspectFit" src="../static/icon/selected-full2.png" :fade="false"></u-image>
							请按照示例角度拍摄车辆照片
						</div>
					</div>
				</div>
				<!--  -->
				<div class="but_view">
					<div class="but" @click="upload_image()">拍照上传</div>
				</div>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			upload_tags: 0, // 当前是第几个tab
			upload_image_popup: false, // 是否打开上传图片弹窗
			upload_image_image: '', // 是否打开上传图片示例
			upload_image_index: 0, // 当前上传图片的坐标
			upload_image_group: [
				{
					name: '车辆图片',
					upload_completed: false,
					images: [
						//	teaching_diagram 教学图
						// upload_image 工程师上传的图片
						{ teaching_diagram: require('../static/teaching_diagram/1-1-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/1-2-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/1-3-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/1-4-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/1-5-example.png'), upload_image: '' }
					]
				},
				{
					name: '工具箱图片',
					upload_completed: false,
					images: [
						{ teaching_diagram: require('../static/teaching_diagram/2-1-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/2-2-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/2-3-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/2-4-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/2-5-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/2-6-example.png'), upload_image: '' }
					]
				},
				{
					name: '其他工具图片',
					upload_completed: false,
					images: [
						{ teaching_diagram: require('../static/teaching_diagram/3-1-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-2-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-3-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-4-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-5-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-6-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-7-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-8-example.png'), upload_image: '' },
						{ teaching_diagram: require('../static/teaching_diagram/3-9-example.png'), upload_image: '' }
					]
				}
			]
		};
	},
	onLoad(option) {
		let data = JSON.parse(decodeURIComponent(option.data));
		this.user_data = data;
		this.start();
	},
	created() {},
	watch: {},
	methods: {
		// 上传完毕
		upload_completed() {
			this.apix('CarRental/CompleteCarSOOrderImage', { Id: this.user_data.CarSOId }, { method: 'post' }).then((rv) => {
				uni.showToast({
					title: '上传成功，等待客户审核!',
					icon: 'none'
				});
				uni.navigateBack({
					url: './index'
				});
			});
		},
		// custom_back
		custom_back() {
			uni.navigateBack({
				url: './index'
			});
		},
		// 开始
		start() {
			let data = { pageNum: 1, numPerPage: 999, orderField: '', orderDirection: '', search: '', area: '', cusName: '', plate: '', waitDo: -1, state: -1, Id: this.user_data.ID, cusId: '' };
			this.apix('CarRental/GetCarSOOrders', data).then((rv) => {
				// 收集数据备份
				this.data = rv.Data.Dtos[0];
				console.log('订单照片数据');
				console.log(this.data);
				// 分析已上传的图片
				this.data.CarRentalRecordFiles.forEach((rv) => {
					if (rv.Type && rv.DetailName) {
						let index = ['车辆图片', '工具图片', '其它文件'].indexOf(rv.Type);
						console.log('第' + index + '组,第' + Number(rv.DetailName));
						this.upload_image_group[index].images[Number(rv.DetailName)].upload_image = this.$store.state.api_header + '/File/CarRental/CarSO/' + rv.FileName;
					}
				});
				// 判断三项的图片是否上传完成了
				this.upload_image_group.forEach((rv, index) => {
					rv.upload_completed = rv.images.every((item) => item.upload_image !== undefined && item.upload_image !== null && item.upload_image !== '');
					if (rv.upload_completed) this.upload_tags = index == 2 ? index : index + 1;
				});
				//
				console.log(this.upload_image_group);
			});
		},
		// 预览图片
		view_picture(url) {
			uni.previewImage({
				urls: [url], // (这里放图片的数组，也就是放所有图片的集合)
				current: url, // (这里官方说了可以放当前点击的图片路径也可以放当前图片的索引)
				// 下面我这边做的都是默认的选择
				longPressActions: {
					// itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function (data) {},
					fail: function (err) {}
				}
			});
		},
		// 切换上传图片
		// 判断index>当前坐标说明是向往后走 这时再判断当前模块是否上传完成了

		tab_upload_tags(item, index) {
			// 判断是否往前跳转，往前跳转不需要判断
			if (index < this.upload_tags) {
				this.upload_tags = index;
				return;
			}

			// 判断当前模块是否完成上传
			if (index === 1 && this.upload_image_group[0].upload_completed) {
				this.upload_tags = index;
			} else if (index === 2 && this.upload_image_group[0].upload_completed && this.upload_image_group[1].upload_completed) {
				this.upload_tags = index;
			} else {
				uni.showToast({
					title: '请依次完成任务!',
					icon: 'none'
				});
			}
			// 如果需要，可以在这里添加 else 或其它逻辑处理未完成的情况
		},

		//
		befor_upload_image(item, index) {
			// 标记当前上传的图片属于哪个类目
			this.upload_image_index = index;
			this.upload_image_image = item.teaching_diagram;
			// 打开上传图片实例
			this.upload_image_popup = true;
			// 开发临时上传
			// this.upload_image();
		},
		// 上传图片
		async upload_image() {
			// 关闭弹窗
			this.upload_image_popup = false;

			// 必须先获得结果才能解构
			const result = await uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['camera']
			});

			// 解构出错误信息和结果
			const [err, res] = result;

			// 如果存在错误信息 则表示失败
			if (err) return false;

			// 压缩base64编码 默认压缩到300KB以下
			const base64 = await this.compress_base64(res.tempFilePaths[0]);

			// 开始上传
			let data = {
				Id: this.user_data.ID,
				FileStr: base64,
				// FileName: '',
				Type: String(this.upload_tags + 1), // 当前上传的是属于哪个类目的 Type[1车辆图片、2工具图片、3其它文件]
				Other: this.upload_image_index // 当前上传的属于类目的第几个文件
			};
			this.apix('CarRental/UploadCarSOOrderImage', data, { method: 'post' }).then((rv) => {
				this.hint('上传成功！');
				this.start();
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.upload_image {
	width: 100%;
	height: 100%;
	background-color: #f5f6fa;
	.upload_image_box {
		width: 100%;
		min-height: 100px;
		.upload_image_header {
			width: 100%;
			height: 52px;
			border: 1px solid #ccc;
			box-sizing: border-box;
			font-size: 18px;
			font-weight: bold;
			line-height: 52px;
			text-align: center;
		}
		.image_example {
			width: 100%;
			height: 300px;
			border-radius: 4px;
			padding: 12px;
			box-sizing: border-box;
			.image_example_view {
				width: 100%;
				height: 212px;
				background: #f5f6fa;
				border-radius: 4px;
			}
			.prompt {
				width: 100%;
				height: 52px;
				margin-top: 12px;

				.prompt_item {
					width: 100%;
					height: 22px;
					margin-top: 4px;
					// border: 1px solid #ccc;
					box-sizing: border-box;
					font-size: 15px;
					line-height: 22px;
					font-weight: bold;
					.image {
						float: left;
						margin-right: 4px;
					}
				}
			}
		}
		.but_view {
			width: 100%;
			height: 100px;
			background-color: #fff;
			padding: 12px;
			box-sizing: border-box;
			border-top: 1px solid #090f2014;
			.but {
				width: 100%;
				border-radius: 8px;
				height: 48px;
				background-color: #4170fc;
				text-align: center;
				line-height: 48px;
				font-size: 16px;
				color: #ffffff;
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

	.upload_phase {
		width: calc(100% - 20px);
		height: 55px;
		margin: 16px auto 10px;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12px;

		.upload_phase_item {
			height: 100%;
			position: relative;

			.upload_phase_item_box {
				width: 100%;
				height: 48px;
				background: #ffffff;
				border-radius: 4px;
				padding: 4px 12px;
				box-sizing: border-box;
				z-index: 99;
				position: absolute;
				.p1 {
					font-size: 14px;
					font-weight: bold;
					line-height: 22px;
					text-align: center;
					color: #181c26b2;
				}
				.p2 {
					font-family: PingFang SC;
					font-size: 12px;
					font-weight: 400;
					line-height: 18px;
					text-align: center;
					color: #181c2673;
					span {
						font-weight: bolder;
						color: #f1a22b;
					}
				}
				.p3 {
					span {
						font-weight: bolder;
						color: #35b250;
					}
				}
			}
			.triangle {
				width: 16px;
				height: 16px;
				border-radius: 2px;
				position: absolute;
				bottom: 2px;
				left: 0;
				right: 0;
				margin: auto;
				transform: rotate(45deg);
				z-index: 10;
			}
		}
		.upload_phase_item_bool {
			.upload_phase_item_box {
				background: #4170fc;
				.p1 {
					color: #ffffff;
				}
				.p2 {
					color: #ffffff;
				}
			}
			.triangle {
				background-color: #4170fc;
			}
		}
	}

	.upload_process {
		width: calc(100% - 20px);
		min-height: 55px;
		margin: auto;
		border-radius: 8px;
		background-color: #fff;
		padding: 12px;
		box-sizing: border-box;
		.title {
			width: 100%;
			height: 46px;
			.p1 {
				line-height: 26px;
				font-size: 18px;
				font-weight: bold;
				span {
					color: #e54337;
				}
			}

			.p2 {
				line-height: 20px;
				font-size: 12px;
				color: #181c26b2;
			}

			.p3 {
				span {
					font-weight: bolder;
					color: #35b250;
				}
			}
		}
		.image_section {
			width: 100%;
			margin-top: 12px;
			/* flex布局 两端对齐 */
			/* grid布局 两端对齐,最后一行左对齐*/
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 12px;
			.image_section_item {
				// width: 105px;
				height: 78px;
				//
				.not_uploaded {
					width: 100%;
					height: 100%;
					border-radius: 4px;
					position: relative;
					overflow: hidden;

					.mask {
						width: 100%;
						height: 100%;
						background: #00000073;
						position: absolute;
						z-index: 10;
						left: 0;
						top: 0;
					}

					.example {
						width: 33px;
						height: 16px;
						background-color: #4170fc;
						position: absolute;
						top: 0;
						left: 0;
						border-radius: 4px 0 4px 0;
						line-height: 16px;
						text-align: center;
						color: #ffffff;
						font-size: 11px;
						z-index: 20;
					}
					.tips_photograph_icon {
						width: 48px;
						height: 48px;
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						margin: auto;
						z-index: 20;
						.photograph_icon {
							width: 24px;
							height: 24px;
							margin: auto;
							image {
								width: 100%;
								height: 100%;
							}
						}
						.tips_text {
							width: 100%;
							height: 20px;
							margin-top: 4px;
							line-height: 20px;
							color: #ffffff;
							font-size: 12px;
							text-align: center;
						}
					}
				}
				// 已上传
				.already_uploaded {
					width: 100%;
					height: 100%;
					border-radius: 4px;
					position: relative;
					overflow: hidden;
					background: rgba(240, 241, 245, 1);

					.re_upload {
						position: absolute;
						width: 100%;
						height: 24px;
						background: #00000073;
						bottom: 0;
						left: 0;
						color: #ffffff;
						line-height: 24px;
						font-size: 12px;
						text-align: center;
					}
				}
			}
		}
	}

	.foolter_but {
		width: 100%;
		height: 84px;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		border-top: 1px solid #090f2014;
		padding: 12px;
		box-sizing: border-box;
		.next_step {
			width: 100%;
			height: 40px;
			background: #4170fc52;
			color: #ffffff;
			font-size: 16px;
			font-weight: bold;
			line-height: 40px;
			text-align: center;
			border-radius: 6px;
		}
	}
}
</style>
