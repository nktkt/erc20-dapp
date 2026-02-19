// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable2Step {
    uint256 public immutable maxSupply;

    error ExceedsMaxSupply(uint256 attempted, uint256 max);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        uint256 maxSupply_,
        address initialOwner
    ) ERC20(name_, symbol_) Ownable(initialOwner) {
        require(maxSupply_ >= initialSupply, "max < initial");
        maxSupply = maxSupply_;
        _mint(initialOwner, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (totalSupply() + amount > maxSupply) {
            revert ExceedsMaxSupply(totalSupply() + amount, maxSupply);
        }
        _mint(to, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
