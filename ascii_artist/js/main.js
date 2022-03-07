/* Main operations.

   Copyright (C) 2012.

   This file is part of ASCII Artist.

   ASCII Artist is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   ASCII Artist is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with ASCII Artist.  If not, see <http://www.gnu.org/licenses/>.

   From Cyril Feng. */

window.onload = function () {
    $('version').innerText = "0.9.4";

    // Window movements
    $$('#toolbox>header')[0].addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain',
                                   'toolbox:' +
                                   event.clientX + ',' + event.clientY);
    }, false);

    $$('#editor>header')[0].addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain',
                                   'editor:' +
                                   event.clientX + ',' + event.clientY);
    }, false);

    $$('body')[0].addEventListener('dragover', function (event) {
        event.preventDefault();
        return false;
    }, false);

    $$('body')[0].addEventListener('drop', function (event) {
        var t = event.dataTransfer.getData('text/plain').split(':');
        var id = t[0], coord = t[1].split(',');

        $(id).style.marginLeft = parseInt($(id).style.marginLeft) +
            event.clientX - parseInt(coord[0]) + 'px';
        $(id).style.marginTop = parseInt($(id).style.marginTop) +
            event.clientY - parseInt(coord[1]) + 'px';

        event.preventDefault();
    }, false);

    // Popup
    [].forEach.call(
        $$('.popup input[type="button"],' +
           '.popup input[type="submit"],' +
           '.popup input[type="file"]'),
        function (elem) {
            elem.addEventListener('click', function (event) {
                var link = document.createElement('a');
                link.href = '#';
                link.mouseClick();
            });
        }
    );

    drawIcons();
};

$ = function (id) {             // Id selector
    return document.getElementById(id);
};

$$ = function () {              // CSS-like selector
    return document.querySelectorAll.apply(document, arguments);
};

$e = function (target, listener, type) {
    target.addEventListener(
        type === undefined ? 'click' : type,
        listener
    );
};

Element.prototype.mouseClick = function () {
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    this.dispatchEvent(event);
};

clickMenu = function () {
    [].forEach.call($$('.menu'), function (elem) {
        elem.style.display = 'none';
    });

    [].forEach.call($$('body>header [type="radio"]'), function (elem) {
        elem.parentElement.className = '';
        if (elem.checked === true && elem.id !== 'menu0') {
            elem.parentElement.className = 'selected';
            $(elem.id + '-content').style.display = 'block';
        }
    });
};

wait = function (callback) {
    $('overlay').style.display = 'block';
    setTimeout(function () {
        callback();
        $('overlay').style.display = 'none';
    }, 1);
};

toggleFullscreen = function () {
    if (document.webkitIsFullScreen) {
        document.webkitCancelFullScreen();
    } else {
        $$('body')[0].webkitRequestFullscreen();
    }
};

newSketch = function (name) {
    if (typeof mySketchContainer === 'undefined') {
        mySketchContainer = [];
    }

    [].forEach.call($$('.avail'), function (elem) {
        elem.style.display = 'block';
    });

    var u = new Sketch(name);
    mySketch = u;
    mySketchContainer.push(u);

    var t = document.createElement('li');
    t.innerText = name;
    t.className = 'selected';
    t.addEventListener('click', function () {
        onClickTab(u);
    });

    $('tab-list').appendChild(t);
    u.tab = t;
    u.obj.style['-webkit-user-select'] = 'text';

    onClickTab(u);
};

closeSketch = function (sketch) {
    if (!confirm('Are you sure to close "' + sketch.name + '"')) {
        return false;
    }

    var index = mySketchContainer.indexOf(sketch);
    var length = mySketchContainer.length;
    if (length === 1) {
        mySketch = undefined;
        // Hide unavailable menus
        [].forEach.call($$('.avail'), function (elem) {
            elem.style.display = 'none';
        });
        $('sketch-text').style.opacity = 0;
        $('sketch-text').style['-webkit-user-select'] = 'none';

        $('tab-list').removeChild($$('#tab-list>*')[index]);
        mySketchContainer.splice(index, 1);

        return true;
    }

    if (index === length - 1) {
        onClickTab(mySketchContainer[length - 2]);
    } else {
        onClickTab(mySketchContainer[index + 1]);
    }

    $('tab-list').removeChild($$('#tab-list>*')[index]);
    mySketchContainer.splice(index, 1);

    return true;
};

closeAllSketch = function () {
    var returnState = true;

    for (var i = 0; i < mySketchContainer.length; i++) {
        if (closeSketch(mySketchContainer[i])) {
            returnState = false;
            i--;
        }
    }

    return returnState;
};

onClickTab = function (sketch) {
    mySketch.saveState();

    mySketch = sketch;

    [].forEach.call(mySketchContainer, function (elem) {
        elem.tab.className = '';
    });
    mySketch.tab.className = 'selected';
    $$('#tab-list>*')[mySketchContainer.indexOf(mySketch)].className =
        'selected';

    mySketch.restoreState();
};

window.onbeforeunload = function () {
    return 'Are you sure to leave?';
};

// Attach event handlers
document.addEventListener('DOMContentLoaded', function () {
    $e($$('body')[0], function () {
        $('menu0').checked = true;
        clickMenu();
    });

    $e($('menubar'), function () {
        event.stopPropagation();
        clickMenu();
    });

    $e($('zoom-level'), function () {
        mySketch.zoom();
    }, 'change');

    [].forEach.call($$('.canvas-mode'), function (canvas) {
        $e(canvas, function () {
            mySketch.setMode(canvas.id.split('-')[1]);
        });
    });

    $e($('bg'), function () {
        mySketch.setAttrib('bg', $('bg').value);
    }, 'change');
    $e($('fg'), function () {
        mySketch.setAttrib('fg', $('fg').value);
    }, 'change');
    $e($('text-mode-op1'), function () {
        mySketch.setAttrib('textInsert', !$('text-mode-op1').checked);
    });
    $e($('text-mode-op2'), function () {
        mySketch.setAttrib('textInsert', $('text-mode-op2').checked);
    });
    $e($('filler'), function () {
        mySketch.setAttrib('filler', $('filler').value);
    });
    $e($('prune-mode-op1'), function () {
        mySketch.setAttrib('pruneToEnd', $('prune-mode-op1').checked);
    });
    $e($('prune-mode-op2'), function () {
        mySketch.setAttrib('pruneToEnd', !$('prune-mode-op2').checked);
    });

    $e($('file-save_as-name'), function () {
        $('popup-file-saveAs-name').value = mySketch.name;
    });
    $e($('close_sketch'), function () {
        closeSketch(mySketch);
    });
    $e($('close_all_sketch'), function () {
        closeAllSketch();
    });

    [].forEach.call($$('.menu-history'), function (menu) {
        $e(menu, function () {
            mySketch.history(menu.id.split('-')[1]);
        });
    });
    [].forEach.call($$('.menu-handle_text'), function (menu) {
        $e(menu, function () {
            mySketch.handleText(menu.id.split('-')[1]);
        });
    });
    $e($('menu-clear'), function () {
        mySketch.obj.value = '';
        mySketch.zoom('fit');
        mySketch.history('add')
    });

    $e($('zoom-auto'), function () {
        mySketch.zoom('fit');
    }, 'change');
    $e($('zoom-fit'), function () {
        mySketch.zoom('fit')
    });
    $e($('zoom-in'), function () {
        if($('zoom-level').value < $('zoom-level').max) {
            $('zoom-level').value++;
            mySketch.zoom();
        }
    });
    $e($('zoom-out'), function () {
        if($('zoom-level').value > $('zoom-level').min) {
            $('zoom-level').value--;
            mySketch.zoom();
        }
    });
    $e($('zoom-in_x10'), function () {
        if(parseInt($('zoom-level').value) + 10 < $('zoom-level').max) {
            $('zoom-level').value = parseInt($('zoom-level').value) + 10;
            mySketch.zoom();
        }
    });
    $e($('zoom-out_x10'), function () {
        if(parseInt($('zoom-level').value) - 10 > $('zoom-level').min) {
            $('zoom-level').value = parseInt($('zoom-level').value) - 10;
            mySketch.zoom();
        }
    });
    $e($('toggle-fullscreen'), function () {
        toggleFullscreen();
    });

    $e($('file-new-name'), function () {
        newSketch($('popup-file-new-name').value);
    });
    $e($('file-open'), function () {
        mySketch.open();
    }, 'change');
    $e($('file-save'), function () {
        mySketch.save();
    });
    $e($('file-set_size'), function () {
        mySketch.setSize();
    });
});

drawIcons = function () {
    var t = $('canvas-select').getContext('2d');
    t.moveTo(8, 16);
    t.lineTo(15, 12);
    t.lineTo(15, 18);
    t.lineTo(25, 5);
    t.lineTo(8, 7);
    t.lineTo(14, 10);
    t.lineTo(6, 14);
    t.lineTo(8, 16);
    t.fill();

    var t = $('canvas-pen').getContext('2d');
    t.moveTo(5, 13);
    t.lineTo(7, 17);
    t.lineTo(20, 10);
    t.lineTo(25, 5);
    t.lineTo(18, 6);
    t.lineTo(5, 13);
    t.moveTo(7, 14.5);
    t.lineTo(22, 6.5);
    t.stroke();

    var t = $('canvas-text').getContext('2d');
    t.font = 'Bold 12pt Serif';
    t.fillText('T', 9, 16);

    var t = $('canvas-line').getContext('2d');
    t.moveTo(5, 15);
    t.lineTo(25, 5);
    t.stroke();

    var t = $('canvas-rect').getContext('2d');
    t.beginPath();
    t.rect(5, 5, 20, 10);
    t.closePath();
    t.stroke();

    var t = $('canvas-poly').getContext('2d');
    t.moveTo(5, 5);
    t.lineTo(10, 15);
    t.lineTo(15, 5);
    t.lineTo(20, 15);
    t.lineTo(25, 5);
    t.stroke();

    var t = $('canvas-circle').getContext('2d');
    t.beginPath();
    t.arc(15, 10, 9, 0, Math.PI*2, true);
    t.closePath();
    t.stroke();

    var t = $('canvas-bezier').getContext('2d');
    t.moveTo(5, 15);
    t.bezierCurveTo(5, 5, 15, 5, 25, 15);
    t.stroke();

    var t = $('canvas-fill').getContext('2d');
    t.beginPath();
    t.arc(15, 10, 9, 0, Math.PI*2, true);
    t.closePath();
    t.fill();

    var t = $('canvas-erase').getContext('2d');
    t.moveTo(5, 7);
    t.lineTo(5, 11);
    t.lineTo(9, 19);
    t.lineTo(9, 15);
    t.lineTo(5, 7);
    t.lineTo(21, 5);
    t.lineTo(25, 13);
    t.lineTo(25, 17);
    t.lineTo(9, 19);
    t.moveTo(9, 15);
    t.lineTo(25, 13);
    t.stroke();

    var t = $('canvas-prune').getContext('2d');
    t.beginPath();
    t.arc(5, 10, 2, 0, Math.PI*2, true);
    t.arc(8, 15, 2, 0, Math.PI*2, true);
    t.closePath();
    t.moveTo(8, 12);
    t.lineTo(25, 8);
    t.bezierCurveTo(23, 11, 21, 13, 8, 12);
    t.lineTo(23, 4);
    t.bezierCurveTo(16, 4, 14, 6, 8, 12);
    t.stroke();
};

/*
var iframe = document.getElementById("iframe");
var html = "<html><head></head><body>111</body></html>"
iframe.src = "data:text/html;charset=utf-8,"+encodeURIComponent(html);
*/
