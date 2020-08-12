'use strict';

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [
    { id: 1, url: 'img/meme-imgs/1.jpg', keywords: ['human'] },
    { id: 2, url: 'img/meme-imgs/2.jpg', keywords: ['dog', 'animal'] },
    { id: 3, url: 'img/meme-imgs/3.jpg', keywords: ['baby', 'dog', 'animal', 'human'] },
    { id: 4, url: 'img/meme-imgs/4.jpg', keywords: ['cat', 'animal'] },
    { id: 5, url: 'img/meme-imgs/5.jpg', keywords: ['baby', 'human'] },
    { id: 6, url: 'img/meme-imgs/6.jpg', keywords: ['human'] },
    { id: 7, url: 'img/meme-imgs/7.jpg', keywords: ['baby', 'human'] },
    { id: 8, url: 'img/meme-imgs/8.jpg', keywords: ['human'] },
    { id: 9, url: 'img/meme-imgs/9.jpg', keywords: ['baby', 'human'] },
    { id: 10, url: 'img/meme-imgs/10.jpg', keywords: ['human'] },
    { id: 11, url: 'img/meme-imgs/11.jpg', keywords: ['human', 'kiss'] },
    { id: 12, url: 'img/meme-imgs/12.jpg', keywords: ['human'] },
    { id: 13, url: 'img/meme-imgs/13.jpg', keywords: ['human', 'leonardo decaprio'] },
    { id: 14, url: 'img/meme-imgs/14.jpg', keywords: ['human', 'matrix'] },
    { id: 15, url: 'img/meme-imgs/15.jpg', keywords: ['human', 'lord of the rings'] },
    { id: 16, url: 'img/meme-imgs/16.jpg', keywords: ['human', 'star treck'] },
    { id: 17, url: 'img/meme-imgs/17.jpg', keywords: ['human', 'putin'] },
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

function updateLine() {
    let newTxt = document.querySelector('#line-text').value;
    gMeme.lines[gMeme.selectedLineIdx].txt = newTxt;
}

function getImgsForDisplay(strKey) {
    let imgs = [];
    gImgs.forEach(img => {
        if (img.keywords.some(key => key.includes(strKey))) imgs.push(img);
    })
    return imgs;
}

function getMeme() {
    return gMeme;
}

function setMemeData(data) {
    gMeme = data;
}

function updateSelectedImg(id) {
    gMeme.selectedImgId = id
}

function updateLineFontSize(num) {
    gMeme.lines[gMeme.selectedLineIdx].size += num;
}

function updateLineHeight(num) {
    gMeme.lines[gMeme.selectedLineIdx].lineY += num;
}

function switchLine() {
    gMeme.selectedLineIdx++;
    if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function initMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [{
            txt: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red',
            lineY: 60,
            lineX: gCanvas.width / 2
        }, {
            txt: 'Because I have shit taste',
            size: 20,
            align: 'left',
            color: 'red',
            lineY: 640,
            lineX: gCanvas.width / 2
        }, ]
    }
}