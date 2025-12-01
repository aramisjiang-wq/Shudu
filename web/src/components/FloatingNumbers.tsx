import { useEffect, useState } from 'react';

interface FloatingNumber {
  id: number;
  value: number;
  x: number;
  y: number;
  delay: number;
}

const FloatingNumbers = () => {
  const [numbers, setNumbers] = useState<FloatingNumber[]>([]);

  useEffect(() => {
    const createNumber = (): FloatingNumber => ({
      id: Math.random(),
      value: Math.floor(Math.random() * 9) + 1,
      x: Math.random() * 100,
      y: -10,
      delay: Math.random() * 2,
    });

    // 初始创建一些数字
    const initialNumbers = Array.from({ length: 8 }, () => createNumber());
    setNumbers(initialNumbers);

    const interval = setInterval(() => {
      setNumbers((prev) => {
        // 移除已经飘出屏幕的
        const filtered = prev.filter((n) => n.y < 110);
        // 添加新的
        if (filtered.length < 10) {
          return [...filtered, createNumber()];
        }
        return filtered;
      });
    }, 2000);

    // 动画循环
    const animate = setInterval(() => {
      setNumbers((prev) =>
        prev.map((n) => ({
          ...n,
          y: n.y + 0.3,
          x: n.x + Math.sin(n.y * 0.1) * 0.1,
        }))
      );
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(animate);
    };
  }, []);

  return (
    <div className="floating-numbers">
      {numbers.map((num) => (
        <div
          key={num.id}
          className="floating-number"
          style={{
            left: `${num.x}%`,
            top: `${num.y}%`,
            animationDelay: `${num.delay}s`,
          }}
        >
          {num.value}
        </div>
      ))}
    </div>
  );
};

export default FloatingNumbers;


