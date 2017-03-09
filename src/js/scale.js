/*!
 * scale.js
 * 用于处理等比缩放，原理是利用rem单位的相对性
 * 标准宽度（1920，即效果图宽度）时，html元素font-size为100px
 */
!function(global) {

	// 禁止被iframe
	if (global.top !== global.self) { global.top.location = global.location; }

	var doc = global.document;

	// 计算缩放比例（主要用于实现1px细线）
	var scale = 1 / global.devicePixelRatio;
	doc.write(
		'<meta name="viewport" content="width=device-width' +
		',initial-scale=' + scale +
		',minimum-scale=' + scale +
		',maximum-scale=' + scale +
		',user-scalable=no" />'
	);

	// 基于rem的等比缩放
	function resetFontSize() {
		var docElt = doc.documentElement;
		var width = docElt.clientWidth;
		docElt.style.fontSize = width / 1920 * 100 + 'px';
	}
	global.addEventListener('resize', resetFontSize, false);
	resetFontSize();
}(window);