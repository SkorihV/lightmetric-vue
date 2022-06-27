export default {
    // methods: {
    //     addEventDragAndDropForModal() {
    //         let pos1 = 0,
    //             pos2 = 0,
    //             pos3 = 0,
    //             pos4 = 0;
    //         this.$refs.modal.addEventListener('mousedown', dragMouseDown.bind(this))
    //
    //         function dragMouseDown(e)  {
    //             if (e.target.id === "popup-block"){
    //                 pos3 = e.clientX;
    //                 pos4 = e.clientY;
    //                 document.onmouseup = closeDragElement;
    //                 document.onmousemove = elementDrag.bind(this);
    //             }
    //         }
    //
    //         function elementDrag(e) {
    //             pos1 = pos3 - e.clientX;
    //             pos2 = pos4 - e.clientY;
    //             pos3 = e.clientX;
    //             pos4 = e.clientY;
    //
    //             this.$refs.modal.style.top = (this.$refs.modal.offsetTop - pos2) + "px";
    //             this.$refs.modal.style.left = (this.$refs.modal.offsetLeft - pos1) + "px";
    //         }
    //
    //         function closeDragElement() {
    //             document.onmouseup   = null;
    //             document.onmousemove = null;
    //         }
    //     },
    // }
}