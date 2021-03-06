var currentPlayerValue = 50


function setRunCard(id){
    console.log(id)
    updateTextfield("eSkipCardId", id)
    if(document.getElementById("autoScroll").checked){
        scrollTo(id)
    }

    let runBlock = document.getElementById("runBlock")
    // runBlock.classList.toggle('flip');

    let card = cardsArray[findIndex(id)]
    document.getElementById("runInstruction").innerHTML = card.instructionText;
    for(var i = 0; i < 3; i++){
        let action = document.getElementById(`runAction${i+1}`);
        if(card.actions[i].text.length > 1){
            action.innerHTML = `【${actionSelector(card.cardType, card.actions[i].order)}】${card.actions[i].text}`;
        }else{
            action.innerHTML = "(无文本)"
        }

        let nextCardId = card.actions[i].nextCardId
        console.log(nextCardId)
        if(nextCardId){
            let nextId = nextCardId.toString()
            let valueChange = card.actions[i].playerData
            document.getElementById(`runAction${i+1}`).setAttribute("href", nextId)
            document.getElementById(`runAction${i+1}`).onclick = function(){
                updatePlayerValue(valueChange)
                setRunCard(nextId)
            }
        }else{
            action.onclick = ""
        }
            
    }
    var history = document.getElementById("runHistory").innerHTML
    history = history + `<a class="run-history-btn mdl-button mdl-js-button mdl-button--primary" href="javascript:scrollTo('${id}');updateTextfield('eSkipCardId', '${id}')">${id}</a>`
    document.getElementById("runHistory").innerHTML = history

    runBlock.classList.remove("success_card_background")
    runBlock.classList.remove("fail_card_background")
    if(card.cardType=="success"){
        runBlock.classList.add("success_card_background")
    }else if(card.cardType=="fail"){
        runBlock.classList.add("fail_card_background")
    }
}

function updatePlayerValue(valueChange){

    currentPlayerValue += valueChange? parseInt(valueChange) * 10 : 0;

    document.querySelector('#pInterest').MaterialProgress.setProgress(currentPlayerValue);

    document.querySelector('#vInterest').innerHTML = currentPlayerValue;
}


function startNewRunTest(){
    currentPlayerValue = 50
    updatePlayerValue(0)
    document.getElementById("runBlock").setAttribute("style","");
    document.getElementById("runHistory").innerHTML = ""
    setRunCard(cardsArray[0].cardId)
}


function skipToCard(){
    setRunCard(document.getElementById("skipCardId").value)
}