export async function apiReq(obj, endpoint, params) {
	var param_str = '';
	var login_req = '';
	if (params != null) {
		const keys = Object.keys(params);
		if (keys.length > 0) {
			param_str = '?';
			for (var i = 0; i <= keys.length - 1; i++) {
				if (i == (keys.length - 1)) {
					param_str += `${keys[i]}=${params[keys[i]]}`;
				}
				else {
					param_str += `${keys[i]}=${params[keys[i]]}&`;
				}
			}
		}
	}

	try {
		login_req = await obj.$axios.$get(`http://localhost:4000/${endpoint}${param_str}`);
	}
	catch(error) {
		login_req = error.response.data;
	}
	return login_req;
}

export async function tokenAuth(obj) {
	var tokenReq = await apiReq(obj, 'verify_token');
	try {
		var refresh_token = tokenReq.refresh_token.access_token;
	}
	catch {
		var refresh_token = null;
	}
	if (tokenReq.status == 'ok') {
		return { status: true, refresh_token: refresh_token }
	}
	if (tokenReq.status == 'error') {
		return { status: false, refresh_token: refresh_token }
	}
}