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
}

function onRenderSavedMemes() {
    document.body.classList.remove('in-editor');
    if (!loadSavedMemes()) {
        togglePopupModal('There are no saved memes!');
        return;
    }
    document.querySelector('.nav-gallery').classList.remove('curr-page');
    document.querySelector('.nav-saved').classList.add('curr-page');
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.design-interface').style.display = 'none';
    document.querySelector('.saved-memes').style.display = 'block';
    renderSavedMemes();
}

//To the editor
function onRenderEditor(id) {
    document.body.classList.add('in-editor');
    document.querySelectorAll('.nav-li').forEach(li => li.classList.remove('curr-page'));
    initMeme();
    updateSelectedImg(id);
    document.querySelector('.design-interface').style.display = 'flex';
    document.querySelector('.gallery').style.display = 'none';
    let parentRect = gCanvas.parentNode.getBoundingClientRect();
    gCanvas.width = parentRect.width;
    gCanvas.height = parentRect.height;
    updateCanvasScale();
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

function togglePopupModal(newMsg = '') {
    document.querySelector('.popup-modal').classList.toggle('modal-shown');
    document.querySelector('.popup-modal span').innerText = newMsg;
    document.querySelector('.screen').classList.toggle('screen-shown');
}