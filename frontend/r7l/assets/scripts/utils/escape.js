export function escapeHtml(str) {
	if (typeof str !== 'string') return str;
	return str.replace(/[&<>"'`=\/]/g, function (s) {
		return ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#39;',
			'`': '&#96;',
			'=': '&#61;',
			'/': '&#47;'
		})[s];
	});
}