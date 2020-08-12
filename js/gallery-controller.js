'use strict';



function renderImgs(str = '') {
    let imgs = getImgsForDisplay(str.toLocaleLowerCase());
    let strHtml = '';
    imgs.forEach(img => {
        strHtml += `
        <div class="gallery-item" onclick="onRenderEditor(${img.id})">
            <img src="${img.url}" width="250" height="250">
                <div class="img-details">
                    <p>${img.keywords[0]}</p>
                </div>
        </div>
        `
    })
    document.querySelector('.gallery-grid').innerHTML = strHtml;
}

function onSearchInput() {
    renderImgs(document.querySelector('#search-bar').value);
}

function renderKeywordList() {
    let strHtml = '';
    gKeywords.forEach(key => {
        strHtml += `
        <li onclick="renderImgs(${key})">
        `
    })
}

//To the editor
function onRenderEditor(id) {
    initMeme();
    updateSelectedImg(id);
    document.querySelector('.design-interface').style.display = 'flex';
    document.querySelector('.gallery').style.display = 'none';
    renderCanvas();
    renderText();
}