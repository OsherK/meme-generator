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
    document.body.classList.remove('in-editor');
    if (!loadSavedMemes()) {
        alert('no saved memes!');
        return;
    }
    document.querySelector('.nav-gallery').classList.remove('curr-page');
    document.querySelector('.nav-saved').classList.add('curr-page');
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.design-interface').style.display = 'none';
    document.querySelector('.saved-memes').style.display = 'block';
    renderMemes();
}

//To the editor
function onRenderEditor(id) {
    document.body.classList.add('in-editor');
    document.querySelectorAll('.nav-li').forEach(li => li.classList.remove('curr-page'));
    initMeme();
    updateSelectedImg(id);
    document.querySelector('.design-interface').style.display = 'flex';
    document.querySelector('.gallery').style.display = 'none';
    renderCanvas();
    renderStickerButtons();
}

//Back to the gallery
function onRenderGallery() {
    document.body.classList.remove('in-editor');
    document.querySelector('.nav-saved').classList.remove('curr-page');
    document.querySelector('.nav-gallery').classList.add('curr-page');
    document.querySelector('.design-interface').style.display = 'none';
    document.querySelector('.saved-memes').style.display = 'none';
    document.querySelector('.gallery').style.display = 'block';
}