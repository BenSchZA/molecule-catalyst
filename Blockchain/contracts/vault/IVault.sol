pragma solidity 0.5.9;

interface IVault {
    event FundingWithdrawn(uint256 phase, uint256 amount);

    function withdraw(uint256 _amount) external returns(bool);

    function withdrawAndClose() external returns(bool);

    function fundingPhase(uint256 _stage) external view returns(uint256, uint256, uint256, bool);

    function currentPhase() external view returns(uint256);

    function creator() external view returns(address);

    function failSwitch() public;

    /**
      * @dev Leaves the contract without owner. It will not be
      *      possible to call `onlyOwner` functions anymore. Can
      *       only be called by the current owner.
      *
      * @notice Renouncing ownership will leave the contract
      *         without an owner, thereby removing any functionality
      *         that is only available to the owner.
      */
    function renounceOwnership() external;

    /**
      * @dev Transfers ownership of the contract to a new
      *      account (`newOwner`). Can only be called by
      *      the current owner.
      */
    function transferOwnership(address newOwner) external;

    /**
      * @dev Returns the address of the current owner.
      */
    function owner() external view returns (address);

    /**
      * @dev Returns true if the caller is the current owner.
      */
    function isOwner() external view returns (bool);

    /**
      * @return the address of the primary.
      */
    function primary() public view returns (address);

    /**
      * @dev Transfers contract to a new primary.
      * @param recipient : addressThe - address of new primary.
      */
    function transferPrimary(address recipient) public;
}