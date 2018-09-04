export default function DragAndDrop(source, target, appendData) {
    let dragObject = {};
    let isPressed = false;
    
    var handlers = {
        onMouseDown: event => {
            let elem = event.target.closest('.friend');

            isPressed = true;

            if (elem && event.which == 1) {
                dragObject.elem = elem;
                dragObject.downX = event.pageX;
                dragObject.downY = event.pageY; 
            } else {
                return  
            }     

            document.addEventListener('mousemove', handlers.onMouseMove);
        },

        onMouseMove: event => {
            if (!dragObject.elem || isPressed == false) {
                return
            }

            dragObject.item = createAvatar();

            dragObject.item.style.position = 'absolute';
            dragObject.item.style.zIndex = 9999;
            dragObject.item.style.left = event.pageX - dragObject.item.offsetWidth / 2 + 'px';
            dragObject.item.style.top = event.pageY - dragObject.item.offsetHeight / 2 + 'px';
        },

        onMouseUp: event => {
            let elem, list;

            isPressed = false;
            if (!dragObject.item) { 
                return 
            }

            dragObject.item.style.display = 'none';
            elem = document.elementFromPoint(event.clientX, event.clientY);
            dragObject.item.style.display = '';
            list = elem.closest('.rightBar_container');

            if (list) {
                dragObject.item.rollback();
                list.appendChild(dragObject.item);
                appendData(dragObject.item);
            } else {
                dragObject.item.rollback();
            }

            document.removeEventListener('mousemove', handlers.onMouseMove);
            dragObject = {};
        }
    }

    source.onmousedown = handlers.onMouseDown;
    document.onmouseup = handlers.onMouseUp;

    function createAvatar() {
        let item = dragObject.elem,
            old = {
                position: item.position || '',
                left: item.left || '',
                top: item.top || '',
                zIndex: item.zIndex || ''
            };

        item.rollback = function() {
            item.style.position = old.position;
            item.style.left = old.left;
            item.style.top = old.top;
            item.style.zIndex = old.zIndex
        };

        return item;
    }
}