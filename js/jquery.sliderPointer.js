var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SliderPointer = (function (_super) {
    __extends(SliderPointer, _super);
    function SliderPointer() {
        _super.apply(this, arguments);
    }
    SliderPointer.prototype.onInit = function (pointer, id, slider) {
        _super.prototype.onInit.call(this, pointer, id, slider);

        this.uid = id;
        this.parent = slider;
        this.value = {};
        this.settings = this.parent.settings;
    };

    SliderPointer.prototype.onMouseDown = function (event) {
        _super.prototype.onMouseDown.call(this, event);

        this._parent = {
            offset: this.parent.domNode.offset(),
            width: this.parent.domNode.width()
        };

        this.pointer.addDependClass('hover');

        this.setIndexOver();
    };

    SliderPointer.prototype.onMouseMove = function (event) {
        _super.prototype.onMouseMove.call(this, event);

        this._set(this.calc(this.getPageCoords(event).x));

        this.parent.setValueElementPosition();

        this.parent.redrawLabels(this);
    };

    SliderPointer.prototype.isMinDistanceViolation = function (minDistance, another) {
        return (this.value && another && another.value) && ((this.uid === Slider.POINTER_LEFT && this.value.origin + minDistance >= another.value.origin) || (this.uid === Slider.POINTER_RIGHT && this.value.origin - minDistance <= another.value.origin));
    };

    SliderPointer.prototype.onMouseUp = function (event) {
        _super.prototype.onMouseUp.call(this, event);

        var another = this.getAdjacentPointer(), minDistance = this.settings.minDistance;

        if (minDistance && another && this.isMinDistanceViolation(minDistance, another)) {
            this.parent.setValueElementPosition();
        }

        if (this.settings.callback && $.isFunction(this.settings.callback)) {
            this.settings.callback.call(this.parent, this.parent.getValue());
        }

        this.pointer.removeDependClass('hover');
    };

    SliderPointer.prototype.setIndexOver = function () {
        this.parent.setPointerIndex(1);
        this.index(2);
    };

    SliderPointer.prototype.index = function (i) {
        this.pointer.css({ zIndex: i });
    };

    SliderPointer.prototype.limits = function (x) {
        return this.parent.limits(x, this);
    };

    SliderPointer.prototype.calc = function (coords) {
        return this.limits(((coords - this._parent.offset.left) * 100) / this._parent.width);
    };

    SliderPointer.prototype.set = function (value, optOrigin) {
        if (typeof optOrigin === "undefined") { optOrigin = false; }
        this.value.origin = this.parent.round(value);

        this._set(this.parent.valueToPrc(value, this), optOrigin);
    };

    SliderPointer.prototype._set = function (prc, optOrigin) {
        if (typeof optOrigin === "undefined") { optOrigin = false; }
        if (!optOrigin) {
            this.value.origin = this.parent.prcToValue(prc);
        }

        var another = this.getAdjacentPointer(), minDistance = this.settings.minDistance;

        if (minDistance && another && this.isMinDistanceViolation(minDistance, another)) {
            switch (this.uid) {
                case Slider.POINTER_LEFT:
                    if (this.value.origin + minDistance >= another.value.origin) {
                        this.value.origin = another.value.origin - minDistance;
                    }
                    break;

                case Slider.POINTER_RIGHT:
                    if (this.value.origin - minDistance <= another.value.origin) {
                        this.value.origin = another.value.origin + minDistance;
                    }
                    break;
            }

            prc = this.parent.valueToPrc(this.value.origin, this);
        }

        this.value.prc = prc;
        this.pointer.css({ left: prc + '%' });
        this.parent.update();
    };

    SliderPointer.prototype.getAdjacentPointer = function () {
        return this.parent.o.pointers[1 - this.uid];
    };
    return SliderPointer;
})(SliderDraggable);
