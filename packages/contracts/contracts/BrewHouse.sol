// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BrewHouse is ERC4626 {
  constructor(
    address asset_
  ) ERC4626(IERC20(asset_)) ERC20("BrewHouse", "BREW") {}
}
