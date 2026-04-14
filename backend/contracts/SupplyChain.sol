// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract SupplyChain {
    //Smart Contract owner will be the person who deploys the contract only he can authorize various roles like retailer, Manufacturer,etc
    address public Owner;
    IERC721 public certificateToken;

    //note this constructor will be called when smart contract will be deployed on blockchain
    constructor(address _certificateAddress) {
        Owner = msg.sender;
        certificateToken = IERC721(_certificateAddress);
    }

    //Roles (flow of pharma supply chain)
    // RawMaterialSupplier; //This is where Manufacturer will get raw materials to make medicines
    // Manufacturer;  //Various WHO guidelines should be followed by this person
    // Distributor; //This guy distributes the medicines to retailers
    // Retailer; //Normal customer buys from the retailer

    // Events
    event RoleRegistered(string roleType, uint256 indexed id, address indexed addr, string name, string place, uint256 timestamp);
    event MedicineAdded(uint256 indexed id, string name, string description, uint256 timestamp);
    event StageUpdated(uint256 indexed medicineId, STAGE stage, address indexed updatedBy, uint256 timestamp);
    event BatchRegistered(uint256 indexed batchId, bytes32 merkleRoot, uint256 manufacturerId, uint256 timestamp);

    //modifier to make sure only the owner is using the function
    modifier onlyByOwner() {
        require(msg.sender == Owner);
        _;
    }

    //stages of a medicine in pharma supply chain
    enum STAGE {
        Init,
        RawMaterialSupply,
        Manufacture,
        Distribution,
        Retail,
        sold
    }
    //using this we are going to track every single medicine the owner orders

    //Medicine count
    uint256 public medicineCtr = 0;
    //Raw material supplier count
    uint256 public rmsCtr = 0;
    //Manufacturer count
    uint256 public manCtr = 0;
    //distributor count
    uint256 public disCtr = 0;
    //retailer count
    uint256 public retCtr = 0;

    //To store information about the medicine
    struct medicine {
        uint256 id; //unique medicine id
        string name; //name of the medicine
        string description; //about medicine
        uint256 RMSid; //id of the Raw Material supplier for this particular medicine
        uint256 MANid; //id of the Manufacturer for this particular medicine
        uint256 DISid; //id of the distributor for this particular medicine
        uint256 RETid; //id of the retailer for this particular medicine
        STAGE stage; //current medicine stage
    }

    //To store all the medicines on the blockchain
    mapping(uint256 => medicine) public MedicineStock;

    //To show status to client applications
    function showStage(
        uint256 _medicineID
    ) public view returns (string memory) {
        require(medicineCtr > 0);
        if (MedicineStock[_medicineID].stage == STAGE.Init)
            return "Medicine Ordered";
        else if (MedicineStock[_medicineID].stage == STAGE.RawMaterialSupply)
            return "Raw Material Supply Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.Manufacture)
            return "Manufacturing Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.Distribution)
            return "Distribution Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.Retail)
            return "Retail Stage";
        else if (MedicineStock[_medicineID].stage == STAGE.sold)
            return "Medicine Sold";
    }

    //To store information about raw material supplier
    struct rawMaterialSupplier {
        address addr;
        uint256 id; //supplier id
        string name; //Name of the raw material supplier
        string place; //Place the raw material supplier is based in
    }

    //To store all the raw material suppliers on the blockchain
    mapping(uint256 => rawMaterialSupplier) public RMS;

    //To store information about manufacturer
    struct manufacturer {
        address addr;
        uint256 id; //manufacturer id
        string name; //Name of the manufacturer
        string place; //Place the manufacturer is based in
    }

    //To store all the manufacturers on the blockchain
    mapping(uint256 => manufacturer) public MAN;

    //To store information about distributor
    struct distributor {
        address addr;
        uint256 id; //distributor id
        string name; //Name of the distributor
        string place; //Place the distributor is based in
    }

    //To store all the distributors on the blockchain
    mapping(uint256 => distributor) public DIS;

    //To store information about retailer
    struct retailer {
        address addr;
        uint256 id; //retailer id
        string name; //Name of the retailer
        string place; //Place the retailer is based in
    }

    //To store all the retailers on the blockchain
    mapping(uint256 => retailer) public RET;

    //To add raw material suppliers. Only contract owner can add a new raw material supplier
    function addRMS(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner {
        require(
            certificateToken.balanceOf(_address) > 0,
            "SupplyChain: Address does not hold a valid Soulbound Certificate"
        );
        rmsCtr++;
        RMS[rmsCtr] = rawMaterialSupplier(_address, rmsCtr, _name, _place);
        emit RoleRegistered("RMS", rmsCtr, _address, _name, _place, block.timestamp);
    }

    //To add manufacturer. Only contract owner can add a new manufacturer
    function addManufacturer(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner {
        require(
            certificateToken.balanceOf(_address) > 0,
            "SupplyChain: Address does not hold a valid Soulbound Certificate"
        );
        manCtr++;
        MAN[manCtr] = manufacturer(_address, manCtr, _name, _place);
        emit RoleRegistered("MAN", manCtr, _address, _name, _place, block.timestamp);
    }

    //To add distributor. Only contract owner can add a new distributor
    function addDistributor(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner {
        require(
            certificateToken.balanceOf(_address) > 0,
            "SupplyChain: Address does not hold a valid Soulbound Certificate"
        );
        disCtr++;
        DIS[disCtr] = distributor(_address, disCtr, _name, _place);
        emit RoleRegistered("DIS", disCtr, _address, _name, _place, block.timestamp);
    }

    //To add retailer. Only contract owner can add a new retailer
    function addRetailer(
        address _address,
        string memory _name,
        string memory _place
    ) public onlyByOwner {
        require(
            certificateToken.balanceOf(_address) > 0,
            "SupplyChain: Address does not hold a valid Soulbound Certificate"
        );
        retCtr++;
        RET[retCtr] = retailer(_address, retCtr, _name, _place);
        emit RoleRegistered("RET", retCtr, _address, _name, _place, block.timestamp);
    }

    //To supply raw materials from RMS supplier to the manufacturer
    function RMSsupply(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr);
        uint256 _id = findRMS(msg.sender);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.Init);
        MedicineStock[_medicineID].RMSid = _id;
        MedicineStock[_medicineID].stage = STAGE.RawMaterialSupply;
        emit StageUpdated(_medicineID, STAGE.RawMaterialSupply, msg.sender, block.timestamp);
    }

    //To check if RMS is available in the blockchain
    function findRMS(address _address) private view returns (uint256) {
        require(rmsCtr > 0);
        for (uint256 i = 1; i <= rmsCtr; i++) {
            if (RMS[i].addr == _address) return RMS[i].id;
        }
        return 0;
    }

    //To manufacture medicine
    function Manufacturing(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr);
        uint256 _id = findMAN(msg.sender);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.RawMaterialSupply);
        MedicineStock[_medicineID].MANid = _id;
        MedicineStock[_medicineID].stage = STAGE.Manufacture;
        emit StageUpdated(_medicineID, STAGE.Manufacture, msg.sender, block.timestamp);
    }

    //To check if Manufacturer is available in the blockchain
    function findMAN(address _address) private view returns (uint256) {
        require(manCtr > 0);
        for (uint256 i = 1; i <= manCtr; i++) {
            if (MAN[i].addr == _address) return MAN[i].id;
        }
        return 0;
    }

    //To supply medicines from Manufacturer to distributor
    function Distribute(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr);
        uint256 _id = findDIS(msg.sender);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.Manufacture);
        MedicineStock[_medicineID].DISid = _id;
        MedicineStock[_medicineID].stage = STAGE.Distribution;
        emit StageUpdated(_medicineID, STAGE.Distribution, msg.sender, block.timestamp);
    }

    //To check if distributor is available in the blockchain
    function findDIS(address _address) private view returns (uint256) {
        require(disCtr > 0);
        for (uint256 i = 1; i <= disCtr; i++) {
            if (DIS[i].addr == _address) return DIS[i].id;
        }
        return 0;
    }

    //To supply medicines from distributor to retailer
    function Retail(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr);
        uint256 _id = findRET(msg.sender);
        require(_id > 0);
        require(MedicineStock[_medicineID].stage == STAGE.Distribution);
        MedicineStock[_medicineID].RETid = _id;
        MedicineStock[_medicineID].stage = STAGE.Retail;
        emit StageUpdated(_medicineID, STAGE.Retail, msg.sender, block.timestamp);
    }

    //To check if retailer is available in the blockchain
    function findRET(address _address) private view returns (uint256) {
        require(retCtr > 0);
        for (uint256 i = 1; i <= retCtr; i++) {
            if (RET[i].addr == _address) return RET[i].id;
        }
        return 0;
    }

    //To sell medicines from retailer to consumer
    function sold(uint256 _medicineID) public {
        require(_medicineID > 0 && _medicineID <= medicineCtr);
        uint256 _id = findRET(msg.sender);
        require(_id > 0);
        require(_id == MedicineStock[_medicineID].RETid); //Only correct retailer can mark medicine as sold
        require(MedicineStock[_medicineID].stage == STAGE.Retail);
        MedicineStock[_medicineID].stage = STAGE.sold;
        emit StageUpdated(_medicineID, STAGE.sold, msg.sender, block.timestamp);
    }

    // To add new medicines to the stock
    function addMedicine(
        string memory _name,
        string memory _description
    ) public onlyByOwner {
        require((rmsCtr > 0) && (manCtr > 0) && (disCtr > 0) && (retCtr > 0));
        medicineCtr++;
        MedicineStock[medicineCtr] = medicine(
            medicineCtr,
            _name,
            _description,
            0,
            0,
            0,
            0,
            STAGE.Init
        );
        emit MedicineAdded(medicineCtr, _name, _description, block.timestamp);
    }

    // --- Merkle Tree Batch Issuance (V2 Scalability Update) ---
    struct MedicineBatch {
        uint256 batchId;
        bytes32 merkleRoot;
        uint256 manufacturerId;
        uint256 timestamp;
        string ipfsCID;
    }

    uint256 public batchCtr = 0;
    mapping(uint256 => MedicineBatch) public MedicineBatches;

    // O(1) On-Chain Storage: Manufacturer registers 10,000 medicines via 1 Merkle Root
    function registerMedicineBatch(bytes32 _merkleRoot, string memory _ipfsCID) public {
        uint256 _manId = findMAN(msg.sender);
        require(
            _manId > 0,
            "Only registered manufacturers can register a batch"
        );

        batchCtr++;
        MedicineBatches[batchCtr] = MedicineBatch(
            batchCtr,
            _merkleRoot,
            _manId,
            block.timestamp,
            _ipfsCID
        );
        emit BatchRegistered(batchCtr, _merkleRoot, _manId, block.timestamp);
    }

    // Zero-Knowledge Verification: Anyone can instantly verify a single medicine is valid within a batch
    function verifyMedicineInBatch(
        uint256 _batchId,
        bytes32 _leafNode,
        bytes32[] calldata _merkleProof
    ) public view returns (bool) {
        require(_batchId > 0 && _batchId <= batchCtr, "Invalid batch ID");
        bytes32 root = MedicineBatches[_batchId].merkleRoot;
        return MerkleProof.verify(_merkleProof, root, _leafNode);
    }
}
