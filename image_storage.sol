pragma solidity ^0.4.23;

contract ImageStorage {

    struct thumbs {
        uint256 likes;
        mapping(address => bool) likers;
        uint256 dislikes;
        mapping(address => bool) dislikers;
    }

    // tip on TRX
    struct tipTrx {
        uint256 tip_total;
        mapping(address => uint256) tip_details;
    }

    // tip on a Token
    struct tipToken {
        uint256 tip_total;
        mapping(address => uint256) tip_details;
    }

    struct metrics {
        thumbs thumbs_info;
        tipTrx tip_trx_info;
        tipToken tip_token_info;
        address uploader;
    }

    address admin;
    uint256 fee_percent; // the percent of tips that an admin will get
    uint256 token_id;
    mapping(string => metrics) image_storage;
    string[] all_images;

    constructor() public {
        admin = msg.sender;
        fee_percent = 20;
        token_id = 1000073;
    }

    function sendTrxTips(string qm_hash) public payable returns (uint256) {
        uint256 fee_amount = msg.value * fee_percent / 100;
        admin.transfer(fee_amount);
        image_storage[qm_hash].uploader.transfer(msg.value - fee_amount);
        image_storage[qm_hash].tip_trx_info.tip_total += msg.value;
        image_storage[qm_hash].tip_trx_info.tip_details[msg.sender] += msg.value;
        return image_storage[qm_hash].tip_trx_info.tip_total;
    }

    function getTrxTips(string qm_hash) public view returns (uint256) {
        return image_storage[qm_hash].tip_trx_info.tip_total;
    }

    function sendTokenTips(string qm_hash) public payable returns (uint256) {
        uint256 fee_amount = msg.tokenvalue * fee_percent / 100;
        admin.transferToken(fee_amount, msg.tokenid);
        image_storage[qm_hash].uploader.transferToken(msg.tokenvalue - fee_amount, msg.tokenid);
        image_storage[qm_hash].tip_token_info.tip_total += msg.tokenvalue;
        image_storage[qm_hash].tip_token_info.tip_details[msg.sender] += msg.tokenvalue;
        return image_storage[qm_hash].tip_token_info.tip_total;
    }

    function getTokenTips(string qm_hash) public view returns (uint256) {
        return image_storage[qm_hash].tip_token_info.tip_total;
    }

    function getTokenId() public view returns (uint256) {
        return token_id;
    }

    function addImageHash(string qm_hash) public returns (string) {
        if (image_storage[qm_hash].uploader > 0) {
            // this image identified by the QmHash has been uploaded by someone
            return qm_hash;
        }
        image_storage[qm_hash] = metrics({
            thumbs_info: thumbs({
                likes: 0,
                dislikes: 0
            }),
            tip_trx_info: tipTrx({
                tip_total: 0
            }),
            tip_token_info: tipToken({
                tip_total: 0
            }),
            uploader: msg.sender

        });
        all_images.push(qm_hash);
        return qm_hash;
    }

    function getHashById(uint256 index) public view returns (string) {
        return all_images[index];
    }

    function getHashCount() public view returns (uint256) {
        return all_images.length;
    }

    function thumbsUp(string qm_hash) public returns (uint256) {
        if (image_storage[qm_hash].thumbs_info.likers[msg.sender] == false) {
            image_storage[qm_hash].thumbs_info.likers[msg.sender] = true;
            image_storage[qm_hash].thumbs_info.likes++;
        }
        return image_storage[qm_hash].thumbs_info.likes;
    }

    function getThumbsUp(string qm_hash) public view returns (uint256) {
        return image_storage[qm_hash].thumbs_info.likes;
    }

    function thumbsDown(string qm_hash) public returns (uint256) {
        if (image_storage[qm_hash].thumbs_info.dislikers[msg.sender] == false) {
            image_storage[qm_hash].thumbs_info.dislikers[msg.sender] = true;
            image_storage[qm_hash].thumbs_info.dislikes++;
        }
        return image_storage[qm_hash].thumbs_info.dislikes;
    }

    function getThumbsDown(string qm_hash) public view returns (uint256) {
        return image_storage[qm_hash].thumbs_info.dislikes;
    }

    //++++++++++++++++ additional function +++++++++++
    function updateFeePercent(uint256 new_fee_percent) public returns (uint256) {
        require(msg.sender == admin, "Only the contract admin can update fee percent.");
        require(0 <= new_fee_percent, "The msg.value must >= 0.");
        require(new_fee_percent <= 100, "The msg.value must <= 100");
        fee_percent = new_fee_percent;
        return fee_percent;
    }

    //++++++++++++++++ debug function ++++++++++++++++
    function getUploader(string qm_hash) public view returns (address) {
        return image_storage[qm_hash].uploader;
    }

    function getAdminAddress() public view returns (address) {
        return admin;
    }

    function getFeePercent() public view returns (uint256) {
        return fee_percent;
    }

    function getTrxTipsByQmHashAndCurrentUser(string qm_hash) public view returns (uint256) {
        return image_storage[qm_hash].tip_trx_info.tip_details[msg.sender];
    }

    function getTokenTipsByQmHashAndCurrentUser(string qm_hash) public view returns (uint256) {
        return image_storage[qm_hash].tip_token_info.tip_details[msg.sender];
    }
}
