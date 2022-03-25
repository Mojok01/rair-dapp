// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import './AppStorage.sol';

/// @title  RAIR Product facet contract
/// @notice You can use this contract to manage information about the token and the products  
/// @author Juan M. Sanchez M.
/// @dev 	Notice that this contract is inheriting from AccessControlAppStorageEnumerable721
contract RAIRProductFacet is AccessControlAppStorageEnumerable721 {
	bytes32 public constant CREATOR = keccak256("CREATOR");
<<<<<<< HEAD

	/// @notice This event stores in the blockchain when the product is correctly created
    /// @param  id Contains the unique id that will be indexed for the product
	/// @param  name Contains the name to identify the product
	/// @param  startingToken Contains the selected NTF token to start the product 
	/// @param  length Contains the total of tokens that we want the product to have
	event ProductCreated(uint indexed id, string name, uint startingToken, uint length);
=======
	event CreatedCollection(uint indexed collectionIndex, string collectionName, uint startingToken, uint collectionLength);
>>>>>>> remotes/origin/dev

	/// @notice Verifies that the product exists
	/// @param	collectionId	Collection to verify
	modifier collectionExists(uint collectionId) {
		require(s.products.length > collectionId, "RAIR ERC721: Collection does not exist");
		_;
	}

	/// @notice Verifies that the range exists
	/// @param	rangeID	Range to verify
	modifier rangeExists(uint rangeID) {
		require(s.ranges.length > rangeID, "RAIR ERC721: Range does not exist");
		_;
	}

	/// @notice Verifies that the token exists
	/// @param	tokenIndex	Range to verify
	modifier tokenExists(uint tokenIndex) {
		require(s._minted[tokenIndex], "RAIR ERC721: Query for nonexistent token");
		_;
	}

	/// @notice Wrapper for the validator, searching for the entire product
	/// @dev 	This function require that the product exist
	/// @param	find			Address to search
<<<<<<< HEAD
	/// @param	productIndex	Product to verify
	/// @return bool 			For the existence or not, of the token in the product 
	function ownsTokenInProduct(address find, uint productIndex) public view productExists(productIndex) returns (bool) {
=======
	/// @param	productIndex	Collection to verify
	function ownsTokenInProduct(address find, uint productIndex) public view collectionExists(productIndex) returns (bool) {
>>>>>>> remotes/origin/dev
		product storage selectedProduct = s.products[productIndex];
		return _ownsTokenInsideRange(find, selectedProduct.startingToken, selectedProduct.endingToken);
	}

	/// @notice Wrapper for the validator, searching for the entire range
	/// @dev 	This function require that the range exist 
	/// @param	find		Address to search
	/// @param	rangeIndex	Range to verify
	/// @return bool 		For the existence or not, of the token in the range 
	function ownsTokenInRange(address find, uint rangeIndex) public view rangeExists(rangeIndex) returns (bool) {
		range storage selectedRange = s.ranges[rangeIndex];
		uint startOfProduct = s.products[s.rangeToProduct[rangeIndex]].startingToken;
		return _ownsTokenInsideRange(find, startOfProduct + selectedRange.rangeStart, startOfProduct + selectedRange.rangeEnd);
	}

	/// @notice Validates that an address owns at least one token inside a specified range
	/// @dev Loops through the range, don't use on non-view functions
	/// @param	find	Address to validate
	/// @param	from	Range start
	/// @param	to		Range end
	/// @return bool 	For the existence or not, of the token inside the range 
	function _ownsTokenInsideRange(address find, uint from, uint to) internal view returns (bool) {
		for (uint i = from; i < to; i++) {
			if (s._owners[i] == find) {
				return true;
			}
		}
		return false;
	}

<<<<<<< HEAD
	/// @param productIndex_ Contains the facet addresses and function selectors
	/// @param tokenIndex_ Contains the facet addresses and function selectors
	function tokenByProduct(uint productIndex_, uint tokenIndex_) public view productExists(productIndex_) returns (uint) {
		return s.tokensByProduct[productIndex_][tokenIndex_];
	}

	/// @param productIndex Contains the facet addresses and function selectors
	/// @param tokenIndex_ Contains the facet addresses and function selectors
	function productToToken(uint productIndex_, uint tokenIndex_) public view productExists(productIndex_) returns(uint) {
=======
	function tokenByProduct(uint productIndex_, uint tokenIndex_) public view collectionExists(productIndex_) returns (uint) {
		return s.tokensByProduct[productIndex_][tokenIndex_];
	}

	function productToToken(uint productIndex_, uint tokenIndex_) public view collectionExists(productIndex_) returns(uint) {
>>>>>>> remotes/origin/dev
		return s.products[productIndex_].startingToken + tokenIndex_;
	}

	/// @param tokenIndex_ Contains the facet addresses and function selectors
	function tokenToProductIndex(uint tokenIndex_) public view tokenExists(tokenIndex_) returns (uint) {
		return tokenIndex_ - s.products[s.tokenToProduct[tokenIndex_]].startingToken;
	}

	/// @param tokenIndex_ Contains the facet addresses and function selectors
	function tokenToProduct(uint tokenIndex_) public view tokenExists(tokenIndex_) returns (uint productIndex, uint rangeIndex) {
		productIndex = s.tokenToProduct[tokenIndex_];
		rangeIndex = s.tokenToRange[tokenIndex_];
	}

	/// @notice	Returns the number of products on the contract
	/// @dev	Use with get product to list all of the products
	/// @return uint With the total of products
	function getProductCount() external view returns(uint) {
		return s.products.length;
	}

<<<<<<< HEAD
	/// @notice This function allow us to check the information of a product
	/// @dev 	This function require that the product exist
	/// @param productIndex_ Contains the id of the product that we want to verify
	/// @return product which contain the information of the product
	function getProductInfo(uint productIndex_) external view productExists(productIndex_) returns (product memory) {
=======
	function getProductInfo(uint productIndex_) external view collectionExists(productIndex_) returns (product memory) {
>>>>>>> remotes/origin/dev
		return s.products[productIndex_];
	}

	/// @notice This functions allow us to check is a token is owned by an account
	/// @param owner Contains address of the acount that we want to verify
	/// @param index Contains the position in the owned tokens list
	/// @return uint with the token that is owned by the account in that position 
	function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
		require(index < RAIRProductFacet.balanceOf(owner), "ERC721Enumerable: owner index out of bounds");
		return s._ownedTokens[owner][index];
	}

	/// @notice this funtions allow us to know the balance of an account
	/// @param owner Contains the address which balance we want to verify
	/// @return uint256 with the current balance of the account
	function balanceOf(address owner) public view returns (uint256) {
		require(owner != address(0), "ERC721: balance query for the zero address");
		return s._balances[owner];
	}

	/// @notice This function allow us to verify if a token exist or not 
	/// @param tokenId Contains the token Id that we want to check
	/// @return bool to indicate if the token exist or not
	function _exists(uint256 tokenId) internal view returns (bool) {
        return s._owners[tokenId] != address(0);
    }
	
	/// @notice	Loops through a range of tokens inside a product and returns the first token without an owner
	/// @dev	Uses a loop, do not call this from a non-view function!
<<<<<<< HEAD
	/// @param	productID		Index of the product to search
	/// @param	startingIndex	Index of the starting token of the product
	/// @param	endingIndex		Index of the last token of the product 
	/// @return nextIndex		With the next starting point available for new products
	function getNextSequentialIndex(uint productID, uint startingIndex, uint endingIndex) public view productExists(productID) returns(uint nextIndex) {
		product memory currentProduct = s.products[productID];
=======
	/// @param	collectionId	Index of the product to search
	/// @param	startingIndex	Index of the product to search
	/// @param	endingIndex		Index of the product to search
	function getNextSequentialIndex(uint collectionId, uint startingIndex, uint endingIndex) public view collectionExists(collectionId) returns(uint nextIndex) {
		product memory currentProduct = s.products[collectionId];
>>>>>>> remotes/origin/dev
		for (uint i = currentProduct.startingToken + startingIndex; i <= currentProduct.startingToken + endingIndex; i++) {
			if (!_exists(i)) {
				return i - currentProduct.startingToken;
			}
		}
		require(false, "RAIR ERC721: There are no available tokens in this range.");
	}

	/// @notice	Loops over the user's tokens looking for one that belongs to a product and a specific range
	/// @dev	Loops are expensive in solidity, so don't use this in a function that requires gas
<<<<<<< HEAD
	/// @param	userAddress			Address that will be uses to see the belonging tokens of a product and a range
	/// @param	productIndex		Index of the Product to search
	/// @param	startingToken		Starting token to search
	/// @param	endingToken			Last token to search 
	/// @return bool 				Which respond if the tokens belongs or not to a product and a range
=======
	/// @param	userAddress			User to search
	/// @param	productIndex		Collection to search
	/// @param	startingToken		Starting point of search
	/// @param	endingToken			Ending point of search
>>>>>>> remotes/origin/dev
	function hasTokenInProduct(
				address userAddress,
				uint productIndex,
				uint startingToken,
				uint endingToken) public view returns (bool) {
		product memory aux = s.products[productIndex];
		if (aux.endingToken != 0) {
			for (uint i = 0; i < balanceOf(userAddress); i++) {
				uint token = tokenOfOwnerByIndex(userAddress, i);
				if (s.tokenToProduct[token] == productIndex &&
						token >= aux.startingToken + startingToken &&
						token <= aux.startingToken + endingToken) {
					return true;
				}
			}
		}
		return false;
	}

	/// @notice	Returns the number of tokens inside a product
	/// @param	productIndex 	Product index to verify
	/// @return lenght with the total of minted tokens
	function mintedTokensInProduct(uint productIndex) public view returns (uint length) {
		length = s.tokensByProduct[productIndex].length;
	}
	
	/// @notice	Creates a new product
	/// @dev 	This function is only available to an account with a `CREATOR` role
	/// @param	_productName 	Name of the product to create
	/// @param	_copies			Amount of tokens inside the product
	function createProduct(string memory _productName, uint _copies) public onlyRole(CREATOR) {
		uint lastToken = s.products.length == 0 ? 0 : s.products[s.products.length - 1].endingToken + 1;
		
		product storage newProduct = s.products.push();

		newProduct.startingToken = lastToken;
		newProduct.endingToken = newProduct.startingToken + _copies - 1;
		newProduct.name = string(_productName);
		newProduct.mintableTokens = _copies;
		
		emit CreatedCollection(s.products.length - 1, _productName, lastToken, _copies);
	}
}