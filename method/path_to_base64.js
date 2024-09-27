export default function pathToBase64(path) {
	return new Promise(function(resolve, reject) {
		// 检查当前环境是否支持 window 对象
		if (typeof window === 'object' && 'document' in window) {
			// 如果支持 FileReader API
			if (typeof FileReader === 'function') {
				var xhr = new XMLHttpRequest(); // 创建 XMLHttpRequest 对象
				xhr.open('GET', path, true); // 发送 GET 请求
				xhr.responseType = 'blob'; // 设置响应类型为 Blob
				xhr.onload = function() {
					if (this.status === 200) {
						let fileReader = new FileReader(); // 创建 FileReader 对象
						fileReader.onload = function(e) {
							resolve(e.target.result); // 解析成功，返回 Base64 数据
						};
						fileReader.onerror = reject; // 处理读取错误
						fileReader.readAsDataURL(this.response); // 读取 Blob 为 Base64
					}
				};
				xhr.onerror = reject; // 请求错误处理
				xhr.send(); // 发送请求
				return;
			}

			// 创建 Canvas 元素以绘制图片
			var canvas = document.createElement('canvas');
			var c2x = canvas.getContext('2d');
			var img = new Image(); // 创建 Image 对象
			img.onload = function() {
				// 图片加载完成后绘制到 Canvas
				canvas.width = img.width;
				canvas.height = img.height;
				c2x.drawImage(img, 0, 0);
				resolve(canvas.toDataURL()); // 返回 Base64 数据
				canvas.height = canvas.width = 0; // 清理 Canvas
			};
			img.onerror = reject; // 图片加载错误处理
			img.src = path; // 设置图片源
			return;
		}

		// 针对 H5+ 环境处理
		if (typeof plus === 'object') {
			plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), function(entry) {
				entry.file(function(file) {
					var fileReader = new plus.io.FileReader(); // 创建 H5+ FileReader 对象
					fileReader.onload = function(data) {
						resolve(data.target.result); // 返回 Base64 数据
					};
					fileReader.onerror = function(error) {
						reject(error); // 处理读取错误
					};
					fileReader.readAsDataURL(file); // 读取文件为 Base64
				}, function(error) {
					reject(error); // 处理文件获取错误
				});
			}, function(error) {
				reject(error); // 处理文件系统解析错误
			});
			return;
		}

		// 针对微信小程序环境
		if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
			wx.getFileSystemManager().readFile({
				filePath: path,
				encoding: 'base64',
				success: function(res) {
					resolve('data:image/png;base64,' + res.data); // 返回 Base64 数据
				},
				fail: function(error) {
					reject(error); // 处理读取错误
				}
			});
			return;
		}

		// 如果不支持当前环境，返回错误
		reject(new Error('not support'));
	});
}




function getLocalFilePath(path) {
	// 定义支持的路径前缀
	const prefixes = ['_www', '_doc', '_documents', '_downloads', 'file://', '/storage/emulated/0/'];

	// 如果路径以指定的前缀开头，直接返回该路径
	if (prefixes.some(prefix => path.startsWith(prefix))) {
		return path;
	}

	// 如果路径以斜杠开头，表示是绝对路径
	if (path.startsWith('/')) {
		// 将绝对路径转换为本地文件系统路径
		const localFilePath = plus.io.convertAbsoluteFileSystem(path);
		// 如果转换后的路径不同于原路径，返回转换后的路径
		return localFilePath !== path ? localFilePath : '_www/' + path.slice(1);
	}

	// 对于其他情况，假设路径是相对路径，默认添加 '_www/' 前缀
	return '_www/' + path;
}