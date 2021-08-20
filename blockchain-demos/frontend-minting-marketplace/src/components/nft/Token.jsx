import {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useParams} from "react-router-dom";

import Swal from 'sweetalert2'

import * as ethers from 'ethers'

import * as ERC721Token from '../../contracts/RAIR_ERC721.json';
const erc721Abi = ERC721Token.default.abi;

const MyNFTs = props => {
	const params = useParams();

	const aux = useSelector(state => state.accessStore);

	const [metadata, setMetadata] = useState({name: 'Loading...'});
	const [owner, setOwner] = useState('');

	const getData = async () => {
		try {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			let signer = provider.getSigner(0);
			let instance = new ethers.Contract(params.contract, erc721Abi, signer);
			setOwner(await instance.ownerOf(params.identifier));
			setMetadata(await (await fetch(await instance.tokenURI(params.identifier))).json());
		} catch (err) {
			Swal.fire('Error', "Something's wrong with the token's Metadata", 'error');
		}
	}

	useEffect(() => {
		getData();
	}, []);

	return <div className='col-12 row px-0 mx-0'>
		<div className='col-6'>
			<img className='w-100 h-auto' src={metadata.image} />
		</div>
		<div className='col-6'>
			<hr />
			<small> {params.contract}:{params.identifier} </small><br/>
			<h1 className='w-100' style={{textShadow: '5px 0 20px white, -5px 0 20px white', color: 'black'}}> {metadata.name} </h1>
			<small> Owned by: {owner} </small><br/>
			<hr className='mb-5' />
			<small> {metadata.description} </small><br/>
			<h5 className='w-100 mt-5'>
				Attributes
			</h5>
			<div className='col-12 row px-0 mx-0'>
				{metadata.attributes && metadata.attributes.map((item, index) => {
					return <div className='col-4 my-2'> 
						<div key={index}
								style={{
									backgroundColor: '#77FA',
									borderRadius: '10px',
									border: 'solid blue 1px',
									height: '5vh'
								}}
								className='w-100 h-100 py-auto'>
							{item.trait_type}: <b>{item.value}</b>
						</div>
					</div>
				})}
			</div>
		</div>
	</div>
}

export default MyNFTs;