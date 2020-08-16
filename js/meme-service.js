'use strict';

var gKeywords = { 'happy': 0, 'person': 0, 'baby': 0, 'dog': 0, 'cat': 0, 'animal': 0, 'lotr': 0, 'barack obama': 0, 'putin': 0 };
var gStickers = [
    { id: 1, url: 'img/stickers/birthday-party-hat.png' },
    { id: 2, url: 'img/stickers/bowler-hat.png' },
    { id: 3, url: 'img/stickers/jotaro-hat.png' },
    { id: 4, url: 'img/stickers/shocked.png' },
    { id: 5, url: 'img/stickers/sunglasses.png' },
]
var gImgs = [
    { id: 1, url: 'img/meme-imgs/1.jpg', keywords: ['person'] },
    { id: 2, url: 'img/meme-imgs/2.jpg', keywords: ['dog', 'animal'] },
    { id: 3, url: 'img/meme-imgs/3.jpg', keywords: ['baby', 'dog', 'animal', 'person'] },
    { id: 4, url: 'img/meme-imgs/4.jpg', keywords: ['cat', 'animal'] },
    { id: 5, url: 'img/meme-imgs/5.jpg', keywords: ['baby', 'person'] },
    { id: 6, url: 'img/meme-imgs/6.jpg', keywords: ['person'] },
    { id: 7, url: 'img/meme-imgs/7.jpg', keywords: ['baby', 'person'] },
    { id: 8, url: 'img/meme-imgs/8.jpg', keywords: ['person'] },
    { id: 9, url: 'img/meme-imgs/9.jpg', keywords: ['baby', 'person', 'happy'] },
    { id: 10, url: 'img/meme-imgs/10.jpg', keywords: ['person', 'barack obama', 'happy'] },
    { id: 11, url: 'img/meme-imgs/11.jpg', keywords: ['person', 'kiss'] },
    { id: 12, url: 'img/meme-imgs/12.jpg', keywords: ['person'] },
    { id: 13, url: 'img/meme-imgs/13.jpg', keywords: ['person', 'leonardo'] },
    { id: 14, url: 'img/meme-imgs/14.jpg', keywords: ['person', 'matrix'] },
    { id: 15, url: 'img/meme-imgs/15.jpg', keywords: ['person', 'lotr'] },
    { id: 16, url: 'img/meme-imgs/16.jpg', keywords: ['person', 'star treck'] },
    { id: 17, url: 'img/meme-imgs/17.jpg', keywords: ['person', 'putin'] },
    { id: 18, url: 'img/meme-imgs/18.jpg', keywords: ['toy'] },
];
var gMeme;

function getImgURL() {
    return gImgs.find(img => img.id === gMeme.selectedImgId).url;
}

function getLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function getAllLines() {
    return gMeme.lines;
}

function getAllStickers() {
    return gMeme.stickers;
}

function getSelectedItem() {
    if (gMeme.selectedItemType === 'line') return gMeme.lines[gMeme.selectedLineIdx];
    else return gMeme.stickers[gMeme.selectedStickerIdx];
}

function updateLine(newTxt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = newTxt;
}

function getImgsForDisplay(strKey) {
    let imgs = [];
    gImgs.forEach(img => {
        if (img.keywords.some(key => key.includes(strKey))) imgs.push(img);
    })
    return imgs;
}

function increaseKeywordCount(key) {
    gKeywords[key]++;
}

function getKeywords() {
    let res = [];
    for (let key in gKeywords) {
        res.push({ keyword: key, value: gKeywords[key] });
    }
    return res;
}

function addKeyword(newKey) {
    let keywords = getKeywords();
    if (!keywords.some(keyword => keyword.keyword === newKey)) {
        gKeywords[newKey] = 1;
    }
}

function updateIndex() {
    if (gGrabbedItem.type === 'line') {
        gMeme.selectedLineIdx = gMeme.lines.findIndex(line => line === gGrabbedItem);
    } else {
        gMeme.selectedStickerIdx = gMeme.stickers.findIndex(sticker => sticker === gGrabbedItem);
    }
}

function setSelectedItemType(type) {
    gMeme.selectedItemType = type;
}

function getMeme() {
    return gMeme;
}

function setMemeData(data) {
    gMeme = data;
}

function updateSelectedImg(id) {
    gMeme.selectedImgId = id;
}

function updateLineFontSize(num) {
    gMeme.lines[gMeme.selectedLineIdx].size += num;
    if (gMeme.lines[gMeme.selectedLineIdx].size < 1) gMeme.lines[gMeme.selectedLineIdx].size = 1;
}

function updateStickerSize(num) {
    gMeme.stickers[gMeme.selectedStickerIdx].size += num;
    if (gMeme.stickers[gMeme.selectedStickerIdx].size > 20) gMeme.stickers[gMeme.selectedStickerIdx].size = 20;
    else if (gMeme.stickers[gMeme.selectedStickerIdx].size < 1) gMeme.stickers[gMeme.selectedStickerIdx].size = 1;
}

function deleteItem() {
    if (gMeme.selectedItemType === 'line') {
        if (gMeme.lines.length) {
            gMeme.lines.splice(gMeme.selectedLineIdx, 1);
            gMeme.selectedLineIdx = 0;
        }
    } else {
        if (gMeme.stickers.length) gMeme.stickers.splice(gMeme.selectedStickerIdx, 1);
    }
}

function changeColor(newColor, toChange) {
    let selectedItem = getSelectedItem();
    if (selectedItem.type !== 'line') return;
    selectedItem[toChange] = newColor;
}

function addLine() {
    gMeme.lines.push({
        type: 'line',
        txt: 'Extra Text',
        size: 20,
        align: 'left',
        filling: 'white',
        outline: 'black',
        posY: gCanvas.width / 2,
        posX: gCanvas.width / 2

    });
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
    gMeme.selectedItemType = 'line';
}

function addSticker(id) {
    gMeme.stickers.push({
        type: 'sticker',
        src: gStickers[id - 1].url,
        posX: gCanvas.width / 2,
        posY: gCanvas.height / 2,
        size: 10
    });
    gMeme.selectedStickerIdx = gMeme.stickers.length - 1;
    gMeme.selectedItemType = 'sticker';
}

function initMeme() {
    gMeme = {
        selectedItemType: 'line',
        selectedImgId: 1,
        selectedLineIdx: 0,
        selectedStickerIdx: 0,
        lines: [{
            type: 'line',
            txt: 'Top Text',
            size: 20,
            align: 'left',
            filling: 'white',
            outline: 'black',
            posY: 60,
            posX: gCanvas.width / 2
        }, {
            type: 'line',
            txt: 'Bottom Text',
            size: 20,
            align: 'left',
            filling: 'white',
            outline: 'black',
            posY: 540,
            posX: gCanvas.width / 2
        }],
        stickers: []
    }
}