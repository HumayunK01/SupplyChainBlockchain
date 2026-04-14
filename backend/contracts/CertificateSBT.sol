// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CertificateSBT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Maps address to their token ID for easy lookup
    mapping(address => uint256) public certificateOf;

    constructor() ERC721("Pharma Supply Chain Certificate", "PSCC") {}

    function issueCertificate(address to, string memory uri) public onlyOwner {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(to, newItemId);
        _setTokenURI(newItemId, uri);
        certificateOf[to] = newItemId;
    }

    function revokeCertificate(address holder) public onlyOwner {
        uint256 tokenId = certificateOf[holder];
        require(tokenId != 0, "CertificateSBT: No certificate found for this address");
        _burn(tokenId);
        delete certificateOf[holder];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        // We only allow minting (from == 0) and burning (to == 0)
        require(
            from == address(0) || to == address(0),
            "CertificateSBT: This is a Soulbound Token. It cannot be transferred."
        );
    }
}
