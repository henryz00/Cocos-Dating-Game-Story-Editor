//----------------------------editor sidebar

var currentEdit; //current editing card object
var cardsArray;  //cards object array

function openEditor() {
    let editor = document.getElementById("editor")
    editor.style.width = "40%";
    document.getElementById("main").style.marginRight = editor.style.width;
}

function closeEditor() {
    document.getElementById("editor").style.width = "0";
    document.getElementById("main").style.marginRight= "0";
}

function openEditorWithCard(cardId){
    currentEdit = idToCard(cardId)
    openEditor()
    updateEditorContent(currentEdit)
}

function openEditorWithNew(){
    currentEdit = new Object()
    openEditor()
    createNewEditorContent()
}

//update material textfield by id
function updateTextfield(id, content){
    document.getElementById(id).MaterialTextfield.change(content)
}

//run once only, create three repeated actions edit block
function createEditorActionsHTML() {
    var template = document.getElementById("action_template").innerHTML;
    var html = ""
    html += template.replace(/#value#/g, 1);
    html += template.replace(/#value#/g, 2);
    html += template.replace(/#value#/g, 3);
    document.getElementById("actions").innerHTML= html;
}
createEditorActionsHTML()

//update editor content with card object
function updateEditorContent(cardObject){
    document.getElementById("editor_title").innerHTML = `编辑卡片${cardObject.cardId}` 
    
    updateTextfield("eCardId", cardObject.cardId )
    document.getElementById("cardType").value = cardObject.cardType
    document.getElementById("timeLimit").value = cardObject.timeLimit
    updateTextfield("eInstructionText", cardObject.instructionText )
    updateTextfield("eCardText", cardObject.cardText )
    updateTextfield("eCardImage", cardObject.cardImage )
    updateTextfield("eComment", cardObject.comment ) 
    cardObject.actions.forEach(element => {
        document.getElementById(`actionTitle${element.order}`).innerHTML = actionSelector(cardObject.cardType, element.order)
        updateTextfield(`eActionCardText${element.order}`, element.text ) 
        updateTextfield(`eNextCardId${element.order}`, element.nextCardId ) 
        updateTextfield(`eInterest${element.order}`, element.playerData[0] ) 
        updateTextfield(`eLove${element.order}`, element.playerData[1] ) 
        updateTextfield(`eWealth${element.order}`, element.playerData[2] ) 
        updateTextfield(`eFamily${element.order}`, element.playerData[3] ) 
    });
}

//update editor content with empty fields
function createNewEditorContent(){
    document.getElementById("editor_title").innerHTML = `新建卡片` 
    updateTextfield("eCardId", null ) 
    document.getElementById("cardType").value = "swipe"
    document.getElementById("timeLimit").value = 0
    updateTextfield("eInstructionText", null ) 
    updateTextfield("eCardText", null ) 
    updateTextfield("eCardImage", null ) 
    updateTextfield("eComment", null ) 
    for(var i = 1; i < 4; i++){
        document.getElementById(`actionTitle${i}`).innerHTML = actionSelector("swipe", i)
        updateTextfield(`eActionCardText${i}`, null ) 
        updateTextfield(`eNextCardId${i}`, null ) 
        updateTextfield(`eInterest${i}`, 0 )
        updateTextfield(`eLove${i}`, 0 ) 
        updateTextfield(`eWealth${i}`, 0 ) 
        updateTextfield(`eFamily${i}`, 0 ) 
    };
}

//save editor content to object
function saveEditorContent(){
    var newCardObject = new Object;
    newCardObject.cardId = document.getElementById("cardId").value
    newCardObject.cardType = document.getElementById("cardType").value
    newCardObject.timeLimit = document.getElementById("timeLimit").value
    newCardObject.instructionText = document.getElementById("instructionText").value
    newCardObject.cardText = document.getElementById("cardText").value
    newCardObject.cardImage = document.getElementById("cardImage").value
    newCardObject.comment = document.getElementById("comment").value
    var actionsObject = [new Object, new Object, new Object]
    for(var i = 0; i < 3; i++){
        actionsObject[i].text = document.getElementById(`actionCardText${i+1}`).value
        actionsObject[i].nextCardId = document.getElementById(`nextCardId${i+1}`).value
        actionsObject[i].playerData = [ document.getElementById(`interest${i+1}`).value,
                                        document.getElementById(`love${i+1}`).value,
                                        document.getElementById(`wealth${i+1}`).value,
                                        document.getElementById(`family${i+1}`).value]
    }
    newCardObject.actions = actionsObject;
    return newCardObject;
}


function updateActionTitles(){
    var type = document.getElementById("cardType").value;
    for(var i = 1; i < 4; i++){
        document.getElementById(`actionTitle${i}`).innerHTML = actionSelector(type, i)
    }
}


//--------------------------------card display

//find card by id in cards array
function idToCard(cardId){
    for(var i=0; i<cardsArray.length; i++) {
        if(cardsArray[i].cardId === cardId){
            return cardsArray[i];
        }
    }
    return null;
}

//create a single card display block
function createCardHTML(cardObject) {
    var template = document.getElementById("card_template").innerHTML;
    var html = template.replace(/#cardId#/g, cardObject.cardId)
                        .replace(/#instructionText#/g, cardObject.instructionText)
                        .replace(/#cardText#/g, nullChecker(cardObject.cardText))
                        .replace(/#cardImage#/g, nullChecker(cardObject.cardImage))
                        .replace(/#comment#/g, nullChecker(cardObject.comment))
                        .replace(/#cardType#/g, cardTypeSelector(cardObject.cardType))
                        .replace(/#timeLimit#/g, cardObject.timeLimit == 0 ? "否":"是" );

    cardObject.actions.forEach(element => {
        var effect = `好感${element.playerData[0]}，情趣${element.playerData[1]}，财富${element.playerData[2]}，亲友${element.playerData[3]} - 转入${element.nextCardId}`
        html = html.replace(`#action${element.order}Title#`, actionSelector(cardObject.cardType, element.order))
                    .replace(`#action${element.order}Text#`, element.text)
                    .replace(`#action${element.order}effect#`, effect);
    });

    return html;
}


//create a list of card display blocks
function updateAllCardsHTML(cardsObject){
    document.getElementById("cards").innerHTML = ""
    cardsObject.forEach(element => {
        document.getElementById("cards").innerHTML += createCardHTML(element)
    })
}


//--------------------------------selectors
function cardTypeSelector(cardType){
    switch(cardType){
        case "swipe":
            return "左右滑动";
        case "chat":
            return "微信聊天";
        case "moments":
            return "微信朋友圈";
        case "fail":
            return "游戏失败";
        case "success":
            return "游戏成功";
        default:
            return "未知";
    }
}

function actionSelector(cardType, actionOrder){
    if(cardType == "swipe"){
        switch(actionOrder){
            case 1:
                return "左滑选项";
            case 2:
                return "右滑选项";
            case 3:
                return "超时选项";
        }
    }
    if(cardType == "chat"){
        switch(actionOrder){
            case 1:
                return "微信聊天回复1";
            case 2:
                return "微信聊天回复2";
            case 3:
                return "微信聊天回复3";
        }
    }
    if(cardType == "moments"){
        switch(actionOrder){
            case 1:
                return "微信朋友圈评论1";
            case 2:
                return "微信朋友圈评论2";
            case 3:
                return "微信朋友圈评论3";
        }
    }
    return "此项不可用";
}

function nullChecker(content){
    return content? content : "无";
}







//template--------------- delete later
var templatePack = [{
    cardId: "01",
    instructionText: "一小时后，你到达战场。电影院门外的女朋友好像在发脾气。",
    cardText: null,
    cardImage: "1222",
    cardType: "swipe",
    timeLimit: 1,
    comment: null,
    actions: [{
        order: 1,
        text: "“宝贝，我错了！”赶紧道歉",
        nextCardId: "02a",
        playerData: [-1,0,0,0]
    },{
        order: 2,
        text: "“宝贝，谁欺负你了？”",
        nextCardId: "02c",
        playerData: [1,1,0,0]
    },{
        order: 3,
        text: "沉默",
        nextCardId: "02b",
        playerData: [-2,0,0,0]
    }]
},{
    cardId: "01",
    instructionText: "一小时后，你到达战场。电影院门外的女朋友好像在发脾气。",
    cardText: null,
    cardImage: null,
    cardType: "swipe",
    timeLimit: 1,
    comment: null,
    actions: [{
        order: 1,
        text: "“宝贝，我错了！”赶紧道歉",
        nextCardId: "02a",
        playerData: [-1,0,0,0]
    },{
        order: 2,
        text: "“宝贝，谁欺负你了？”",
        nextCardId: "02c",
        playerData: [1,1,0,0]
    },{
        order: 3,
        text: "沉默",
        nextCardId: "02b",
        playerData: [-2,0,0,0]
    }]
}];

cardsArray = templatePack;

updateAllCardsHTML(cardsArray)