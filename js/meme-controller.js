'use strict';

var gGrabbedItem = null;
var gDragInitPos = null;

function renderCanvas(id) {
    var img = new Image()
    img.src = getImgURL(id);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        renderText();
        renderStickers();
    }
}

function renderText() {
    let line = getLine();
    document.querySelector('#line-text').value = line.txt;
    getAllLines().forEach(line => drawText(line))
}

function renderStickers() {
    getAllStickers().forEach(sticker => {
        let drawnSticker = new Image();
        drawnSticker.src = sticker.src;
        drawnSticker.onload = () => {
            gCtx.drawImage(drawnSticker, sticker.posX, sticker.posY, sticker.sizeX, sticker.sizeY);
        }
    })
}

function drawText(line) {
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size * 3}px Impact`;
    gCtx.textAlign = 'center';
    gCtx.fillText(line.txt, line.posX, line.posY);
    gCtx.strokeText(line.txt, line.posX, line.posY);
}

function onUpdateCanvas() {
    updateLine();
    renderCanvas();
}

function canvasToData() {
    return gCanvas.toDataURL();
}

function renderStickerButtons() {
    let strHtml = '';
    gStickers.forEach(sticker => {
        strHtml += `
        <img onclick="onAddSticker(${sticker.id})" class="add-sticker-icon" src="${sticker.url}">
        `
    });
    document.querySelector('.sticker-select-list').innerHTML = strHtml;
}


//Canvas mouse functions
function onCanvasMouseDown(ev) {
    let aspectRatio = document.querySelector('.canvas-container').clientWidth / 600;
    gGrabbedItem = getAllLines().find(line => {
        gCtx.font = `${line.size * 3}px Impact`;
        let txt = line.txt;
        let textWidth = gCtx.measureText(txt).width;
        let textHeight = gCtx.measureText('M').width;
        return ev.offsetX > (line.posX - (textWidth / 2)) * aspectRatio && ev.offsetX < (line.posX + (textWidth / 2)) * aspectRatio &&
            ev.offsetY > (line.posY - textHeight * 1.2) * aspectRatio && ev.offsetY < line.posY * aspectRatio;
    });

    if (gGrabbedItem) {
        gMeme.selectedLineIdx = gMeme.lines.findIndex(line => line === gGrabbedItem);
        document.querySelector('#line-text').value = getLine().txt;
        document.body.style.cursor = 'grab';
    } else {
        gGrabbedItem = getAllStickers().find(sticker => {
            return ev.offsetX > sticker.posX * aspectRatio && ev.offsetX < (sticker.posX + sticker.sizeX) * aspectRatio &&
                ev.offsetY > sticker.posY * aspectRatio && ev.offsetY < (sticker.posY + sticker.sizeY) * aspectRatio;
        })
    }
}

function onCanvasRelease() {
    gGrabbedItem = null;
    gDragInitPos = null;
}

function onCanvasMouseMove(ev) {
    isOnText(ev);
    if (!gGrabbedItem) return;
    document.body.style.cursor = 'grab';
    let aspectRatio = 600 / document.querySelector('.canvas-container').clientWidth;
    gGrabbedItem.posX += ev.movementX * aspectRatio;
    gGrabbedItem.posY += ev.movementY * aspectRatio;
    renderCanvas();
}

function isOnText(ev) {
    let aspectRatio = document.querySelector('.canvas-container').clientWidth / 600;
    let isOn = getAllLines().some(line => {
        gCtx.font = `${line.size * 3}px Impact`;
        let txt = line.txt;
        let textWidth = gCtx.measureText(txt).width;
        let textHeight = gCtx.measureText('M').width;
        return ev.offsetX > (line.posX - (textWidth / 2)) * aspectRatio && ev.offsetX < (line.posX + (textWidth / 2)) * aspectRatio &&
            ev.offsetY > (line.posY - textHeight * 1.2) * aspectRatio && ev.offsetY < line.posY * aspectRatio;
    });
    (isOn) ? document.body.style.cursor = 'pointer': document.body.style.cursor = 'auto';
}

//Canvas touch events

function onCanvasTouchStart(ev) {
    let aspectRatio = document.querySelector('.canvas-container').clientWidth / 600;
    let rect = ev.target.getBoundingClientRect();
    let offsetX = ev.targetTouches[0].pageX - rect.left;
    let offsetY = ev.targetTouches[0].pageY - rect.top;
    gDragInitPos = { offsetX, offsetY };
    gGrabbedItem = getAllLines().find(line => {
        gCtx.font = `${line.size * 3}px Impact`;
        let txt = line.txt;
        let textWidth = gCtx.measureText(txt).width;
        let textHeight = gCtx.measureText('M').width;
        return offsetX > (line.posX - (textWidth / 2)) * aspectRatio && offsetX < (line.posX + (textWidth / 2)) * aspectRatio &&
            offsetY > (line.posY - textHeight * 1.2) * aspectRatio && offsetY < line.posY * aspectRatio;
    });
    if (gGrabbedItem) {
        gMeme.selectedLineIdx = gMeme.lines.findIndex(line => line === gGrabbedItem);
        document.querySelector('#line-text').value = getLine().txt;
        document.body.style.cursor = 'grab';
    }
}

function onCanvasTouchMove(ev) {
    if (!gGrabbedItem) return;
    let aspectRatio = 600 / document.querySelector('.canvas-container').clientWidth;
    let rect = ev.target.getBoundingClientRect();
    let offsetX = ev.targetTouches[0].pageX - rect.left;
    let offsetY = ev.targetTouches[0].pageY - rect.top;
    let movementX = (offsetX - gDragInitPos.offsetX) * aspectRatio;
    let movementY = (offsetY - gDragInitPos.offsetY) * aspectRatio;
    gDragInitPos = { offsetX, offsetY };
    gGrabbedItem.posX += movementX;
    gGrabbedItem.posY += movementY;

    renderCanvas();
}

//Edit Button Functions

function onUpdateFont(num) {
    updateLineFontSize(num);
    renderCanvas();
}

function onUpdateHeight(num) {
    updateLineHeight(num);
    renderCanvas();
}

function onSwitchLine() {
    switchLine();
    document.querySelector('#line-text').value = getLine().txt;
}

function onAddLine() {
    addLine();
    renderCanvas();
}

function onDownload() {
    const data = canvasToData();
    let a = document.createElement('a');
    a.href = data;
    a.download = 'my-meme.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function onSaveMeme() {
    let savedMemes = loadSavedMemes();
    if (!savedMemes) savedMemes = [];
    let img = new Image();
    img.src = canvasToData();
    savedMemes.push({
        imgData: canvasToData(),
        memeData: getMeme()
    });
    saveMeme(savedMemes);
}

//Back to the gallery
function onRenderGallery() {
    document.querySelector('.design-interface').style.display = 'none';
    document.querySelector('.gallery').style.display = 'block';
}