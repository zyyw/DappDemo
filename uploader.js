// const ipAddr = "18.224.212.62"
const ipAddr = "127.0.0.1"
const toSun = 1000000;
const timeout = 3000;
const contractAddress = "TSCq9oKH1MKxdyshYvqJ6w5zH3tuFSj7AC";

async function addImageSection(qmHash, contract) {
    if (contract == null) {
        contract = await window.tronWeb.contract().at(contractAddress);
    }
    // each div contains an image and its details
    var div = document.createElement("div")
    div.setAttribute("id", qmHash);
    document.getElementById("display_images").appendChild(div);

    // append the image
    var elem = document.createElement("img");
    elem.setAttribute("src", "http://" + ipAddr + ":8080/ipfs/" + qmHash);
    elem.setAttribute("width", 450);
    document.getElementById(qmHash).appendChild(elem);

    // =========== thumbsUp =============
    // thumbs up section
    var thumbsUp = document.createElement("section")
    thumbsUp.setAttribute("id", "thumbsup_" + qmHash);
    document.getElementById(qmHash).appendChild(thumbsUp);

    // thumbs up button
    var thumbsUpBtn = document.createElement("button");
    thumbsUpBtn.setAttribute("id", "thumbsup_btn_" + qmHash);
    thumbsUpBtn.setAttribute("name", "qmHash");
    thumbsUpBtn.setAttribute("value", qmHash);
    thumbsUpBtn.innerHTML = "Thumbs Up";
    document.getElementById("thumbsup_" + qmHash).appendChild(thumbsUpBtn);

    // thumbs up label
    var thumbsUpLbl = document.createElement("label");
    thumbsUpLbl.setAttribute("id", "thumbsup_lbl_" + qmHash);
    let likes = await contract.getThumbsUp(qmHash).call();
    setTimeout(thumbsUpLbl.innerHTML = likes.toString(), timeout);
    document.getElementById("thumbsup_" + qmHash).appendChild(thumbsUpLbl);

    // add click event listener to Thumbs up Button
    thumbsUpBtn.addEventListener("click", async function() {
        console.log("click thumbs up Button:", this.value);
        let likes = await contract.thumbsUp(this.value).send({
            shouldPollResponse: true
        });
        setTimeout(document.getElementById("thumbsup_lbl_" + qmHash).innerHTML = likes.toString(), timeout);
        console.log("likes-updated:", likes.toString());
    }, false);
    // =========== end of thumbsUp =============

    // =========== thumbsDown =============
    // thumbs down section
    var thumbsDown = document.createElement("section");
    thumbsDown.setAttribute("id", "thumbsdown_" + qmHash);
    document.getElementById(qmHash).appendChild(thumbsDown);

    // thumbs down Button
    var thumbsDownBtn = document.createElement("button");
    thumbsDownBtn.setAttribute("id", "thumbsdown_" + qmHash);
    thumbsDownBtn.setAttribute("name", "qmHash");
    thumbsDownBtn.setAttribute("value", qmHash);
    thumbsDownBtn.innerHTML = "Thumbs Down";
    document.getElementById("thumbsdown_" + qmHash).appendChild(thumbsDownBtn);

    // thumbs down label
    var thumbsDownLbl = document.createElement("label");
    thumbsDownLbl.setAttribute("id", "thumbsdown_lbl_" + qmHash);
    let dislikes = await contract.getThumbsDown(qmHash).call();
    setTimeout(thumbsDownLbl.innerHTML = dislikes.toString(), timeout);
    document.getElementById("thumbsdown_" + qmHash).appendChild(thumbsDownLbl);

    // add click event listener to Thumbs down Button
    thumbsDownBtn.addEventListener("click", async function() {
        console.log("click thumbs down Button:", this.value);
        let dislikes = await contract.thumbsDown(this.value).send({
            shouldPollResponse: true
        });
        setTimeout(document.getElementById("thumbsdown_lbl_" + qmHash).innerHTML = dislikes.toString(), timeout);
        console.log("dislikes-updated:", dislikes.toString());
    }, false);
    // =========== end of thumbsDown =============

    // =========== tip TRX ============
    // 1. tips section
    var trxTips = document.createElement("section");
    trxTips.setAttribute("id", "trx_tips_" + qmHash);
    document.getElementById(qmHash).appendChild(trxTips);
    // 2. tips Button
    var trxTipsBtn = document.createElement("button");
    trxTipsBtn.setAttribute("id", "trx_tips_btn_" + qmHash);
    trxTipsBtn.setAttribute("name", "qmHash");
    trxTipsBtn.setAttribute("value", qmHash);
    trxTipsBtn.innerHTML = "Tips TRX";
    document.getElementById("trx_tips_" + qmHash).appendChild(trxTipsBtn);
    // 3. tips label
    var trxTipsLbl = document.createElement("label");
    trxTipsLbl.setAttribute("id", "trx_tips_lbl_" + qmHash);
    let trxTipsAmount = await contract.getTrxTips(qmHash).call();
    setTimeout(trxTipsLbl.innerHTML = trxTipsAmount.toNumber() / toSun, timeout);
    document.getElementById("trx_tips_" + qmHash).appendChild(trxTipsLbl);
    // 4. add click event listener to tips Button
    trxTipsBtn.addEventListener("click", async function() {
        console.log("click TRX tips Button:", this.value);
        const trxTipsAmountEntered = prompt("Please enter the amount of TRX you want to tip!", 0);
        if (trxTipsAmountEntered > 0) {
            let tips = await contract.sendTrxTips(this.value).send({
                callValue: trxTipsAmountEntered * toSun,
                shouldPollResponse: true
            });
            setTimeout(document.getElementById("trx_tips_lbl_" + qmHash).innerHTML = tips.toNumber() / toSun, timeout);
            console.log("trx-tips-updated:", tips.toNumber() / toSun);
        }
    }, false);
    // =========== end of tip TRX ============

    // =========== tip Token =============
    // tip token
    // 1. tip token section
    var tokenTips = document.createElement("section");
    tokenTips.setAttribute("id", "token_tips_" + qmHash);
    document.getElementById(qmHash).appendChild(tokenTips);
    // 2. tiptoken Button
    var tokenTipsBtn = document.createElement("button");
    tokenTipsBtn.setAttribute("id", "token_tips_btn_" + qmHash);
    tokenTipsBtn.setAttribute("name", "qmHash");
    tokenTipsBtn.setAttribute("value", qmHash);
    tokenTipsBtn.innerHTML = "Tips Token";
    document.getElementById("token_tips_" + qmHash).appendChild(tokenTipsBtn);
    // 3. tiptoken label
    var tokenTipsLbl = document.createElement("label");
    tokenTipsLbl.setAttribute("id", "token_tips_lbl_" + qmHash);
    let tokenTipsAmount = await contract.getTokenTips(qmHash).call();
    setTimeout(tokenTipsLbl.innerHTML = tokenTipsAmount.toNumber(), timeout);
    document.getElementById("token_tips_" + qmHash).appendChild(tokenTipsLbl);
    // 4. add click event listener to tip Button
    tokenTipsBtn.addEventListener("click", async function() {
        console.log("click tip token Button:", this.value);
        let tokenId = await contract.getTokenId().call();
        const tokentipsAmountEntered = prompt("Please enter the amount of token you want ot tip!", 0);
        if (tokentipsAmountEntered > 0) {
            let tips = await contract.sendTokenTips(this.value).send({
                tokenValue: tokentipsAmountEntered,
                tokenId: tokenId,
                shouldPollResponse: true
            });
            setTimeout(document.getElementById("token_tips_lbl_" + qmHash).innerHTML = tips.toNumber(), timeout);
            console.log("token-tips-updated:", tips.toNumber());
        }
    }, false);
    // =========== end of tip Token =============

    // add <br/>
    var br = document.createElement("br");
    document.getElementById(qmHash).appendChild(br);
    document.getElementById(qmHash).appendChild(br);
}

// store image to BTFS and save QmHash into smart contract
function upload() {
    const reader = new FileReader();
    reader.onloadend = function() {
        const ipfs = window.IpfsApi(ipAddr, 5001) // Connect to IPFS
        // const ipfs = window.IpfsApi({host: 'api.btfs.trongrid.io', port: '', protocol: 'https'})
        const Buffer = window.IpfsApi().Buffer
        const buf = Buffer.from(reader.result)
        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
            if(err) {
            console.error(err)
                return
            }
            let url = `http://${ipAddr}:8080/btfs/${result[0].hash}`
            // let url = `https://gateway.btfs.trongrid.io/btfs/${result[0].hash}`
            console.log(`Url --> ${url}`)
            document.getElementById("url").innerHTML= url
            document.getElementById("url").href= url
            document.getElementById("url").target = '_blank'
            document.getElementById("output").src = url

            // save QmHash into smart contract
            window.tronWeb.contract().at(contractAddress).then((contract) => {
                contract.addImageHash(result[0].hash).send({shouldPollResponse: true}).then((qmHashReturn) => {
                    console.log("qmHashReturn: ", qmHashReturn);
                })
            });

            // add the uploaded image to the display section
            addImageSection(result[0].hash, null);
        });
    }
    const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(photo.files[0]); // Read Provided File

}

async function display() {
    console.log("triggering display");
    var display_images = document.getElementById("display_images");
    // clear all child node in display_images
    while (display_images.firstChild) {
        display_images.removeChild(display_images.firstChild);
    }
    const contract = await window.tronWeb.contract().at(contractAddress);
    const total = await contract.getHashCount().call();
    console.log("total number of images:", total.toNumber());
    for (var i = 0; i < total.toNumber(); ++i) {
        const qmHash = await contract.getHashById(i).call();
        console.log("qmHash", i, qmHash);
        addImageSection(qmHash, contract);
    }
}

setTimeout(display, 1000);
