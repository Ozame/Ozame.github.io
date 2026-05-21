document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.name');
    const letters = document.querySelectorAll('.letter');

    if (!board || letters.length === 0) return;

    let activePiece = null;
    let initialX, initialY;
    let initialCol, initialRow;

    const getSquareSize = () => board.clientWidth / 8;

    // Helper to find piece at specific coordinates
    const getPieceAt = (col, row, excludePiece) => {
        let found = null;
        letters.forEach(p => {
            if (p === excludePiece) return;
            const style = window.getComputedStyle(p);
            if (parseInt(style.gridColumnStart) === col && parseInt(style.gridRowStart) === row) {
                found = p;
            }
        });
        return found;
    };

    letters.forEach(piece => {
        piece.style.cursor = 'grab';

        const startDrag = (e) => {
            if (activePiece) return;

            const point = e.type === 'touchstart' ? e.touches[0] : e;
            initialX = point.clientX;
            initialY = point.clientY;

            activePiece = piece;
            const style = window.getComputedStyle(piece);
            initialCol = parseInt(style.gridColumnStart);
            initialRow = parseInt(style.gridRowStart);

            piece.classList.add('dragging');
            piece.style.zIndex = '1000';
            
            if (e.type === 'touchstart') e.preventDefault();
        };

        piece.addEventListener('mousedown', startDrag);
        piece.addEventListener('touchstart', startDrag, { passive: false });
    });

    const moveDrag = (e) => {
        if (!activePiece) return;

        const point = e.type === 'touchmove' ? e.touches[0] : e;
        const dx = point.clientX - initialX;
        const dy = point.clientY - initialY;

        activePiece.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
    };

    const endDrag = (e) => {
        if (!activePiece) return;

        const boardRect = board.getBoundingClientRect();
        const point = e.type === 'touchend' ? e.changedTouches[0] : e;
        const endX = point.clientX;
        const endY = point.clientY;

        const pieceToReset = activePiece;
        activePiece = null;

        pieceToReset.classList.add('snapping');
        pieceToReset.classList.remove('dragging');

        // Check if inside board
        if (endX >= boardRect.left && endX <= boardRect.right &&
            endY >= boardRect.top && endY <= boardRect.bottom) {
            
            const squareSize = getSquareSize();
            const relativeX = endX - boardRect.left;
            const relativeY = endY - boardRect.top;

            const col = Math.floor(relativeX / squareSize) + 1;
            const row = Math.floor(relativeY / squareSize) + 1;

            // Collision detection: Check if square is already occupied
            if (!getPieceAt(col, row, pieceToReset)) {
                pieceToReset.style.gridColumnStart = col;
                pieceToReset.style.gridRowStart = row;
            } else {
                // Return to initial position if occupied
                pieceToReset.style.gridColumnStart = initialCol;
                pieceToReset.style.gridRowStart = initialRow;
            }
        }

        // To force the piece to "drop" flat even if hovered, 
        // we use a temporary class that kills the hover transform
        pieceToReset.classList.add('dropped');
        pieceToReset.style.transform = '';
        pieceToReset.style.zIndex = '';

        pieceToReset.offsetHeight; // force reflow

        setTimeout(() => {
            pieceToReset.classList.remove('snapping');
            // Remove 'dropped' after a slight delay so it doesn't pop back up 
            // until the mouse moves again.
            setTimeout(() => {
                pieceToReset.classList.remove('dropped');
            }, 50);
        }, 50);
    };

    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
});
