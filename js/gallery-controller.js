'use strict';



function renderImgs(str = '') {
    let imgs = getImgsForDisplay(str.toLowerCase());
    let strHtml = '';
    imgs.forEach(img => {
        let keyStr = '\n';
        img.keywords.forEach(str => keyStr += `${str}, \n`);
        strHtml += `
        <div class="gallery-item" onclick="onRenderEditor(${img.id})">
            <img src="${img.url}" width="250" height="250">
                <div class="img-details">
                    <p>keywords:${keyStr}</p>
                </div>
        </div>
        `
    })
    document.querySelector('.gallery-grid').innerHTML = strHtml;
}

function onSearchInput(val) {
    for (let key in gKeywords) {
        if (key === val) increaseKeywordCount(key);
    }
    renderKeywordList();
    renderImgs(val);
}

function renderKeywordList() {
    let listHtml = '';
    let dropDownListHtml = '';
    let keywordsArray = getKeywordsArray();
    for (let i = 0; i < keywordsArray.length; i++) {
        let fontSize = 15 + keywordsArray[i].value;
        if (fontSize >= 25) fontSize = 25;
        let liHtml = `
        <li style="font-size:${fontSize}px" class="no-select search-li" onclick="onKeywordClick('${keywordsArray[i].keyword}')"> ${keywordsArray[i].keyword}</li>
        `
        if (i < 5) listHtml += liHtml;
        else dropDownListHtml += liHtml;
    }
    document.querySelector('.keyword-list').innerHTML = listHtml;
    document.querySelector('.drop-down-list').innerHTML = dropDownListHtml;
}

function onKeywordClick(val) {
    increaseKeywordCount(val);
    renderKeywordList();
    document.querySelector('.search-bar').value = val;
    renderImgs(val);
}