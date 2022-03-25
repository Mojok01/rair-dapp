// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/Strings.sol";
import './AppStorage.sol';

/// @title  RAIR Metadata facet contract
/// @notice You can use this contract to administrate the metadata asociated to the Rair facet
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerable721
contract RAIRMetadataFacet is AccessControlAppStorageEnumerable721 {
	bytes32 public constant CREATOR = keccak256("CREATOR");
	using Strings for uint256;

<<<<<<< HEAD
	/// @notice This event stores in the blockchain when the base code of all the tokens has a valid change in its URI
    /// @param  newURI Contains the new  base identifier for all the tokens
	/// @param  appendTokenIndex Contains the index of the tokens appended to the URI
	event BaseURIChanged(string newURI, bool appendTokenIndex);
	/// @notice This event stores in the blockchain when a token has a change in its URI
	/// @param  tokenId Contains the index of the token appended to the URI
    /// @param  newURI Contains the new identifier for the token
	event TokenURIChanged(uint tokenId, string newURI);
	/// @notice This event stores in the blockchain when a product has a change in its URI
    /// @param  newURI Contains the new identifier for the product
	/// @param  appendTokenIndex Contains the index of the token appended to the URI
	event ProductURIChanged(uint productId, string newURI, bool appendTokenIndex);
	/// @notice This event stores in the blockchain when a contract has a change in its URI
    /// @param  newURI Contains the new identifier for the contract 
	event ContractURIChanged(string newURI);
=======
	event UpdatedBaseURI(string newURI, bool appendTokenIndex);
	event UpdatedTokenURI(uint tokenId, string newURI);
	event UpdatedProductURI(uint productId, string newURI, bool appendTokenIndex);
	event UpdatedContractURI(string newURI);
>>>>>>> remotes/origin/dev

	// For OpenSea's Freezing
	event PermanentURI(string _value, uint256 indexed _id);

	/// @notice This function allows us to check if the token exist or not
	/// @param	tokenId	Contains the index of the token that we want to verify 
	/// @return bool Answer true if the token exist or false if not 
	function _exists(uint256 tokenId) internal view virtual returns (bool) {
		return s._owners[tokenId] != address(0);
	}

	/// @notice	Returns the token index inside the product
	/// @param	token	Token ID to find
	/// @return tokenIndex which contains the corresponding token index
	function tokenToProductIndex(uint token) public view returns (uint tokenIndex) {
		return token - s.products[s.tokenToProduct[token]].startingToken;
	}

	/// @notice	Updates the unique URI of all the tokens, but in a single transaction
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Uses the single function so it also emits an event
	/// @dev 	This function requires that all the tokens have a corresponding URI
	/// @param	tokenIds	Token Indexes that will be given an URI
	/// @param	newURIs		New URIs to be set
	function setUniqueURIBatch(uint[] calldata tokenIds, string[] calldata newURIs) external onlyRole(CREATOR) {
		require(tokenIds.length == newURIs.length, "RAIR ERC721: Token IDs and URIs should have the same length");
		for (uint i = 0; i < tokenIds.length; i++) {
			setUniqueURI(tokenIds[i], newURIs[i]);
		}
	}
	
	/// @notice	Gives an individual token an unique URI
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Emits an event so there's provenance
	/// @param	tokenId	Token Index that will be given an URI
	/// @param	newURI	New URI to be given
	function setUniqueURI(uint tokenId, string calldata newURI) public onlyRole(CREATOR) {
		s.uniqueTokenURI[tokenId] = newURI;
		emit UpdatedTokenURI(tokenId, newURI);
	}

	/// @notice	Gives an individual token an unique URI
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Emits an event so there's provenance
	/// @param	productId	Token Index that will be given an URI
	/// @param	newURI		New URI to be given
	/// @param	appendTokenIndexToProductURI 
	function setProductURI(uint productId, string calldata newURI, bool appendTokenIndexToProductURI) public onlyRole(CREATOR) {
		s.productURI[productId] = newURI;
		s.appendTokenIndexToProductURI[productId] = appendTokenIndexToProductURI;
		emit UpdatedProductURI(productId, newURI, appendTokenIndexToProductURI);
	}

	/// @notice	This function use OpenSea's to freeze the metadata
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @param tokenId Token Index that will be given an URI
	function freezeMetadata(uint tokenId) public onlyRole(CREATOR) {
		emit PermanentURI(tokenURI(tokenId), tokenId);
	}

	/// @notice	This function allow us to set a new contract URI
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @param newURI New URI to be given
	function setContractURI(string calldata newURI) external onlyRole(CREATOR) {
		s.contractMetadataURI = newURI;
		emit UpdatedContractURI(newURI);
	}

	/// @notice	This function allow us to see the current URI of the contract
	/// @return string with the URI of the contract 
	function contractURI() public view returns (string memory) {
		return s.contractMetadataURI;
	}
	
	/// @notice	Sets the Base URI for ALL tokens
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @dev	Can be overriden by the specific token URI
	/// @param	newURI	URI to be used
	/// @param	appendTokenIndexToBaseURI	URI to be used
	function setBaseURI(string calldata newURI, bool appendTokenIndexToBaseURI) external onlyRole(CREATOR) {
		s.baseURI = newURI;
		s.appendTokenIndexToBaseURI = appendTokenIndexToBaseURI;
		emit UpdatedBaseURI(newURI, appendTokenIndexToBaseURI);
	}

	/// @notice	Returns a token's URI, could be specific or general
	/// @dev	If the specific token URI doesn't exist, the general base URI will be returned
	/// @param	tokenId		Token Index to look for
	/// @return string with the URI of the toke that we are using
	function tokenURI(uint tokenId) public view returns (string memory) {
		require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
		string memory URI = s.uniqueTokenURI[tokenId];
		if (bytes(URI).length > 0) {
			return URI;
		}
		URI = s.productURI[s.tokenToProduct[tokenId]];
		if (bytes(URI).length > 0) {
			if (s.appendTokenIndexToProductURI[s.tokenToProduct[tokenId]]) {
				return string(abi.encodePacked(URI, tokenToProductIndex(tokenId).toString()));
			}
			return URI; 
		}
		URI = s.baseURI;
		if (bytes(URI).length > 0) {
			if (s.appendTokenIndexToBaseURI) {
				return string(abi.encodePacked(URI, tokenId.toString()));
			}
			return URI;
		}
		return "";
	}
}