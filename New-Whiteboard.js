"use strict";

var background;
var baseCanvas;
var canvas;
var consolidatedCanvas;
var backgroundContext;
var baseCanvasContext;
var context;
var consolidatedCanvasContext;
var canvases;
var maxNumCanvases;

var isDrawing;
var index;

var x;
var y;
var startX;
var startY;
var width;
var height;
var canvasWidth;
var canvasHeight;

var nextCanvas;
var increment;
var clearElement;
var undoElement;
var openElement;
var saveElement;

var redElement;
var orangeElement;
var yellowElement;
var greenElement;
var blueElement;
var indigoElement;
var violetElement;
var greyElement;

var extraThinElement;
var thinElement;
var mediumElement;
var thickElement;
var extraThickElement;

var drawElement;
var eraseElement;

var freeDrawElement;
var lineElement;
var rectangleElement;
var ovalElement;
var heartElement;

var selectedColor = null;
var selectedSize = null;
var selectedPencil = null;
var selectedShape = null;

var mouseDown;
var mouseMove;
var mouseUp;

var clear;
var undo;
var open;
var save;
var consolidate;

var selectColor;
var selectSize;
var selectPencil;
var selectShape;

var dataURL;
var maxNumSavedImages;
var numSavedImages;

var blankData;
var linedData;
var graphData;

window.onload = function () {
    canvasWidth = 640;
    canvasHeight = 360;
    
    background = document.createElement("canvas");
    backgroundContext = background.getContext("2d");
    background.width = canvasWidth;
    background.height = canvasHeight;
    backgroundContext.drawImage(document.getElementById("blank"), 0, 0, canvasWidth, canvasHeight);
    blankData = background.toDataURL("0/png");
    backgroundContext.drawImage(document.getElementById("lined"), 0, 0, canvasWidth, canvasHeight);
    linedData = background.toDataURL("1/png");
    backgroundContext.drawImage(document.getElementById("graph"), 0, 0, canvasWidth, canvasHeight);
    graphData = background.toDataURL("2/png");
    document.body.appendChild(background);
    
    baseCanvas = document.createElement("canvas");
    baseCanvasContext = baseCanvas.getContext("2d");
    baseCanvas.width = canvasWidth;
    baseCanvas.height = canvasHeight;
    document.body.appendChild(baseCanvas);
    
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    document.body.appendChild(canvas);
    
    maxNumCanvases = 10;
    canvases = [background, baseCanvas, canvas];
    
    maxNumSavedImages = 4;
    localStorage.setItem("0", blankData);
    localStorage.setItem("1", linedData);
    localStorage.setItem("2", graphData);
    numSavedImages = 3;
    
	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;
	canvas.onmousemove = mouseMove;
    
    clearElement = document.getElementById("clear");
    undoElement = document.getElementById("undo");
    openElement = document.getElementById("open");
    saveElement = document.getElementById("save");
    
    clearElement.onclick = clear;
    undoElement.onclick = undo;
    openElement.onclick = open;
    saveElement.onclick = save;
    
    redElement = document.getElementById("red");
    orangeElement = document.getElementById("orange");
    yellowElement = document.getElementById("yellow");
    blueElement = document.getElementById("blue");
    greenElement = document.getElementById("green");
    indigoElement = document.getElementById("indigo");
    violetElement = document.getElementById("violet");
    greyElement = document.getElementById("grey");
    
    redElement.onclick = function () { selectColor(redElement); };
    orangeElement.onclick = function () { selectColor(orangeElement); };
    yellowElement.onclick = function () { selectColor(yellowElement); };
    greenElement.onclick = function () { selectColor(greenElement); };
    blueElement.onclick = function () { selectColor(blueElement); };
    indigoElement.onclick = function () { selectColor(indigoElement); };
    violetElement.onclick = function () { selectColor(violetElement); };
    greyElement.onclick = function () { selectColor(greyElement); };
    
    extraThinElement = document.getElementById("extraThin");
    thinElement = document.getElementById("thin");
    mediumElement = document.getElementById("medium");
    thickElement = document.getElementById("thick");
    extraThickElement = document.getElementById("extraThick");
    
    extraThinElement.onclick = function () { selectSize(extraThinElement); };
    thinElement.onclick = function () { selectSize(thinElement); };
    mediumElement.onclick = function () { selectSize(mediumElement); };
    thickElement.onclick = function () { selectSize(thickElement); };
    extraThickElement.onclick = function () { selectSize(extraThickElement); };
    
    drawElement = document.getElementById("draw");
    eraseElement = document.getElementById("erase");
    
    drawElement.onclick = function () { selectPencil(drawElement); };
    eraseElement.onclick = function () { selectPencil(eraseElement); };
    
    freeDrawElement = document.getElementById("freeDraw");
    lineElement = document.getElementById("line");
    rectangleElement = document.getElementById("rectangle");
    ovalElement = document.getElementById("oval");
    heartElement = document.getElementById("heart");
    
    freeDrawElement.onclick = function () { selectShape(freeDrawElement); };
    lineElement.onclick = function () { selectShape(lineElement); };
    rectangleElement.onclick = function () { selectShape(rectangleElement); };
    ovalElement.onclick = function () { selectShape(ovalElement); };
    heartElement.onclick = function () { selectShape(heartElement); };
    
    selectColor(redElement);
    selectSize(thinElement);
    selectPencil(drawElement);
    selectShape(freeDrawElement);
    
    isDrawing = false;
};

function mouseDown(e) {
    x = e.pageX - canvas.offsetLeft;
    y = e.pageY - canvas.offsetTop;
    
    isDrawing = true;

    if (selectedPencil === drawElement) {
        context.strokeStyle = selectedColor.getAttribute("value");
        context.lineWidth = selectedSize.getAttribute("value");
        context.lineCap = "round";
        context.lineJoin = "round";

        if (selectedShape === freeDrawElement) {
            context.beginPath();
            context.moveTo(x, y);
        } else {
            startX = e.pageX - canvas.offsetLeft;
            startY = e.pageY - canvas.offsetTop;
        }
    } else if (selectedPencil === eraseElement) {
        context.strokeStyle = "white";
        context.lineWidth = selectedSize.getAttribute("value");
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();
        context.moveTo(x, y);
    }
}

function mouseMove(e) {
    if (isDrawing) {
		x = e.pageX - canvas.offsetLeft;
		y = e.pageY - canvas.offsetTop;

        if (selectedShape === freeDrawElement || selectedPencil === eraseElement) {
            context.lineTo(x, y);
            context.stroke();
        } else if (selectedShape === lineElement) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(x, y);
            context.stroke();
        } else if (selectedShape === rectangleElement) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeRect(startX, startY, x - startX, y - startY);
        } else if (selectedShape === ovalElement) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.moveTo(startX, startY + (y - startY) / 2);
            context.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
            context.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
            context.stroke();
        } else if (selectedShape === heartElement) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            width = x - startX;
            height = y - startY;
            context.beginPath();
            context.moveTo(startX + width / 4, startY);
            context.bezierCurveTo(startX, startY, startX, startY + height / 4, startX + width / 2, y);
            context.moveTo(x - width / 4, startY);
            context.bezierCurveTo(x, startY, x, startY + height / 4, startX + width / 2, y);
            context.moveTo(x - width / 4, startY);
            context.quadraticCurveTo(startX + width / 2, startY, startX + width / 2, startY + height / 4);
            context.moveTo(startX + width / 4, startY);
            context.quadraticCurveTo(startX + width / 2, startY, startX + width / 2, startY + height / 4);
            context.stroke();
        }
    }
}

function mouseUp(e) {
    if (isDrawing && (selectedPencil === drawElement)) {
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;
        
        if (selectedShape === lineElement) {
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(x, y);
            context.stroke();
        } else if (selectedShape === rectangleElement) {
            context.strokeRect(startX, startY, x - startX, y - startY);
        } else if (selectedShape === ovalElement) {
            context.beginPath();
            context.moveTo(startX, startY + (y - startY) / 2);
            context.bezierCurveTo(startX, startY, x, startY, x, startY + (y - startY) / 2);
            context.bezierCurveTo(x, y, startX, y, startX, startY + (y - startY) / 2);
            context.stroke();
        } else if (selectedShape === heartElement) {
            width = x - startX;
            height = y - startY;
            context.beginPath();
            context.moveTo(startX + width / 4, startY);
            context.bezierCurveTo(startX, startY, startX, startY + height / 4, startX + width / 2, y);
            context.moveTo(x - width / 4, startY);
            context.bezierCurveTo(x, startY, x, startY + height / 4, startX + width / 2, y);
            context.moveTo(x - width / 4, startY);
            context.quadraticCurveTo(startX + width / 2, startY, startX + width / 2, startY + height / 4);
            context.moveTo(startX + width / 4, startY);
            context.quadraticCurveTo(startX + width / 2, startY, startX + width / 2, startY + height / 4);
            context.stroke();
        }
    }
    
    nextCanvas();
    isDrawing = false;
}

function nextCanvas() {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    if (canvases.length === maxNumCanvases) {
        baseCanvasContext.drawImage(canvases[2], 0, 0);
        document.body.removeChild(canvases[2]);
        canvases.splice(2, 1);
    }
    
    document.body.appendChild(canvas);
    canvases.push(canvas);
    
    canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;
	canvas.onmousemove = mouseMove;
}

function clear() {
    for	(index = canvases.length - 1; index > 1; index = index - 1) {
        document.body.removeChild(canvases[index]);
        canvases.pop();
    }
    
    baseCanvasContext.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
    nextCanvas();
}

function undo() {
    if (canvases.length > 3) {
        document.body.removeChild(canvases[canvases.length - 2]);
        canvases.splice(canvases.length - 2, 1);
    } else {
        window.alert("No more undo");
    }
}

function selectImage() {
    var newElement;
    
    for (var i = 0; i < numSavedImages; i = i + 1) {
        newElement = document.createElement("button");
        document.body.appendChild(newElement);
    }
    
    return 0; //index of selectedImage
}

function open() {
    var image = new Image();
    image.src = localStorage.getItem(selectImage().toString());
    backgroundContext.drawImage(image, 0, 0);
}

function save() {
    consolidate();
    dataURL = consolidatedCanvas.toDataURL(numSavedImages.toString() + "/png");
    
    if (numSavedImages === maxNumSavedImages) {
        localStorage.setItem(selectImage().toString(), dataURL);
    } else {
        localStorage.setItem(numSavedImages.toString(), dataURL);
        numSavedImages = numSavedImages + 1;
    }
}

function consolidate() {
    consolidatedCanvas = document.createElement("canvas");
    consolidatedCanvasContext = consolidatedCanvas.getContext("2d");
    consolidatedCanvas.width = canvasWidth;
    consolidatedCanvas.height = canvasHeight;
    
    for	(index = 0; index < canvases.length - 1; index = index + 1) {
        consolidatedCanvasContext.drawImage(canvases[index], 0, 0);
    }
}
    
function selectColor(newSelectedColor) {
    if (selectedColor !== null) {
        selectedColor.className = "notSelected";
    }
    
    selectedColor = newSelectedColor;
    selectedColor.className = "selected";
}

function selectSize(newSelectedSize) {
    if (selectedSize !== null) {
        selectedSize.className = "notSelected";
    }
    
    selectedSize = newSelectedSize;
    selectedSize.className = "selected";
}

function selectPencil(newSelectedPencil) {
    if (selectedPencil !== null) {
        selectedPencil.className = "notSelected";
    }
    
    selectedPencil = newSelectedPencil;
    selectedPencil.className = "selected";
}

function selectShape(newSelectedShape) {
    if (selectedShape !== null) {
        selectedShape.className = "notSelected";
    }
    
    selectedShape = newSelectedShape;
    selectedShape.className = "selected";
}
