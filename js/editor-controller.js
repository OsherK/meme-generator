'use strict';

var gGrabbedItem = null;
var gDragInitPos = null;
var gCanvasScale = document.querySelector('.canvas-container').clientWidth / 600;

function updateCanvasScale() {
    gCanvasScale = document.querySelector('.canvas-container').clientWidth / 600;
}

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
    document.querySelector('.line-text').value = line.txt;
    getAllLines().forEach(line => drawText(line))
}

function renderStickers() {
    getAllStickers().forEach(sticker => {
        let drawnSticker = new Image();
        drawnSticker.src = sticker.src;
        drawnSticker.onload = () => {
            gCtx.drawImage(drawnSticker, sticker.posX * gCanvasScale, sticker.posY * gCanvasScale, sticker.size * 10 * gCanvasScale, sticker.size * 10 * gCanvasScale);
        }
    })
}

function drawText(line) {
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = line.outline;
    gCtx.fillStyle = line.filling;
    gCtx.font = `${line.size * 3 * gCanvasScale}px Impact`;
    gCtx.textAlign = 'center';
    gCtx.fillText(line.txt, line.posX * gCanvasScale, line.posY * gCanvasScale);
    gCtx.strokeText(line.txt, line.posX * gCanvasScale, line.posY * gCanvasScale);
}

function onUpdateCanvas() {
    updateLine(document.querySelector('.line-text').value);
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
    gGrabbedItem = getAllLines().find(line => {
        gCtx.font = `${line.size * 3}px Impact`;
        let txt = line.txt;
        let textWidth = gCtx.measureText(txt).width;
        let textHeight = gCtx.measureText('M').width;
        return ev.offsetX > (line.posX - (textWidth / 2)) * gCanvasScale && ev.offsetX < (line.posX + (textWidth / 2)) * gCanvasScale &&
            ev.offsetY > (line.posY - textHeight * 1.2) * gCanvasScale && ev.offsetY < (line.posY + textHeight) * gCanvasScale;
    });
    if (gGrabbedItem) {
        document.querySelector('.line-text').value = getLine().txt;
        document.body.style.cursor = 'grab';
    } else {
        gGrabbedItem = getAllStickers().find(sticker => {
                return ev.offsetX > sticker.posX * gCanvasScale && ev.offsetX < (sticker.posX + sticker.size * 10) * gCanvasScale &&
                    ev.offsetY > sticker.posY * gCanvasScale && ev.offsetY < (sticker.posY + sticker.size * 10) * gCanvasScale;
            }

        )
    }
    if (gGrabbedItem) {
        updateIndex();
        setSelectedItemType(gGrabbedItem.type);
    }
}

function onCanvasRelease() {
    gGrabbedItem = null;
    gDragInitPos = null;
}

function onCanvasMouseMove(ev) {
    ev.preventDefault();
    isOnText(ev);
    if (!gGrabbedItem) return;
    document.body.style.cursor = 'grab';
    let gCanvasScale = 600 / document.querySelector('.canvas-container').clientWidth;
    gGrabbedItem.posX += ev.movementX * gCanvasScale;
    gGrabbedItem.posY += ev.movementY * gCanvasScale;
    renderCanvas();
}

function isOnText(ev) {
    let isOn = getAllLines().some(line => {
        gCtx.font = `${line.size * 3}px Impact`;
        let txt = line.txt;
        let textWidth = gCtx.measureText(txt).width;
        let textHeight = gCtx.measureText('M').width;
        return ev.offsetX > (line.posX - (textWidth / 2)) * gCanvasScale && ev.offsetX < (line.posX + (textWidth / 2)) * gCanvasScale &&
            ev.offsetY > (line.posY - textHeight * 1.2) * gCanvasScale && ev.offsetY < line.posY * gCanvasScale;
    });
    (isOn) ? document.body.style.cursor = 'pointer': document.body.style.cursor = 'auto';
}

//Canvas touch events

function onCanvasTouchStart(ev) {
    let rect = ev.target.getBoundingClientRect();
    let offsetX = ev.targetTouches[0].pageX - rect.left;
    let offsetY = ev.targetTouches[0].pageY - rect.top;
    gDragInitPos = { offsetX, offsetY };
    gGrabbedItem = getAllLines().find(line => {
        gCtx.font = `${line.size * 3}px Impact`;
        let txt = line.txt;
        let textWidth = gCtx.measureText(txt).width;
        let textHeight = gCtx.measureText('M').width;
        return offsetX > (line.posX - (textWidth / 2)) * gCanvasScale && offsetX < (line.posX + (textWidth / 2)) * gCanvasScale &&
            offsetY > (line.posY - textHeight * 1.2) * gCanvasScale && offsetY < line.posY * gCanvasScale;
    });
    if (gGrabbedItem) {
        document.querySelector('.line-text').value = getLine().txt;
        document.body.style.cursor = 'grab';
    } else {
        gGrabbedItem = getAllStickers().find(sticker => {
            return offsetX > sticker.posX * gCanvasScale && offsetX < (sticker.posX + sticker.size * 10) * gCanvasScale &&
                offsetY > sticker.posY * gCanvasScale && offsetY < (sticker.posY + sticker.size * 10) * gCanvasScale;
        })
    }
    if (gGrabbedItem) {
        updateIndex();
        setSelectedItemType(gGrabbedItem.type);
    }
}

function onCanvasTouchMove(ev) {
    if (!gGrabbedItem) return;
    let gCanvasScale = 600 / document.querySelector('.canvas-container').clientWidth;
    let rect = ev.target.getBoundingClientRect();
    let offsetX = ev.targetTouches[0].pageX - rect.left;
    let offsetY = ev.targetTouches[0].pageY - rect.top;
    let movementX = (offsetX - gDragInitPos.offsetX) * gCanvasScale;
    let movementY = (offsetY - gDragInitPos.offsetY) * gCanvasScale;
    gDragInitPos = { offsetX, offsetY };
    gGrabbedItem.posX += movementX;
    gGrabbedItem.posY += movementY;

    renderCanvas();
}

//Edit Button Functions



function onAddLine() {
    addLine();
    renderCanvas();
    document.querySelector('.line-text').value = getLine().txt;

}

function onAddSticker(id) {
    addSticker(id);
    renderCanvas();
}

function onUpdateItemSize(changeBy) {
    if (getMeme().selectedItemType === 'line') updateLineFontSize(changeBy);
    else updateStickerSize(changeBy);
    renderCanvas();
}

function onColorChange(newColor, toChange) {
    changeColor(newColor, toChange);
    renderCanvas();
}

function onDelete() {
    deleteItem();
    if (!getMeme().lines.length) document.querySelector('.line-text').value = '';
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
    togglePopupModal('saved!');
}