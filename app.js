//elements
const start_reset = document.getElementById('start_reset');
const fileInput = document.querySelector("#imageUpload");
const puzzlebox = document.getElementById('puzzlebox');
const puzzletiles = document.getElementById('puzzletiles');
const container = document.getElementById("gridbox");
var imgheight = 400;
var imgwidth = 600;
var length = 0;
var dataurl;
let dragItem = null;
let hascollision = false;

// To make canvas hidden
document.getElementById('preview').style.display = 'none';

// Drop tile back to puzzle tile
puzzletiles.addEventListener('dragover', e => {
    e.preventDefault();
});
puzzletiles.addEventListener('dragenter', e => {
    e.preventDefault();
});
puzzletiles.addEventListener('drop', e => {
    puzzletiles.appendChild(dragItem);
})

fileInput.addEventListener("input", (e) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        openImage(reader.result);
    });

    reader.readAsDataURL(e.target.files[0]);
});

function openImage(imageSrc) {
    var activeImage = new Image();

    activeImage.addEventListener("load", () => {
        const canvas = document.getElementById('preview');
        const canvasCtx = canvas.getContext("2d");
        canvas.width = imgwidth;
        canvas.height = imgheight;
        canvasCtx.drawImage(activeImage, 0, 0, imgwidth, imgheight);
        document.getElementById('input-box').style.display = 'none';
        document.getElementById('preview').style.display = '';
        dataurl = canvas.toDataURL()
    });
    activeImage.src = imageSrc;
}

start_reset.addEventListener('click', () => {
    if (start_reset.innerText == "Start") {
        if (dataurl != null) {
            document.getElementById('preview').style.display = 'none';
            length = prompt("Give the grid size eg:3 for 3x3")
            splitanddisp(dataurl);
            start_reset.innerHTML = "Reset";
            start_reset.className = "btn btn-danger";
            container.style.display = "";
            puzzlebox.style.width = imgwidth + 5 + length * (4 + 2) + "px";
            puzzlebox.style.height = imgheight + 5 + length * (4 + 2) + "px";
            makeRows(length, length);
            enable_draganddrop();
        }
    }
    else if (start_reset.innerText == "Reset") {
        document.getElementById('input-box').style.display = '';
        puzzletiles.innerHTML = '';
        puzzletiles.style.display = '';
        container.innerHTML = '';
        container.style.display = 'none';
        result.style.display = 'none';
        fileInput.value = null;
        start_reset.innerHTML = "Start";
        dataurl = null;
        start_reset.classList = "btn btn-success";
        puzzlebox.style.height = "405px"
        puzzlebox.style.width = "605px"
    }
})

function splitanddisp(src) {
    var img = new Image();
    var width;
    var height;
    var ylength = length;
    img.src = src;
    img.addEventListener('load', (e) => {
        width = e.srcElement.width;
        height = e.srcElement.height;
        var n = 0;
        for (var j = 0; j < length; j++) {
            for (var i = 0; i < length; i++) {
                var left = (-1 * width / length * i).toString() + "px";
                var top = (-1 * height / ylength * j).toString() + "px";
                var element = document.createElement('div');
                element.id = n;
                element.draggable = "true";
                element.style.width = (Math.floor(width / length)).toString() + "px";
                element.style.height = (Math.floor(height / ylength)).toString() + "px";
                element.style.backgroundPosition = (left + " " + top).toString();
                element.style.backgroundImage = `url(${img.src})`;
                puzzletiles.appendChild(element).className = "puzzlesplit";
                puzzlebox.style.width = (width + (length * 2)) + 10;
                n++;
            }
        }
        shuffle();
        var puzzlesplit = document.querySelectorAll('.puzzlesplit');
        puzzlesplit.forEach(ele => {
            ele.addEventListener('dragstart', () => {
                dragItem = ele;
            })
            ele.addEventListener('dragend', () => {
                setTimeout(() => {
                    dragItem = null;
                }, 0);
            })
        });
    });
}

function shuffle() {
    var elementsArray = Array.prototype.slice.call(puzzletiles.getElementsByClassName('puzzlesplit'));
    elementsArray.forEach(function (element) {
        puzzletiles.removeChild(element);
    })
    shuffleArray(elementsArray);
    elementsArray.forEach(function (element) {
        puzzletiles.appendChild(element);
    })
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function makeRows(rows, cols) {
    container.style.gridTemplate = `repeat(${rows}, ${(imgheight / length) + 2}px)/repeat(${cols}, ${(imgwidth / length) + 2}px)`;
    for (c = 0; c < (rows * cols); c++) {
        let cell = document.createElement("div");
        cell.id = c;
        container.appendChild(cell).className = "grid-item";
    };
};

function enable_draganddrop() {
    var grid_items = document.querySelectorAll('.grid-item');
    grid_items.forEach(ele => {
        ele.addEventListener('dragover', e => {
            e.preventDefault();
            if (e.srcElement.draggable == true)
                hascollision = true
            else
                hascollision = false
        });
        ele.addEventListener('dragenter', e => {
            e.preventDefault();
        });
        ele.addEventListener('drop', e => {
            if (!hascollision) {
                e.srcElement.appendChild(dragItem);
                checkforwin();
            }
        })
    })
}

function checkforwin() {
    var final_grid_items = document.querySelectorAll('.grid-item>.puzzlesplit');
    if (final_grid_items.length == length * length) {
        var win = true;
        for (let i = 0; i < length * length; i++) {
            if (final_grid_items[i].id != i)
                win = false;
        }
        if (win) {
            var grid_items = document.querySelectorAll('.grid-item');
            const result = document.getElementById('result');
            result.innerHTML = "You Won!";
            puzzletiles.style.display = 'none';
            grid_items.forEach(ele => {
                ele.draggable = "false";
            })
        }
    }
}
