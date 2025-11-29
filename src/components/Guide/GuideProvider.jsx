import { useState, useContext, createContext } from 'react';
import { getGuide } from './registry';
import GuideOverlay from './GuideOverlay';

const GuideContext = createContext(null);

/**
 * 引导弹窗上下文提供者组件
 * @param {ReactNode} children - 子组件
 */
export const GuideProvider = ({ children }) => {
  // 引导弹窗状态
  const [visible, setVisible] = useState(false);
  // 引导步骤列表
  const [steps, setSteps] = useState([]);
  // 当前引导步骤索引
  const [index, setIndex] = useState(0);

  // 处理引导弹窗可见状态
  const handleVisible = (s) => {
    const target = s?.selector ? document.querySelector(s.selector) : null;
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 开始
  const handleStart = (key, steps) => {
    const s = Array.isArray(steps) ? steps : getGuide(key) || [];
    if (!s.length) return;
    setSteps(s);
    setIndex(0);
    setVisible(true);
    handleVisible(s[0]);
  };

  // 停止
  const handleStop = () => {
    setVisible(false);
    setSteps([]);
    setIndex(0);
  };

  // 下一步
  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < steps.length) {
      setIndex(nextIndex);
      handleVisible(steps[nextIndex]);
    } else {
      handleStop();
    }
  };

  // 上一步
  const handlePrev = () => {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      setIndex(prevIndex);
      handleVisible(steps[prevIndex]);
    } else {
      handleStop();
    }
  };

  return (
    <GuideContext.Provider
      value={{
        visible,
        steps,
        index,
        handleStart,
        handleStop,
        handleNext,
        handlePrev,
      }}
    >
      {children}
      {visible ? (
        <GuideOverlay
          steps={steps}
          index={index}
          next={handleNext}
          prev={handlePrev}
          stop={handleStop}
        />
      ) : null}
    </GuideContext.Provider>
  );
};

/**
 * 引导弹窗上下文消费者组件
 * @returns {Object} - 引导弹窗上下文值
 */
export const useGuide = () => {
  const ctx = useContext(GuideContext);
  if (!ctx) {
    return { start: () => {}, stop: () => {}, next: () => {}, prev: () => {} };
  }
  const { handleStart, handleStop, handleNext, handlePrev, ...rest } = ctx;
  return {
    ...rest,
    start: handleStart,
    stop: handleStop,
    next: handleNext,
    prev: handlePrev,
  };
};
