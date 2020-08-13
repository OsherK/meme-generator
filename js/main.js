'use strict';

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    initMeme();
    renderImgs();
    document.querySelector('.design-interface').style.display = 'none';
    document.querySelector('.saved-memes').style.display = 'none';
    renderKeywordList();
    getKeywordsArray();
}

function onRenderSavedMemes() {
    if (!loadSavedMemes()) {
        alert('no saved memes!');
        return;
    }
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.design-interface').style.display = 'none';
    document.querySelector('.saved-memes').style.display = 'block';
    renderMemes();
}