import { useState, useEffect } from 'react';

// 一个简单的 3x3 数独预览，让用户可以先体验
const InteractiveSudokuPreview = () => {
  const [board, setBoard] = useState([
    [0, 0, 0],
    [0, 5, 0],
    [0, 0, 0],
  ]);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [solved, setSolved] = useState(false);

  // 预设答案
  const solution = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const handleCellClick = (row: number, col: number) => {
    if (solved) return;
    setSelected({ row, col });
  };

  const handleNumberInput = (value: number) => {
    if (!selected || solved) return;
    const newBoard = board.map((r, ri) =>
      r.map((c, ci) => (ri === selected.row && ci === selected.col ? value : c))
    );
    setBoard(newBoard);

    // 检查是否完成
    if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
      setSolved(true);
      setTimeout(() => {
        setBoard([
          [0, 0, 0],
          [0, 5, 0],
          [0, 0, 0],
        ]);
        setSelected(null);
        setSolved(false);
      }, 2000);
    }
  };

  // 自动演示（如果用户不操作）
  useEffect(() => {
    if (solved || selected) return; // 如果用户正在操作，不自动演示
    
    const timer = setTimeout(() => {
      const emptyCells: { row: number; col: number }[] = [];
      board.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          if (cell === 0) emptyCells.push({ row: ri, col: ci });
        });
      });

      if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setSelected(randomCell);
        setTimeout(() => {
          const value = solution[randomCell.row][randomCell.col];
          if (!solved) {
            const newBoard = board.map((r, ri) =>
              r.map((c, ci) => (ri === randomCell.row && ci === randomCell.col ? value : c))
            );
            setBoard(newBoard);
            
            // 检查是否完成
            if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
              setSolved(true);
              setTimeout(() => {
                setBoard([
                  [0, 0, 0],
                  [0, 5, 0],
                  [0, 0, 0],
                ]);
                setSelected(null);
                setSolved(false);
              }, 2000);
            } else {
              setSelected(null);
            }
          }
        }, 500);
      }
    }, 4000); // 延长到4秒，给用户更多操作时间

    return () => clearTimeout(timer);
  }, [board, solved, selected]);

  return (
    <div className="sudoku-preview-container">
      <div className="sudoku-preview-header">
        <span className="preview-label">🎮 试试看</span>
        {solved && <span className="preview-success">✨ 完成！</span>}
      </div>
      <div className="sudoku-preview-grid">
        {board.map((row, ri) =>
          row.map((cell, ci) => (
            <button
              key={`${ri}-${ci}`}
              className={`preview-cell ${selected?.row === ri && selected?.col === ci ? 'selected' : ''} ${cell !== 0 ? 'filled' : ''} ${solved ? 'solved' : ''}`}
              onClick={() => handleCellClick(ri, ci)}
              disabled={solved}
            >
              {cell !== 0 ? cell : ''}
            </button>
          ))
        )}
      </div>
      {selected && !solved && (
        <div className="preview-number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="preview-number-btn"
              onClick={() => handleNumberInput(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}
      {!selected && !solved && (
        <p className="preview-hint">点击格子，然后选择数字</p>
      )}
    </div>
  );
};

export default InteractiveSudokuPreview;

