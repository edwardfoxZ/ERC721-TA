// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Image is ERC721Enumerable {
    string [] public Images;
    mapping(string => bool) private _imageExists;

    constructor (string memory name, string memory symbol) ERC721(name, symbol) {

    }

    function mint(string memory _img) public {
        require(!_imageExists[_img], "the image already exists");

        Images.push(_img);
        uint256 _id = Images.length - 1;
        _mint(msg.sender, _id);
        _imageExists[_img] = true;
    }

    function totalSupply() override view public returns(uint) {
        return super.totalSupply();
    }
}