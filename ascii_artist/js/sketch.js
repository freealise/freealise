/* Sketch module.

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

Sketch = function (name) {
    this.name = name;

    this.obj = $('sketch-text');
    this.obj.value = '';
    this.obj.selectionStart = this.obj.selectionEnd = 0;
    this.obj.style.opacity = 1;

    this.out = true;            // Out of scope
    this.op = false;            // Operability
    this.textInsert = false;    // Text insert/replace
    this.pruneToEnd = true;     // Prune to End or all
    this.cache = {data: [], index: -1}; // Operation history cache
    this.cacheMax = 100;                // Max cache number
    this.bg = '　';                      // Background
    this.fg = '講';                      // Foreground
    this.filler = '講';                  // Filler

    this.zoomLevel = $('zoom-level');
    this.setSize({rows: 64, cols: 128});

    this.setMode('select');
    this.history('add');
    this.saveState();
};

Sketch.prototype.saveState = function () {
    this.state = {};
    this.state.selectionStart = this.obj.selectionStart;
    this.state.selectionEnd = this.obj.selectionEnd;
};

Sketch.prototype.restoreState = function () {
    this.setMode(this.mode);

    mySketch.history('fakeUndo');
    mySketch.zoom('fit');

    this.obj.selectionStart = this.state.selectionStart;
    this.obj.selectionEnd = this.state.selectionEnd;
};

Sketch.prototype.setAttrib = function (key, value) { // Set attributes
    switch (key) {
    case 'bg':
        if (value.length !== 1) {
            return;
        }

        var re;
        try {
            re = new RegExp(this.bg, 'g');
        } catch (e) {
            re = new RegExp('\\' + this.bg, 'g');
        }

        this.obj.value =
            this.obj.value.replace(re, value);
        this.history('add');
        break;
    case 'fg': case 'filler':
        if (value.length !== 1) {
            return;
        }
        break;
    case 'textInsert': case 'pruneToEnd':
        break;
    default:
        return;
    }

    this[key] = value;
};

Sketch.prototype.setMode = function (mode) { // Set sketch mode
    this.mode = mode;

    // Display the corresponding options
    [].forEach.call($$('#mode-option>div>div:not(.hidden)'), function (elem) {
        elem.className = 'hidden';
    });
    [].forEach.call($$('#' + mode + '-option'), function (elem) {
        elem.className = '';
    });

    // Hightlight the corresponding icon
    [].forEach.call($$('aside>details>div>canvas'), function (elem) {
        elem.className = '';
    });
    $('canvas-' + mode).className = 'selected';

    this.obj.style.cursor = 'crosshair';

    this.obj.onmouseover = (function () {
        this.out = false;
    }).bind(this);
    this.obj.onmouseout = (function () {
        this.out = true;
    }).bind(this);

    switch (mode) {
    case 'select':
        this.obj.style.cursor = 'default';
        this.register(this.handleSelect);
        break;
    case 'text':
        this.clipboard = [];
        this.obj.style.cursor = 'text';
        this.register(this.handleText);
        break;
    case 'pen':
        this.register(this.handlePen);
        break;
    case 'erase':
        this.register(this.handleErase);
        break;
    case 'line':
        this.register(this.handleLine);
        break;
    case 'rect':
        this.register(this.handleRect);
        break;
    case 'poly':
        this.register(this.handlePoly, null);
        break;
    case 'circle':
        this.register(this.handleCircle);
        break;
    case 'fill':
        this.register(this.handleFill);
        break;
    case 'bezier':
        this.register(this.handleBezier, -2);
        break;
    case 'prune':
        this.register(this.handlePrune);
        break;
    }
};

Sketch.prototype.register = function (listener, repeat) {
    // Register listeners
    if (typeof this.pool === 'undefined') {
        this.pool = {};
    }

    var id = Math.random();
    this.pool[id] = [];

    if (typeof repeat === 'undefined') {
        repeat = 0;
    }
    this.pool[id].repeat = repeat;
    this.pool[id].repeatCount = repeat !== null && repeat < 0 ?
        -repeat : repeat;

    this.obj.onmousedown = (function (event) {
        if (this.continuous !== true) {
            this.continuous = true;
            var t = [];
            t.repeat = this.pool[id].repeat;
            t.repeatCount = t.repeat !== null && t.repeat < 0 ?
                -t.repeat : t.repeat;
            this.pool[id] = t;
        }

        this.op = true;
        listener.apply(this, ['down', event, id]);
    }).bind(this);

    this.obj.onmousemove = (function (event) {
        if (!this.op || this.out) {
            this.op = false;
            return;
        }

        listener.apply(this, ['move', event, id]);
    }).bind(this);

    this.obj.onmouseup = (function (event) {
        if (this.op !== false) {
            this.op = false;
            listener.apply(this, ['up', event, id]);

            if (this.mode !== 'text' &&
                typeof this.pool[id] !== 'undefined' &&
                (this.pool[id].repeat === null ||
                 this.pool[id].repeat > 0 ||
                 this.pool[id].repeatCount === -this.pool[id].repeat)) {
                this.history('add');
            }
        }
    }).bind(this);

    this.obj.onkeydown = (function (event) {
        listener.apply(this, ['keydown', event, id]);
    }).bind(this);

    this.obj.onkeypress = (function (event) {
        listener.apply(this, ['keypress', event, id]);
    }).bind(this);

    this.obj.onkeyup = (function (event) {
        listener.apply(this, ['keyup', event, id]);
    }).bind(this);

    this.obj.oncopy = (function (event) {
        listener.apply(this, ['copy', event, id]);
    }).bind(this);

    this.obj.onpaste = (function (event) {
        listener.apply(this, ['paste', event, id]);
    }).bind(this);

    this.obj.oncut = (function (event) {
        listener.apply(this, ['cut', event, id]);
    }).bind(this);

    this.obj.oncontextmenu = (function (event) {
        listener.apply(this, ['contextmenu', event, id]);
    }).bind(this);
};

Sketch.prototype.doNothing = function (event) {
    event.preventDefault();
};

Sketch.prototype.history = function (action) {
    switch (action) {
    case 'undo':
        if (this.cache.index > 0) {
            this.obj.value = this.cache.data[--this.cache.index];
        }
        break;
    case 'fakeUndo':
        if (this.cache.index >= 0) {
            this.obj.value = this.cache.data[this.cache.index];
        }
        break;
    case 'redo':
        if (this.cache.index < this.cache.data.length - 1) {
            this.obj.value = this.cache.data[++this.cache.index];
        }
        break;
    case 'add':
        // Avoid redundant saves
        if (this.obj.value === this.cache.data[this.cache.data.length - 1]) {
            return;
        }

        if (this.cache.data.length > this.cache.index + 1) {
            this.cache.data =
                this.cache.data.slice(0, this.cache.index + 1);
        }

        this.cache.data.push(this.obj.value);
        this.cache.index++;

        if (this.cache.data.length >= this.cacheMax) {
            this.cache.data = this.cache.data.slice(-(this.cacheMax));

            if (this.cache.index + 1 > this.cacheMax) {
                this.cache.index = this.cacheMax - 1;
            }
        }
        break;
    }
};

Sketch.prototype.trim = function (force) { // Trim to rows X cols
    if (typeof force !== 'undefined') {    // Force remove traling WS
        this.obj.value = this.obj.value.replace(
            new RegExp(this.bg + '*', gm), '');
    } else {
        var t = this.obj.value.split('\n').slice(0, this.rows);

        if (t.length < this.rows) { // Create new lines
            t = t.concat(new Array(
                parseInt(this.rows) - t.length
            ).join(':').split(':'));
        }

        var ws = new Array(parseInt(this.cols) + 1).join(this.bg); // Padding WS
        for (var i = 0; i < this.rows; i++) {
            t[i] = (t[i] + ws).slice(0, this.cols);
        }

        var end = this.obj.selectionEnd;
        this.obj.value = t.join('\n');
        this.obj.selectionEnd = end;
    }
};

Sketch.prototype.zoom = function (fit) { // Zoom in/out/fit
    this.trim();

    if (typeof fit !== 'undefined') {
        this.zoomLevel.value = this.zoomLevel.min;

        do {
            this.obj.style.fontSize = ++this.zoomLevel.value + 'px';
        } while (this.obj.scrollWidth <= this.obj.clientWidth &&
                 parseInt(this.zoomLevel.value) < parseInt(this.zoomLevel.max));

        do {
            this.obj.style.fontSize = --this.zoomLevel.value + 'px';
        } while (this.obj.scrollHeight > this.obj.clientHeight &&
                 parseInt(this.zoomLevel.value) > parseInt(this.zoomLevel.min));

        if (parseInt(this.zoomLevel.value) > parseInt(this.zoomLevel.max)) {
            this.zoomLevel.value = 12;
        }

        this.zoomLevel.disabled = $('zoom-auto').checked;
    }

    this.obj.style.fontSize = this.zoomLevel.value + 'px';
};

Sketch.prototype.setSize = function (size) {
    if (typeof size !== 'undefined') {
        this.rows = $('size-rows').value = size.rows;
        this.cols = $('size-cols').value = size.cols;
    } else {
        this.rows = $('size-rows').value;
        this.cols = $('size-cols').value;
    }

    this.trim();
    if ($('zoom-auto').checked) {
        this.zoom('fit');
    }
};

Sketch.prototype.pos2coord = function (position) {
    // Position to Coordination
    if (typeof position === 'object') {
        return position;
    } else {
        return [Math.floor(position / (parseInt(this.cols) + 1)),
                position % (parseInt(this.cols) + 1)];
    }
};

Sketch.prototype.coord2pos = function (coord) {
    // Coordination to Position
    if (typeof coord === 'object') {
        if (coord[1] > this.cols) {
            coord[1] = this.cols;
        }

        return coord[0] * (parseInt(this.cols) + 1) + coord[1];
    } else {
        return parseInt(coord);
    }
};

Sketch.prototype.plot = function (option) { // Plot at current position
    var end = this.obj.selectionEnd,
    start = this.obj.selectionStart,
    dir = this.obj.selectionDirection;

    var fg = this.fg;
    var position = dir === 'forward' ? end : start;

    if (typeof option !== 'undefined') {
        if (option.fg !== undefined) {
            fg = option.fg;
        }

        if (option.position !== undefined) {
            position = this.coord2pos(option.position);
        }
    }

    // Check validation
    var t = this.pos2coord(position);
    if (t[0] < 0 || t[0] >= this.rows ||
        t[1] < 0 || t[1] >= this.cols) {
        return false;
    }
    var t = this.obj.value.substr(position, 1);
    if (t === '\n' || t === '') {
        return false;
    }

    // Plot
    var t = this.obj.value;
    this.obj.value = t.substr(0, position) + fg +
        t.substr(position + 1);
    this.obj.selectionStart = this.obj.selectionEnd = position;

    return true;
};

Sketch.prototype.plotLine = function (line) { // Plot straight line
    if (line[0] === line[1]) {
        return;
    }

    var src = this.pos2coord(line[0]), dest = this.pos2coord(line[1]);

    var vector = [dest[0] - src[0], dest[1] - src[1]];
    if (Math.abs(vector[0]) <= 1 && Math.abs(vector[1]) <= 1) {
        // Recursion Terminated
        var sym;
        if (vector[0] === 0) {
            sym = '-';
        } else if (vector[1] === 0) {
            sym = '|';
        } else if (vector[0] * vector[1] > 0) {
            sym = '\\';
        } else {
            sym = '/';
        }

        this.plot({fg: sym, position: [
            vector[0] === 1 ? src[0] + 1 : src[0],
            vector[1] === -1 ? src[1] - 1 : src[1]
        ]});
    } else {
        var med = [Math.round((dest[0] + src[0]) / 2),
                   Math.round((dest[1] + src[1]) / 2)];

        this.plotLine([src, med]);
        this.plotLine([med, dest]);
    }
};

Sketch.prototype.plotRect = function (rect) { // Plot Rectangle
    // var end = this.obj.selectionStart;
    var vertex = [
        this.pos2coord(rect[0]), null, this.pos2coord(rect[1]), null];
    vertex[1] = [vertex[0][0], vertex[2][1]];
    vertex[3] = [vertex[2][0], vertex[0][1]];

    this.plotLine([vertex[0], vertex[1]]);
    this.plotLine([vertex[1], vertex[2]]);
    this.plotLine([vertex[2], vertex[3]]);
    this.plotLine([vertex[3], vertex[0]]);

    vertex.forEach(function (elem) {
        this.plot({fg: '+', position: elem});
    }, this);
};

Sketch.prototype.plotCircle = function (circle) { // Plot circle
    var center = this.pos2coord(circle[0]),
    edge = this.pos2coord(circle[1]);

    var vertex = [edge, [edge[0], 2 * center[1] - edge[1]],
                  [2 * center[0] - edge[0], edge[1]],
                  [2 * center[0] - edge[0], 2 * center[1] - edge[1]]
                 ];

    vertex.forEach(function (elem) {
        this.plotBezier({
            '0': elem,
            '1': [elem[0], center[1]],
            sequence: [[center[0], elem[1]]]
        }, true);
    }, this);
};

Sketch.prototype.plotFill = function (coord) {
    var t = this.obj.value.substr(this.coord2pos(coord), 1);
    if (t !== this.bg) {
        return;
    }

    this.plot({fg: this.filler, position: coord});

    var t = this.pos2coord(coord);
    var edge = [[t[0] - 1, t[1]], [t[0], t[1] + 1],
                [t[0] + 1, t[1]], [t[0], t[1] - 1]];

    edge.forEach(function (elem) {
        if (elem[0] >= 0 && elem[0] < this.rows &&
            elem[1] >= 0 && elem[1] < this.cols) {
            this.plotFill(elem);
        }
    }, this);
};

Sketch.prototype.plotBezier = function (coord, force) { // Bezier curve
    if (typeof force === 'undefined' && coord.sequence.length < 2) {
        // 2 points only
        this.plotLine(coord);
        return;
    }

    var clone = [this.pos2coord(coord.sequence[0]),
                 this.pos2coord(coord[0]),
                 this.pos2coord(coord[1])],
    points = [clone[0]];

    for (var t = increment = 0.1; t < 1; t += increment) {
        var x = (1 - t) * (1 - t) * clone[0][0] +
            2 * t * (1 - t) * clone[1][0] +
            t * t * clone[2][0];

        var y = (1 - t) * (1 - t) * clone[0][1] +
            2 * t * (1 - t) * clone[1][1] +
            t * t * clone[2][1];

        var current = [Math.round(x), Math.round(y)];
        var prev = points[points.length - 1][0];
        var diff = [Math.abs(current[0] - prev[0]),
                    Math.abs(current[1] - prev[1])];
        if (diff[0] === 0 && diff[1] === 0) {
            increment *= 2;
            continue;
        } else if (diff[0] > 1 || diff[1] > 1) {
            t -= increment;
            increment /= 2;
            continue;
        }

        points.push(current);
    }

    points.push(clone[2]);

    for (i = 0; i < points.length - 1; i++) {
        this.plotLine([points[i], points[i + 1]]);
    }
};

Sketch.prototype.prune = function (coord) {
    var t = this.obj.value.substr(this.coord2pos(coord), 1);
    if (t === this.bg || t === '\n' || t === '') {
        return;
    }

    var t = this.pos2coord(coord);
    var edge = [
        [t[0] + 1, t[1] + 1],
        [t[0] + 1, t[1]],
        [t[0] + 1, t[1] - 1],
        [t[0], t[1] - 1],
        [t[0] - 1, t[1] - 1],
        [t[0] - 1, t[1]],
        [t[0] - 1, t[1] + 1],
        [t[0], t[1] + 1]
    ];

    this.plot({fg: this.bg, position: t});

    if (this.pruneToEnd) {
        var count = [];
        edge.forEach(function (elem) {
            if (this.obj.value.substr(this.coord2pos(elem), 1) !==
                this.bg) {
                count.push(elem);
            }

        }, this);

        if (count.length > 2) {
            return;
        }

        if (count.length === 2 && (
            count[0][0] + count[1][0] !== t[0] * 2 ||
                count[0][1] + count[1][1] !== t[1] * 2)) {
            return;
        }
    }

    edge.forEach(function (elem) {
        this.prune(elem);
    }, this);
};

Sketch.prototype.template = function (action, callback, id) {
    // Listener template (applicable to 2 or 3 points listener)
    switch (action) {
    case 'move':
        if (this.pool[id].length === 0) {
            this.pool[id][0] = this.obj.selectionStart;
            this.pool[id][1] = null;
            this.pool[id].sequence = [this.obj.selectionStart];
        }

        if (this.pool[id][0] > this.obj.selectionStart) {
            if (this.obj.selectionDirection === 'forward') {
                this.obj.selectionStart = this.obj.selectionEnd;
            }

            if (this.pool[id][1] !== this.obj.selectionStart) {
                this.pool[id][1] = this.obj.selectionStart;
            } else {
                return;
            }
        } else {
            if (this.obj.selectionDirection === 'backward') {
                this.obj.selectionEnd = this.obj.selectionStart;
            }

            if (this.pool[id][1] !== this.obj.selectionEnd) {
                this.pool[id][1] = this.obj.selectionEnd;
            } else {
                return;
            }
        }

        this.history('fakeUndo');
        callback.apply(this, [this.pool[id]]);
        break;
    case 'up':
        callback.apply(this, [this.pool[id]]);

        if (this.pool[id].repeat === null ||
            --this.pool[id].repeatCount > 0) {

            this.pool[id][0] = this.obj.selectionEnd;
            this.pool[id][1] = null;
            this.pool[id].sequence.push(this.pool[id].selectionStart);
        } else {
            var t = [];
            t.repeat = this.pool[id].repeat;
            t.repeatCount = t.repeat !== null && t.repeat < 0 ?
                -t.repeat : t.repeat;

            this.pool[id] = t;
        }
        break;
    case 'keydown': case 'keypress': case 'keyup':
    case 'copy': case 'paste': case 'cut':
        this.doNothing(event);
        break;
    case 'contextmenu':
        this.continuous = false;
        this.doNothing(event);
        break;
    }
};

Sketch.prototype.handleSelect = function (action, event) {
    switch (action) {
    case 'keydown': case 'paste': case 'cut':
        event.preventDefault();
        break;
    case 'down': case 'move': case 'up':
    case 'keypress': case 'keyup':
    case 'copy':
    case 'contextmenu':
        break;
    }
};

Sketch.prototype.handleText = function (action, event, id) {
    switch (action) {
    case 'down': case 'move': case 'up':
    case 'keydown': case 'contextmenu':
        break;
    case 'keypress':
        if (!this.textInsert) {
            this.plot({fg: ''});
        }
        break;
    case 'keyup':
        this.trim();
        this.history('add');
        break;
    case 'copy':
        if (typeof event !== 'undefined') {
            event.preventDefault();
        }
        this.clipboard = [];

        var start = this.pos2coord(this.obj.selectionStart);
        var end = this.pos2coord(this.obj.selectionEnd);
        var edge = [start[1], end[1]].sort();

        for (var i = start[0]; i <= end[0]; i++) {
            this.clipboard.push(this.obj.value.substr(
                this.coord2pos([i, edge[0]]), edge[1] - edge[0]
            ));
        }
        break;
    case 'paste':
        if (typeof event !== 'undefined') {
            event.preventDefault();
        }
        if (this.clipboard.length === 0) {
            return;
        }

        if (typeof id !== 'undefined' && this.textInsert) {
            var pos = this.obj.selectionEnd;
            var unit = this.clipboard[0].length;
            var t = this.obj.value;

            for (var i = 0; i < this.clipboard.length; i++) {
                t = t.substr(0, pos) + this.clipboard[i] + t.substr(pos);
                pos = this.pos2coord(pos);
                pos = this.coord2pos([pos[0] + 1, pos[1]]) + unit;
            }

            this.obj.value = t;

            if (typeof event !== 'undefined') {
                this.history('add');
            }
        } else {
            var coord = this.pos2coord(this.obj.selectionEnd);

            for (var i = 0; i < this.clipboard.length; i++) {
                for (var j = 0; j < this.clipboard[i].length; j++) {
                    this.plot({
                        fg: this.clipboard[i][j],
                        position: [coord[0] + i, coord[1] + j]
                    });
                }
            }
        }

        this.trim();
        break;
    case 'cut':
        if (typeof event !== 'undefined') {
            event.preventDefault();
        }

        var pos = this.obj.selectionStart;

        this.obj.oncopy();
        if (this.clipboard.length === 0) {
            return;
        }

        var tmp = this.clipboard;
        var ws = new Array(tmp[0].length + 1).join(this.bg);
        this.clipboard = [];
        tmp.forEach(function () {
            this.clipboard.push(ws);
        }, this);

        this.obj.selectionStart = this.obj.selectionEnd = pos;
        this.obj.onpaste();

        this.clipboard = tmp;
        break;
    }
};

Sketch.prototype.handlePen = function (action, event) { // Pen
    switch (action) {
    case 'move': case 'up':
        this.plot();
        break;
    case 'keydown': case 'keypress': case 'keyup':
    case 'copy': case 'paste': case 'cut':
    case 'contextmenu':
        this.doNothing(event);
        break;
    }
};

Sketch.prototype.handleErase = function (action, event) { // Erase
    switch (action) {
    case 'move': case 'up':
        this.plot({fg: this.bg});
        break;
    case 'keydown': case 'keypress': case 'keyup':
    case 'copy': case 'paste': case 'cut':
    case 'contextmenu':
        this.doNothing(event);
        break;
    }
};

Sketch.prototype.handleLine = function (action, event, id) {
    // Line
    this.template(action, this.plotLine, id);
};

Sketch.prototype.handleRect = function (action, event, id) {
    // Rectangle
    this.template(action, this.plotRect, id);
};

Sketch.prototype.handlePoly = function (action, event, id) {
    // Polygonal line
    this.template(action, this.plotLine, id);
};

Sketch.prototype.handleCircle = function (action, event, id) {
    // Circle
    this.template(action, this.plotCircle, id);
};

Sketch.prototype.handleFill = function (action, event) { // Fill
    switch (action) {
    case 'up':
        wait((function () {
            mySketch.plotFill(this.obj.selectionEnd);
        }).bind(this));
        break;
    case 'keydown': case 'keypress': case 'keyup':
    case 'copy': case 'paste': case 'cut':
    case 'contextmenu':
        this.doNothing(event);
        break;
    }
};

Sketch.prototype.handleBezier = function (action, event, id) {
    // Bezier curve
    this.template(action, this.plotBezier, id);
};

Sketch.prototype.handlePrune = function (action, event) {
    // Pruning
    switch (action) {
    case 'up':
        this.prune(this.obj.selectionEnd);
        break;
    case 'keydown': case 'keypress': case 'keyup':
    case 'copy': case 'paste': case 'cut':
    case 'contextmenu':
        this.doNothing(event);
        break;
    }
};

Sketch.prototype.save = function () { // Save the sketch
    if (!window.BlobBuilder) {
        BlobBuilder = WebKitBlobBuilder;
    }
    if (!window.URL) {
        URL = webkitURL;
    }

    var filename = $('popup-file-saveAs-name').value + '.txt';

    var blob = new BlobBuilder();
    blob.append(this.obj.value);

    var link = document.createElement('a'); // Tmp link
    link.href = URL.createObjectURL(
        blob.getBlob('application/force-download'));
    link.download = filename;
    link.mouseClick();          // Simulate mouse click to download
};

Sketch.prototype.open = function () { // Open a sketch
    var reader = new FileReader();

    reader.onload = (function (event) {
        this.obj.value = event.target.result;
        $('file-open').style.display = 'none';
    }).bind(this);

    reader.readAsText($('file-open').files[0]);
};