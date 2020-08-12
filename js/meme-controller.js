'use strict';

var gGrabbedItem = null;

function renderCanvas(id) {
    var img = new Image()
    img.src = getImgURL(id);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        renderText();
    }
}

function renderText() {
    let line = getLine();
    document.querySelector('#line-text').value = line.txt;
    getAllLines().forEach(line => drawText(line))
}


function drawText(line) {
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size * 3}px Impact`;
    gCtx.textAlign = 'center';
    gCtx.fillText(line.txt, line.lineX, line.lineY);
    gCtx.strokeText(line.txt, line.lineX, line.lineY);
}

//Canvas clicked functions
function onCanvasDown(ev) {
    let lines = getAllLines();
    gGrabbedItem = lines.find(line => {
        gCtx.font = `${line.size * 3}px Impact`;
        let txt = line.txt;
        let textWidth = gCtx.measureText(txt).width;
        let textHeight = gCtx.measureText('M').width;
        console.log(textHeight);
        return ev.offsetX > (line.lineX - (textWidth / 2)) * (700 / gCanvas.width) && ev.offsetX < (line.lineX + (textWidth / 2)) * (700 / gCanvas.width) &&
            ev.offsetY > (line.lineY - textHeight * 1.2) * (700 / gCanvas.width) && ev.offsetY < line.lineY * (700 / gCanvas.width);
    })
    if (gGrabbedItem) {
        console.log(gGrabbedItem);
        gMeme.selectedLineIdx = gMeme.lines.findIndex(line => line === gGrabbedItem);
        document.querySelector('#line-text').value = getLine().txt;
    }
    console.log('Grabbed:', gGrabbedItem);
}

function onCanvasUp() {
    gGrabbedItem = null;
}

function onCanvasMove(ev) {
    if (!gGrabbedItem) return;
    gGrabbedItem.lineX += ev.movementX * (700 / gCanvas.width);
    gGrabbedItem.lineY += ev.movementY * (700 / gCanvas.width);
    renderCanvas();
}

function onUpdateCanvas() {
    updateLine();
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

function canvasToData() {
    return gCanvas.toDataURL();
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