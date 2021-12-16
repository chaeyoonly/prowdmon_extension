let isDragging = false;
let shiftX, shiftY;

const Moving = Move.prototype;

const IMG_NUM = 2;
const dragElements = new Array(IMG_NUM);
function Move(){
    for (let i = 0; i<IMG_NUM; i++) {
        console.log(document.querySelector(`.prowdmon${i}`));
        dragElements[i] = document.querySelector(`.prowdmon${i}`);
    }
    this.Engine();
}



Moving.Engine = function(){
    for (let i = 0; i<IMG_NUM; i++) {
        dragElements[i].addEventListener('mousedown', event => {
            console.log("hhhhhhs")
            if (!dragElements[i]) return;
            event.preventDefault();
            dragElements[i].ondragstart = function() {
                return false;
            };
        
            startDrag(dragElements[0], event.clientX, event.clientY);
        });
    }
}

function onMouseUp(event) {
    finishDrag();
    saveLocation(event);
}

function onMouseMove(event) {
    moveAt(event.clientX, event.clientY);
}

// on drag start:
//   remember the initial shift
//   move the element position:fixed and a direct child of body
function startDrag(element, clientX, clientY) {
    console.log("startdrag");
    if(isDragging) { return; }
    isDragging = true;

    document.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);

    shiftX = clientX - element.getBoundingClientRect().left;
    shiftY = clientY - element.getBoundingClientRect().top;

    element.style.position = 'fixed';

    moveAt(clientX, clientY);
}


// switch to absolute coordinates at the end, to fix the element in the document
function finishDrag() {
    if(!isDragging) {
        return;
    }

    isDragging = false;

    dragElements[0].style.top = parseInt(dragElements[0].style.top) + window.pageYOffset + 'px';
    dragElements[0].style.position = 'absolute';

    document.removeEventListener('mousemove', onMouseMove);
    dragElements[0].removeEventListener('mouseup', onMouseUp);
}



function moveAt(clientX, clientY) {
    // new window-relative coordinates
    let newX = clientX - shiftX;
    let newY = clientY - shiftY;

    // check if the new coordinates are below the bottom window edge
    let newBottom = newY + dragElements[0].offsetHeight; // new bottom

    // below the window? let's scroll the page
    if (newBottom > document.documentElement.clientHeight) {
        // window-relative coordinate of document end
        let docBottom = document.documentElement.getBoundingClientRect().bottom;

        // scroll the document down by 10px has a problem
        // it can scroll beyond the end of the document
        // Math.min(how much left to the end, 10)
        let scrollY = Math.min(docBottom - newBottom, 10);

        // calculations are imprecise, there may be rounding errors that lead to scrolling up
        // that should be impossible, fix that here
        if (scrollY < 0) scrollY = 0;

        window.scrollBy(0, scrollY);

        // a swift mouse move make put the cursor beyond the document end
        // if that happens -
        // limit the new Y by the maximally possible (right at the bottom of the document)
        newY = Math.min(newY, document.documentElement.clientHeight - dragElements[0].offsetHeight);
    }

    // check if the new coordinates are above the top window edge (similar logic)
    if (newY < 0) {
        // scroll up
        let scrollY = Math.min(-newY, 10);
        if (scrollY < 0) scrollY = 0; // check precision errors

        window.scrollBy(0, -scrollY);
        // a swift mouse move can put the cursor beyond the document start
        newY = Math.max(newY, 0); // newY may not be below 0
    }


    // limit the new X within the window boundaries
    // there's no scroll here so it's simple
    if (newX < 0) newX = 0;
    if (newX > document.documentElement.clientWidth - dragElements[0].offsetWidth) {
        newX = document.documentElement.clientWidth - dragElements[0].offsetWidth;
    }

    dragElements[0].style.left = newX + 'px';
    dragElements[0].style.top = newY + 'px';
}

const LOCATION = "location"
function saveLocation(event) {
    const X = event.clientX;
    const Y = event.clientY;
    const location = {X,Y};
    localStorage.setItem(LOCATION, JSON.stringify(location));
}

function loadLocation() {
    const loadedLocation = localStorage.getItem(LOCATION);
    const parseLocation = JSON.parse(loadedLocation);
    drag1 = document.querySelector(".draggable");
    drag1.style.left = parseLocation.X + 'px';
    drag1.style.top = parseLocation.Y+window.pageYOffset + 'px';
    drag1.style.position = 'absolute';
    console.log(drag1.style.left);
}

function init() {
    loadLocation();
}

init();
new Move();