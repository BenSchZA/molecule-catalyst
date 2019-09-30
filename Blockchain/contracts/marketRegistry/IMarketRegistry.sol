pragma solidity 0.5.10;

/**
  * @author Veronica - @veronicalc & Ryan Nobel - @RyRy
  * @title  The interface for the market registry.
  */
interface IMarketRegistry {
    
    event MarketCreated(
      uint256 index,
      address indexed
      marketAddress,
      address indexed vault,
      address indexed creator
    );
    event DeployerAdded(address deployer, string version);
    event DeployerRemoved(address deployer, string reason);

    /**
      * @dev    Adds a new market deployer to the registry.
      * @param  _newDeployer : Address of the new market deployer.
      * @param  _version : string - Log text for tracking purposes.
      */
    function addMarketDeployer(
      address _newDeployer,
      string calldata _version
    ) external;

    /**
      * @dev    Removes a market deployer from the registry.
      * @param  _deployerToRemove : Address of the market deployer to remove.
      * @param  _reason : Log text for tracking purposes.
      */
    function removeMarketDeployer(
      address _deployerToRemove,
      string calldata _reason
    ) external;

    /**
      * @dev    Logs the market into the registery.
      * @param  _vault : Address of the vault.
      * @param  _creator : Creator of the market.
      * @return uint256 : Returns the index of market for looking up.
      */
    function registerMarket(
        address _marketAddress,
        address _vault,
        address _creator
    )
        external
        returns(uint256);

    /**
      * @dev    Fetches all data and contract addresses of deployed
      *         markets by index, kept as interface for later
      *         intergration.
      * @param  _index : Index of the market.
      * @return address : The address of the market.
	  * @return	address : The address of the vault.
	  * @return	address : The address of the creator.
      */
    function getMarket(uint256 _index)
        external
        view
        returns(
            address,
            address,
            address
        );

	/**
	  * @dev	Fetchs the current number of markets infering maximum
	  *			callable index.
	  * @return	uint256 : The number of markets that have been deployed.
	  */
    function getIndex() external view returns(uint256);

	/**
	  * @dev	Used to check if the deployer is registered.
	  * @return	bool : A simple bool to indicate state.
	  */
    function isMarketDeployer(address _deployer) external view returns(bool);

	/**
	  * @dev	In order to look up logs efficently, the published block is
	  *			available.
	  * @return	uint256 : The block when the contract was published.
	  */
    function publishedBlocknumber() external view returns(uint256);
}
