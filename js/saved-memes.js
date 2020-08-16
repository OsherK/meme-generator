'use strict';

function loadSavedMemes() {
    return JSON.parse(localStorage.getItem('saved-memes'));
}

function saveMeme(memes) {
    localStorage.setItem('saved-memes', JSON.stringify(memes));
}

function renderSavedMemes() {
    let strHtml = '';
    let memes = loadSavedMemes();
    memes.forEach(meme => {
        strHtml += `
        <div class="gallery-item" onclick='onRenderSavedImage(${JSON.stringify(meme.memeData)})'>
            <img src="${meme.imgData}" width="250" height="250">
        </div>
        `
    })

    document.querySelector('.saved-memes-grid').innerHTML = strHtml;
}

//Edit the selected meme
function onRenderSavedImage(memeData) {
    setMemeData(memeData);
    document.querySelector('.design-interface').style.display = 'flex';
    document.querySelector('.saved-memes').style.display = 'none';
    renderCanvas();
    renderText();
}