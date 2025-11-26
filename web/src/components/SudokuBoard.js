import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
const SudokuBoard = ({ board, givens, notes, selected, setSelected, onInput, noteMode, numberCounts, conflicts, peerHighlights, sameValueHighlights, onToggleNoteMode, disabled, }) => {
    useEffect(() => {
        const handler = (evt) => {
            if (disabled)
                return;
            if (evt.key.toLowerCase() === 'n') {
                evt.preventDefault();
                onToggleNoteMode();
                return;
            }
            if (!selected)
                return;
            if (evt.key >= '1' && evt.key <= '9') {
                evt.preventDefault();
                const mode = noteMode || evt.shiftKey ? 'note' : 'value';
                onInput({ row: selected.row, col: selected.col, value: Number(evt.key), mode });
            }
            else if (['Backspace', 'Delete', '0'].includes(evt.key)) {
                evt.preventDefault();
                onInput({ row: selected.row, col: selected.col, value: null, mode: 'value' });
            }
            else if (evt.key === 'ArrowUp') {
                evt.preventDefault();
                setSelected({ row: Math.max(0, selected.row - 1), col: selected.col });
            }
            else if (evt.key === 'ArrowDown') {
                evt.preventDefault();
                setSelected({ row: Math.min(8, selected.row + 1), col: selected.col });
            }
            else if (evt.key === 'ArrowLeft') {
                evt.preventDefault();
                setSelected({ row: selected.row, col: Math.max(0, selected.col - 1) });
            }
            else if (evt.key === 'ArrowRight') {
                evt.preventDefault();
                setSelected({ row: selected.row, col: Math.min(8, selected.col + 1) });
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selected, onInput, setSelected, disabled, noteMode, onToggleNoteMode]);
    const renderNotes = (cellNotes) => (_jsx("div", { className: "notes", children: cellNotes.map((flag, idx) => (_jsx("span", { children: flag ? idx + 1 : '' }, idx))) }));
    const selectedValue = selected ? board[selected.row][selected.col] : null;
    return (_jsxs("div", { className: "board-wrapper", children: [_jsx("div", { className: "sudoku-grid", children: board.map((row, r) => row.map((value, c) => {
                    const key = `${r}-${c}`;
                    const given = givens[r][c];
                    const isSelected = selected?.row === r && selected?.col === c;
                    const isPeer = peerHighlights.has(key);
                    const isSameValue = sameValueHighlights.has(key);
                    const conflict = conflicts.has(key);
                    const cellNotes = notes[r][c];
                    const hasNotes = cellNotes.some(Boolean);
                    const thickRight = (c + 1) % 3 === 0 && c !== 8;
                    const thickBottom = (r + 1) % 3 === 0 && r !== 8;
                    const thickLeft = c === 0;
                    const thickTop = r === 0;
                    return (_jsx("button", { type: "button", className: [
                            'cell',
                            given ? 'given' : '',
                            isSelected ? 'selected' : '',
                            isPeer ? 'peer' : '',
                            isSameValue ? 'same-value' : '',
                            conflict ? 'conflict' : '',
                            hasNotes ? 'has-notes' : '',
                            thickRight ? 'subgrid-border-right' : '',
                            thickBottom ? 'subgrid-border-bottom' : '',
                            thickLeft ? 'subgrid-border-left' : '',
                            thickTop ? 'subgrid-border-top' : '',
                            disabled ? 'disabled' : '',
                        ]
                            .filter(Boolean)
                            .join(' '), onClick: () => {
                            if (disabled)
                                return;
                            setSelected({ row: r, col: c });
                        }, children: value !== 0 ? _jsx("span", { className: "cell-value", children: value }) : hasNotes ? renderNotes(cellNotes) : null }, key));
                })) }), _jsxs("div", { className: "number-pad", children: [Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
                        const remaining = 9 - numberCounts[num];
                        const isActive = selectedValue === num;
                        const disableInput = !selected || disabled || (remaining <= 0 && !noteMode);
                        return (_jsxs("button", { type: "button", className: isActive ? 'active' : '', disabled: disableInput, onClick: () => selected &&
                                onInput({
                                    row: selected.row,
                                    col: selected.col,
                                    value: num,
                                    mode: noteMode ? 'note' : 'value',
                                }), children: [_jsx("span", { className: "digit", children: num }), _jsx("span", { className: "remaining", children: remaining })] }, num));
                    }), _jsx("button", { type: "button", className: "clear", disabled: !selected || disabled, onClick: () => selected && onInput({ row: selected.row, col: selected.col, value: null, mode: 'value' }), children: "\u6E05\u7A7A" })] })] }));
};
export default SudokuBoard;
