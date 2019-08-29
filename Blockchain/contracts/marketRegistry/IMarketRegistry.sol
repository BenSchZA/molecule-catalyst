pragma solidity 0.5.10;

interface IMarketRegistry {
    
    event MarketCreated(uint256 index, address indexed marketAddress, address indexed vault, address indexed creator);
    event DeployerAdded(address deployer, string version);
    event DeployerRemoved(address deployer, string reason);

    /**
      * @dev                Adds a new market deployer to the registry
      * @param _newDeployer : address - Address of the new market deployer
      * @param _version     : string - Log text for tracking purposes
      * @author Ryan
      */
    function addMarketDeployer(address _newDeployer, string calldata _version) external;

    /**
      * @dev                        Removes a market deployer from the registry
      * @param _deployerToRemove    : address - Address of the market deployer to remove
      * @param _reason              : string - Log text for tracking purposes
      * @author Ryan
      */
    function removeMarketDeployer(address _deployerToRemove, string calldata _reason) external;

    /// @dev                            Logs the market into the registery
    /// @param _vault                   :address Address of the vault
    /// @param _creator                 :address Creator of the market
    /// @return uint256                 Returns the index of market for looking up
    /// @author Ryan
    function registerMarket(
        address _marketAddress,
        address _vault,
        address _creator
    )
        external
        returns(uint256);

    /// Fetching market data
    /// @param _index                   :uint256 Index of the market
    /// @dev                            Fetches all data and contract addresses of deployed markets by index, kept as interface for later intergration
    /// @return Market                  Returns a market struct matching the provided index
    /// @author Ryan
    function getMarket(uint256 _index)
        external
        view
        returns(
            address,
            address,
            address
        );

    /// @dev                            Fetchs the current number of markets infering maximum callable index
    /// @return Index                   Returns the index of markets for looking up
    /// @author Ryan
    function getIndex()
        external
        view
        returns(uint256);

    /// @dev                            Used to check if the deployer is registered
    /// @return bool                    A simple bool to indicate state
    /// @author Ryan
    function isMarketDeployer(address _deployer) external view returns(bool);

    /// @dev                            In order to look up logs efficently, the published block is available
    /// @return uint256                 The block when the contract was published
    /// @author Ryan
    function publishedBlocknumber() external view returns(uint256);

    /**
      * @notice checks admin status of an address
      */
    function isWhitelistAdmin(address account) external view returns (bool);

    /**
      * @dev Allows a whitelisted admin to add another admin
      */
    function addWhitelistAdmin(address account) external;

    /**
      * @dev Allows a whitlisted admin to renouce their role as admin
      */
    function renounceWhitelistAdmin() external;
}
