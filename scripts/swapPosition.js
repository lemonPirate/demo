/**
 * Created by Administrator on 2017/4/8.
 */

$('div[data-drag]').on('mousedown', down);

var zIndex = 1;
function down(ev) {
    $(this).css('z-index',++zIndex);
    var disX = ev.clientX - $(this).offset().left;
    var disY = ev.clientY - $(this).offset().top;
    var oNearest;

    $(document).on('mousemove', { disX: disX, disY: disY, element: $(this) }, move);
    $(document).on('mouseup', { element: $(this) }, up);

    function move(ev) {
        var disX = ev.data.disX;
        var disY = ev.data.disY;
        var element = ev.data.element;
        var left = ev.clientX - disX;
        var top = ev.clientY - disY;
        element.css({ left: left + 'px', top: top + 'px' });
        var aDiv = $('div[data-drag]');
        aDiv.removeClass('active');
        oNearest = findNearest(element);
        if (oNearest) {
            oNearest.addClass('active');
        }
    }

    function up(ev) {
        $(document).off('mousemove', move);
        $(document).off('mouseup', up);
        var element = ev.data.element;
        if (oNearest) {
            element.css(aPos[oNearest.index()]);
            oNearest.css(aPos[element.index()]);
            var tmp = aPos[oNearest.index()];
            aPos[oNearest.index()] = aPos[element.index()];
            aPos[element.index()] = tmp;
        } else {
            element.css({
                left: aPos[element.index()].left,
                top: aPos[element.index()].top
            });
        }
    }

    // ev.preventDefault();
}


function findNearest(element) {
    var aDiv = $('div[data-drag]');
    var nDisMin = 99999;
    var oNearest = null;
    // alert($(aDiv[element.index()]) === element);

    aDiv.each(function (index) {
        var current = $(aDiv[index]);
        if (index != element.index()) {
            if (overlayTest(element, current)) {
                var nDis = getDis(element, current);
                if (nDisMin > nDis) {
                    nDisMin = nDis;
                    oNearest = current;
                }
            }
        }
    });
    return oNearest;
}

function overlayTest(obj1, obj2) {
    var edge1 = fourEdgesOfRect(obj1);
    var edge2 = fourEdgesOfRect(obj2);
    return !(edge1.left > edge2.right || edge2.left > edge1.right || edge1.top > edge2.bottom || edge2.top > edge1.bottom);
}

function fourEdgesOfRect(obj) {
    var left = obj.offset().left;
    var top = obj.offset().top;
    var right = left + obj.outerWidth();
    var bottom = top + obj.outerHeight();
    return { left: left, right: right, top: top, bottom: bottom };
}

function getDis(obj1, obj2) {
    var t1 = obj1.offset().top + obj1.height() / 2;
    var t2 = obj2.offset().top + obj2.height() / 2;

    var l1 = obj1.offset().left + obj1.width() / 2;
    var l2 = obj2.offset().left + obj2.width() / 2;

    var a = (t1 - t2);
    var b = (l1 - l2);

    return Math.sqrt(a * a + b * b);
}
