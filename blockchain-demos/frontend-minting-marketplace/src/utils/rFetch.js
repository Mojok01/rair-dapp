import Swal from 'sweetalert2';
import * as ethers from 'ethers';

const signIn = async (provider) => {
	let currentUser = provider?.address;
	if (window.ethereum) {
		let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		currentUser = accounts[0];
	}
	if (!currentUser) {
		console.error('No address');
		return;
	}
	/*
	// Check if user exists in DB
	if (!success || !user) {
		// If the user doesn't exist, send a request to register him using a TEMP adminNFT
		console.log('Address is not registered!');
		const userCreation = await fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify({ publicAddress: currentUser, adminNFT: 'temp' }),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		})
		console.log('User Created', userCreation);
	//	setUserData(userCreation);
	} else {
	//	setUserData(user);
	}

	// Admin rights validation
	let adminRights = adminAccess;
	if (adminAccess === undefined) {
		const { response } = await (await fetch(`/api/auth/get_challenge/${currentUser}`)).json();
		const ethResponse = await window.ethereum.request({
			method: 'eth_signTypedData_v4',
			params: [currentUser, response],
			from: currentUser
		});
		const adminResponse = await (await fetch(`/api/auth/admin/${ JSON.parse(response).message.challenge }/${ ethResponse }/`)).json();
		setAdminAccess(adminResponse.success);
		adminRights = adminResponse.success;
	}
	*/

	const {success, user} = await (await fetch(`/api/users/${currentUser}`)).json();
	if (!success) {
		return;
	}
	if (!localStorage.token) {
		let signer = provider;
		if (window.ethereum) {
			let ethProvider = new ethers.providers.Web3Provider(window.ethereum);
			signer = ethProvider.getSigner();
		}
		let token = await getJWT(signer, user, currentUser);
		if (token) {
			console.log('Set token');
			localStorage.setItem('token', token);
			return true;
		}
	}
	return false;
}

const getJWT = async (signer, userData, userAddress) => {
	const msg = `Sign in for RAIR by nonce: ${ userData.nonce }`;
	let signature = await (signer.signMessage(msg, userAddress));
	const { token } = await (await fetch('/api/auth/authentication', {
		method: 'POST',
		body: JSON.stringify({ publicAddress: userAddress.toLowerCase(), signature, adminRights: true }),
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
		).json();
	return token;
}

const rFetch = async (route, options, retryOptions = undefined) => {
	let request = await fetch(route, {
		headers: {
			...options?.headers,
			'X-rair-token': `${localStorage.getItem('token')}`
		},
		...options
	});
	try {
		let parsing = await request.json()
		if (!parsing.success) {
			if (parsing.message === 'jwt malformed' && (window.ethereum || retryOptions?.provider)) {
				localStorage.removeItem('token');
				let retry = await signIn(retryOptions?.provider);
				if (retry) {
					return rFetch(route, options);
				}
			}
			Swal.fire('Error',parsing?.message,'error');
		}
		return parsing;
	} catch (err) {
		console.error(request, err);
	}
	return request;
}

export {rFetch, signIn, getJWT};