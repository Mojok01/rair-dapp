import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as contractTypes from '../../ducks/contracts/types.js';
import * as ethers from 'ethers'
import Swal from 'sweetalert2';

const binanceTestnetData = {
	chainId: '0x61',
	chainName: 'Binance Testnet',
	nativeCurrency:
	{
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18
	},
	rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
	blockExplorerUrls: ['https://testnet.bscscan.com']
}

const klaytnBaobabData = {
	chainId: '0x3e9',
	chainName: 'Klaytn Baobab',
	nativeCurrency:
	{
		name: 'KLAY',
		symbol: 'KLAY',
		decimals: 18
	},
	rpcUrls: ['https://api.baobab.klaytn.net:8651/'],
	blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
}

const polygonMumbaiData = {
	chainId: '0x13881',
	chainName: 'Matic Testnet Mumbai',
	nativeCurrency:
	{
		name: 'Matic token',
		symbol: 'tMATIC',
		decimals: 18
	},
	rpcUrls: ['https://rpc-mumbai.matic.today'],
	blockExplorerUrls: ['https://matic.network/']
}

const blockchains = [
	{chainData: binanceTestnetData, bootstrapColor: 'warning'},
	{chainData: klaytnBaobabData, bootstrapColor: 'light'},
	{chainData: {chainId: '0x3', chainName: 'Ropsten (Ethereum)'}, bootstrapColor: 'primary'},
	{chainData: {chainId: '0x5', chainName: 'Goerli (Ethereum)'}, bootstrapColor: 'secondary'},
	{chainData: polygonMumbaiData, bootstrapColor: 'danger'}
]

const BlockChainSwitcher = () => {
	
	const [UNSAFE_PrivateKey, setUNSAFE_PrivateKey] = useState('');

	const {currentChain} = useSelector(state => state.contractStore);
	const dispatch = useDispatch();

	const connectProgrammatically = async ({rpcUrls, chainId, chainName, nativeCurrency}) => {
		try {
			let provider = new ethers.providers.JsonRpcProvider(rpcUrls[0], {
				chainId: Number(chainId), symbol: nativeCurrency.symbol, name: chainName, timeout: 1000000
			});
			let currentWallet = await new ethers.Wallet(UNSAFE_PrivateKey, provider);
			await dispatch({
				type: contractTypes.SET_PROGRAMMATIC_PROVIDER,
				payload: currentWallet
			});
			dispatch({
				type: contractTypes.SET_CHAIN_ID,
				payload: chainId
			});
		} catch (err) {
			console.log(err);
			Swal.fire('Error', err, 'error');
		}
	}

	const switchEthereumChain = async (chainData) => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainData.chainId }],
			});
		} catch (switchError) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [chainData],
					});
				} catch (addError) {
					console.error(addError);
				}
			} else {
				console.error(switchError);
			}
		}
	}
	
	return <>
		{!window.ethereum && <div className='row py-5 w-100 px-0 mx-0'>
			<hr className='w-100' />
			<h5 className='col-12'> For tests only! </h5>
			<div className='col-1' />
			<input
				className='col-10 text-center'
				type='password'
				value={UNSAFE_PrivateKey}
				onChange={e => setUNSAFE_PrivateKey(e.target.value)}
			/>
			<div className='col-1' />
			<div className='col-12 text-center'>
				Use my private key to connect to
			</div>
			<div className='col-12'>
				{blockchains.map((item, index) => {
					if (!item.chainData.rpcUrls) {
						return <></>
					}
					return <button
						key={index}
						className={`btn btn-${item.bootstrapColor}`}
						disabled={currentChain === item.chainData.chainId?.toLowerCase() || UNSAFE_PrivateKey.length !== 64}
						onClick={async e => {
							await connectProgrammatically(item.chainData);
						}}>
						{item.chainData.chainName}
					</button>
				})}
			</div>
			<hr className='w-100' />
		</div>}
		{window.ethereum && blockchains.map((item, index) => {
			return <button
				key={index}
				className={`btn btn-${item.bootstrapColor}`}
				disabled={currentChain === item.chainData.chainId?.toLowerCase()}
				onClick={async e => {
					await switchEthereumChain(item.chainData);
					dispatch({
						type: contractTypes.SET_CHAIN_ID,
						payload: undefined
					});
				}}>
				{item.chainData.chainName}
			</button>
		})}
	</>
}

export default BlockChainSwitcher;