pragma solidity 0.5.9;

import { AdminManaged } from "../_shared/modules/AdminManaged.sol";

contract MarketRegistry is AdminManaged {
    mapping(uint256 => Market) internal markets_;
    mapping(address => bool) internal deployer_;

    uint256 internal numberOfMarkets_ = 0;
    uint256 internal publishedBlocknumber_;

    struct Market {
        address marketAddress;
        address vault;
        address creator;
    }

    event MarketCreated(uint256 index, address indexed marketAddress, address indexed vault, address indexed creator);

    event DeployerAdded(address deployer, string version);
    event DeployerRemoved(address deployer, string reason);

    constructor() public AdminManaged(msg.sender){
        publishedBlocknumber_ = block.number;
    }

    modifier isRegisteredDeployer(){
        require(deployer_[msg.sender] == true, "Deployer not registered");
        _;
    }

    /// @dev                            Adds a new market deployer to the registry
    /// @param _newDeployer             :address Address of the new market deployer
    /// @param _version                 :string Log text for tracking purposes
    /// @author Ryan
    function addMarketDeployer(address _newDeployer, string calldata _version) external onlyAdmin(){
        require(deployer_[_newDeployer] != true, "Already approved");
        deployer_[_newDeployer] = true;
        emit DeployerAdded(_newDeployer, _version);
    }

    /// @dev                            Removes a market deployer from the registry
    /// @param _deployerToRemove        :address Address of the market deployer to remove
    /// @param _reason                  :string Log text for tracking purposes
    /// @author Ryan
    function removeMarketDeployer(address _deployerToRemove, string calldata _reason) external onlyAdmin(){
        require(deployer_[_deployerToRemove] != false, "Already inactive");
        deployer_[_deployerToRemove] = false;
        emit DeployerRemoved(_deployerToRemove, _reason);
    }

    /// @dev                            Logs the market into the registery
    /// @param _curve                   :address Curve integral library
    /// @param _vault                   :address Address of the vault
    /// @param _creator                 :address Creator of the market
    /// @return uint256                 Returns the index of market for looking up
    /// @author Ryan
    function registerMarket(
        address _marketAddress,
        address _vault,
        address _creator)
        external
        isRegisteredDeployer()
        returns(uint256)
    {
        uint256 index = numberOfMarkets_;
        numberOfMarkets_ = numberOfMarkets_ + 1;

        markets_[index].marketAddress = _marketAddress;
        markets_[index].vault = _vault;
        markets_[index].creator = _creator;

        emit MarketCreated(
            index,
            _marketAddress,
            _vault,
            _creator
        );

        return index;
    }

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
        )
    {
        return (
            markets_[_index].marketAddress,
            markets_[_index].vault,
            markets_[_index].creator
        );
    }

    /// @dev                            Fetchs the current number of markets infering maximum callable index
    /// @return Index                   Returns the index of markets for looking up
    /// @author Ryan
    function getIndex()
        external
        view
        returns(uint256)
    {
        return numberOfMarkets_;
    }

    /// @dev                            Used to check if the deployer is registered
    /// @return bool                    A simple bool to indicate state
    /// @author Ryan
    function isMarketDeployer(address _deployer) external view returns(bool){
        return deployer_[_deployer];
    }

    /// @dev                            In order to look up logs efficently, the published block is available
    /// @return uint256                 The block when the contract was published
    /// @author Ryan
    function publishedBlocknumber() external view returns(uint256) {
        return publishedBlocknumber_;
    }
}