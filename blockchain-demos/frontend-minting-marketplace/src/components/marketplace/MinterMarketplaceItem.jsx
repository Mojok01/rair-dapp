import { useSelector, useStore, Provider } from 'react-redux';
import BuyTokenModalContent from './BuyTokenModalContent.jsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import chainData from '../../utils/blockchainData';
const rSwal = withReactContent(Swal);

const MinterMarketplaceItem = ({item, index, colWidth}) => {

	const {primaryColor, secondaryColor, textColor} = useSelector(state => state.colorStore)
	const {programmaticProvider} = useSelector(state => state.contractStore);
	const store = useStore();

	return <div key={index} className={`col-${colWidth ? colWidth : 4} p-2`}>
		<div style={{
			border: `solid 1px ${textColor}`,
			backgroundImage: `url(${chainData[item?.blockchain]?.image})`,
			backgroundColor: `var(--${primaryColor}-transparent)`,
		}} className='w-100 p-3 bg-blockchain'>
			{item.productName}
			<br/>
			<small style={{fontSize: '0.7rem'}}>
				{item.contractAddress} 
			</small>
			<br/>
			<b>{item.offerName}</b>
			<br/>
			{item.range[1] - item.range[0] - item.soldCopies + 1} tokens up for sale <br/>
				for {item.price} {chainData[item.blockchain]?.chainId} wei <br/>
			<small>{/*item.totalCopies*/}</small>
			<br/>
			<button id={`button_${index}`} onClick={async e => {
				let onMyChain = window.ethereum ?
					chainData[item.blockchain]?.chainId === window.ethereum.chainId
					:
					chainData[item.blockchain]?.chainId === `0x${programmaticProvider.provider._network.chainId.toString(16)}`;
				if (!onMyChain) {
					if (window.ethereum) {
						await window.ethereum.request({
							method: 'wallet_switchEthereumChain',
							params: [{ chainId: chainData[item.blockchain]?.chainId }],
						});
					} else {
						// Code for suresh goes here
					}
				} else {
					rSwal.fire({
						html: <Provider store={store}>
							<BuyTokenModalContent
								blockchain={item.blockchain}
								price={item.price}
								start={item.range[0]}
								end={item.range[1]}
								offerName={item.offerName}
								offerIndex={item.offerPool}
								rangeIndex={item.offerIndex}
							/>
						</Provider>,
						showConfirmButton: false,
						width: '70vw',
						customClass: {
							popup: `bg-${primaryColor}`,
							htmlContainer: `text-${secondaryColor}`,
						}
					})
				}
			}} className='btn btn-royal-ice py-0'>
				{(window.ethereum ?
					chainData[item.blockchain]?.chainId === window.ethereum.chainId
					:
					chainData[item.blockchain]?.chainId === `0x${programmaticProvider.provider._network.chainId.toString(16)}`) ?
					<>Buy</> :
					<>Switch to <b>{chainData[item.blockchain]?.name}</b></>
				}
			</button>
		</div>
	</div>
}

export default MinterMarketplaceItem;