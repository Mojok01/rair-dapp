import {useState, useEffect, useCallback} from 'react'
import * as ethers from 'ethers'

import Swal from 'sweetalert2';

const ERC777Manager = ({instance, account}) => {

	const [erc777Data, setERC777Data] = useState();
	const [targetAddress, setTargetAddress] = useState('');
	const [targetValue, setTargetValue] = useState(0);

	const refreshData = async () => {
		setERC777Data({
			balance: (await instance.balanceOf(account)).toString(),
			name: await instance.name(),
			symbol: await instance.symbol(),
		});
	};

	useEffect(() => {
		refreshData();
	}, [])

	return <div className='col bg-dark py-4 text-white border border-white rounded' style={{position: 'relative'}}>
		<h5> ERC777 </h5>
		<small>({instance.address})</small>
		<button
			style={{position: 'absolute', left: 0, top: 0}}
			onClick={refreshData}
			className='btn btn-dark'>
			<i className='fas fa-redo' />
		</button>
		<br />
		{erc777Data ? <>
			<br/>
			Your balance on the '{erc777Data.name}' Token: {erc777Data.balance} {erc777Data.symbol} <br/>
			<hr className='w-100' />
			Transfer Tokens<br/>
			Transfer to Address: <input className='form-control w-75 mx-auto' value={targetAddress} onChange={e => setTargetAddress(e.target.value)} />
			Amount to Transfer: <input className='form-control w-75 mx-auto' value={targetValue} type='number' onChange={e => setTargetValue(e.target.value)} />
			<br/>
			<button disabled={targetValue <= 0 || targetAddress === ''} onClick={() => {
				instance.send(targetAddress, targetValue, ethers.utils.toUtf8Bytes(''))
			}} className='btn btn-success'>
				Transfer {targetValue} TEST RAIRs to {targetAddress}!
			</button>
			<hr className='w-100'/>
			<button className='btn btn-light' onClick={e => {
				window.ethereum.request({
					method: 'metamask_watchAsset',
					params: {
						"type":"ERC20", // Initially only supports ERC20, but eventually more!
						"options":{
							"address": instance.address, // The address that the token is at.
							"symbol": erc777Data.symbol, // A ticker symbol or shorthand, up to 5 chars.
							"decimals": 18, // The number of decimals in the token
						},
					}})
				.then(boolean => Swal.fire(boolean ? 'ERC777 RAIR Token added' : 'Failed to Add ERC777 RAIR Token'))
			}}>
				Track {erc777Data.name} Token on Metamask!
			</button>
		</> : 'Fetching info...'}
	</div>
}

export default ERC777Manager;