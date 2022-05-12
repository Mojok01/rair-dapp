//@ts-nocheck
import { useState, useEffect } from 'react';
import InputField from '../common/InputField';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import BatchRow from './BatchRow';
import {minterAbi} from '../../contracts';
// import { CSVReader } from 'react-papaparse'
import csvParser from '../../utils/csvParser';
import { metamaskCall } from '../../utils/metamaskUtils';
import {utils} from 'ethers';


const BuyTokenModalContent = ({blockchain, start, end, price, offerIndex, rangeIndex, offerName, minterAddress, diamonds, buyTokenFunction, buyTokenBatchFunction}) => {
	const [tokenIndex, setTokenIndex] = useState(start);
	const [rows, setRows] = useState([]);

	const [batchMode, setBatchMode] = useState(false);
	const [minterInstance, setMinterInstance] = useState();
	const [batchPage, setBatchPage] = useState(0);

	const {contractCreator} = useSelector(state => state.contractStore)

	const rowsLimit = 100;

	useEffect(() => {
		if (minterAddress) {
			setMinterInstance(contractCreator(minterAddress, minterAbi));
		}
	}, [minterAddress, contractCreator])

	const batchMint = async (data) => {
		let addresses = data.map(i => i['Public Address']);
		let tokens = data.map(i => i['NFTID']);
		if (
			await metamaskCall(
				minterInstance.buyTokenBatch(
					offerIndex,
					rangeIndex,
					tokens,
					addresses,
					{value: price * tokens.length})
			)
		) {
			Swal.close();
		}
	}

	const readCSVData = (data) => {
		if (!data) {
			return;
		}
		csvParser(data, setRows, ['Public Address', 'NFTID']);
		// Data to be read, Function to execute after parsing is done, specific columns to return (optional)
	}

	const addRow = () => {
		if (rows.length > end - start) {
			return;
		}
		let aux = [...rows];
		aux.push({
			'Public Address': '',
			'NFTID': aux.length ? Number(aux[aux.length - 1].token) + 1 : Number(start)
		})
		setRows(aux);
	}

	const deleteRow = (index) => {
		let aux = [...rows];
		aux.splice(index, 1);
		setRows(aux);
	}

	let paginatedRows = rows ? rows.slice(0 + (batchPage * 100), 100 + (batchPage * 100)) : [];

	return <>
		<div className='row w-100 px-0 mx-0'>
			<button
				className={`btn col-${batchMode ? '2' : '9'} btn-royal-ice`}
				style={{
					border: 'none',
					borderTopRightRadius: '0px',
					borderBottomRightRadius: '0px'}}
				onClick={e => setBatchMode(false)}>
				Buy one Token
			</button>
			<button
				className={`btn col btn-stimorol`}
				style={{
					border: 'none',
					borderTopLeftRadius: '0px',
					borderBottomLeftRadius: '0px'}}
				onClick={e => setBatchMode(true)}>
				Buy multiple tokens
			</button>
		</div>
		<hr />
		<div className='row px-0 mx-0 col-12'>
			{!batchMode ?
				<>
					<InputField
						label='Token Index'
						type='number'
						customClass='form-control'
						labelClass='w-100 text-start'
						getter={tokenIndex}
						setter={setTokenIndex}
						max={end}
						min={start}
					/>
					<div className='col-2' />
					<button disabled={!minterInstance} onClick={async e => {
						let result;
						if (diamonds) {
							result = await buyTokenFunction(
								offerIndex,
								tokenIndex,
								price
							)
						} else {
							result = await metamaskCall(
								minterInstance.buyToken(
									offerIndex,
									rangeIndex,
									tokenIndex,
									{value: price}
							))
						}
						if (result === true) {
							Swal.close();
						}
					}} className='btn btn-stimorol col-8'>
						Buy token #{tokenIndex} for {utils.formatEther(price)}
					</button>
					<div className='col-2' />
				</>
				:
				<>
					<button disabled className='btn col-12'>
						Offer: <b>{offerName}</b>
					</button>
					<button disabled={rows.length > end - start} onClick={addRow} className='col-2 btn btn-royal-ice'>
						Add <i className='fas fa-plus' />
					</button>
					<div className='col'>
						Total: {utils.formatEther(diamonds ? price.mul(rows.length) : (price * rows.length))}
					</div>
					<div className='col-12' style={{maxHeight: '50vh', overflowY: 'scroll'}}>
						{paginatedRows.map((item, index) => {
							return <BatchRow key={index} index={index + (rowsLimit * batchPage)} deleter={() => deleteRow(index)} array={rows}/>
						})}
					</div>
					{rows.length >= rowsLimit && <>
						<button disabled={batchPage === 0} onClick={() => setBatchPage(batchPage - 1)} className='btn col-12 col-md-3 btn-royal-ice'>
							<i className='fas fa-minus' />
						</button>
						<div className='col-12 col-md-6' >
							Page: {batchPage} of {Number.parseInt((rows.length - 2) / rowsLimit)}
						</div>
						<button disabled={batchPage + 1 >= ((rows.length - 2) / rowsLimit)} onClick={() => setBatchPage(batchPage + 1)} className='btn col-12 col-md-3 btn-royal-ice'>
							<i className='fas fa-plus' />
						</button>
					</>}
					<div className='col-12'>
      					<InputField
							customClass='py-0 form-control mb-2'
							labelClass='mt-2'
							id='csv_import'
							type='file'
							setter={readCSVData}
							setterField={['files', 0]}
							label='Or load addresses with CSV file'
						/>
					</div>
					<button onClick={e => {
						if (diamonds) {
							buyTokenBatchFunction(
								offerIndex,
								paginatedRows.map(item => item['NFTID']),
								paginatedRows.map(item => item['Public Address']),
								price
							)
						} else {
							batchMint(paginatedRows)
						}
					}} disabled={!minterInstance || !paginatedRows.length} className='col btn btn-stimorol'>
						Batch Mint {paginatedRows.length} tokens!
					</button>
				</>
			}
		</div>
	</>
}

export default BuyTokenModalContent;