import { Button, Typography } from '@douyinfe/semi-ui';
import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import './styles.css';

/**
 * 引导弹窗组件
 * @param {Array} props.steps - 引导步骤配置数组
 * @param {number} props.index - 当前引导步骤索引
 * @param {Function} props.next - 下一步函数
 * @param {Function} props.prev - 上一步函数
 * @param {Function} props.stop - 停止引导函数
 */
const GuideOverlay = ({ steps, index, next, prev, stop }) => {
  // 获取当前引导步骤
  const step = steps[index] || {};
  // 获取目标元素
  const el = step.selector ? document.querySelector(step.selector) : null;
  // 目标元素rect状态（随滚动/尺寸变化更新）
  const [rect, setRect] = useState(null);
  // 弹窗展示位置与间距
  const placement = step.placement || 'bottom';
  // 弹窗与目标元素间距
  const gap = 16;
  // 卡片ref与尺寸
  const cardRef = useRef(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  // 更新目标rect
  const updateRect = () => {
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect(
      r
        ? {
            left: r.left,
            top: r.top,
            right: r.right,
            bottom: r.bottom,
            width: r.width,
            height: r.height,
          }
        : null
    );
  };

  // 步骤变化或selector变化时更新一次
  useLayoutEffect(() => {
    updateRect();
  }, [index, step?.selector]);

  // 监听滚动/窗口尺寸变化/方向变化 + 祖先可滚动容器，自动更新rect定位
  useEffect(() => {
    let rafId = 0;
    const onMove = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateRect);
    };
    // 判断父元素是否滚动
    const parents = [];
    let node = el?.parentElement;
    while (node) {
      const style = getComputedStyle(node);
      if (
        /(auto|scroll)/.test(style.overflowY) ||
        /(auto|scroll)/.test(style.overflowX)
      )
        parents.push(node);
      node = node.parentElement;
    }
    // 绑定事件
    window.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove, true);
    window.addEventListener('orientationchange', onMove, true);
    parents.forEach((p) => p.addEventListener('scroll', onMove));
    updateRect();
    // 监听完后解绑事件
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove, true);
      window.removeEventListener('orientationchange', onMove, true);
      parents.forEach((p) => p.removeEventListener('scroll', onMove));
    };
  }, [el]);

  // 获取并监听卡片尺寸，用于后面精准计算定位
  const measureCard = () => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    if (r?.width && r?.height)
      setCardSize({ width: r.width, height: r.height });
  };
  useLayoutEffect(() => {
    measureCard();
  }, [index]);

  // 监听卡片尺寸变化，实时更新定位
  useEffect(() => {
    if (!cardRef.current) return;
    const ro = new ResizeObserver(() => measureCard());
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [cardRef]);

  // 计算卡片的位置
  const computePos = () => {
    if (!rect)
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed',
      };

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = cardSize.width || 320;
    const ch = cardSize.height || 120;
    const margin = 16;
    let left = rect.left;
    let top = rect.bottom + gap;

    switch (placement) {
      case 'top':
        top = rect.top - gap - ch;
        left = rect.left + (rect.width - cw) / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + (rect.width - cw) / 2;
        break;
      case 'left':
        left = rect.left - gap - cw;
        top = rect.top + (rect.height - ch) / 2;
        break;
      case 'right':
        left = rect.right + gap;
        top = rect.top + (rect.height - ch) / 2;
        break;
    }

    const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
    left = clamp(left, margin, vw - cw - margin);
    top = clamp(top, margin, vh - ch - margin);

    return { position: 'fixed', left, top };
  };
  const pos = computePos();

  return (
    <>
      {/* 绘制引导弹窗背后的半透明遮罩（通过4块div拼凑实现中间镂空的效果） */}
      {rect ? (
        <>
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              right: 0,
              height: Math.max(rect.top - 8, 0),
              background: 'rgba(0,0,0,0.45)',
              zIndex: 9998,
            }}
          />
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: rect.top - 8,
              width: Math.max(rect.left - 8, 0),
              height: rect.height + 16,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 9998,
            }}
          />
          <div
            style={{
              position: 'fixed',
              left: rect.right + 8,
              top: rect.top - 8,
              right: 0,
              height: rect.height + 16,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 9998,
            }}
          />
          <div
            style={{
              position: 'fixed',
              left: 0,
              top: rect.bottom + 8,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 9998,
            }}
          />
        </>
      ) : (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 9998,
          }}
        />
      )}
      {/* 引导弹窗） */}
      {rect ? (
        <div
          style={{
            position: 'fixed',
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            borderRadius: 4,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      {/* 引导弹窗卡片 */}
      <div
        ref={cardRef}
        style={{ ...pos, zIndex: 10000, maxWidth: 360 }}
        className={`guide-card-container ${placement}`}
      >
        <div className={`guide-card ${placement}`}>
          <div className="guide-card-title">
            {step.title || `步骤 ${index + 1}/${steps.length}`}
          </div>
          <Typography.Text type="secondary">
            {step.content || ''}
          </Typography.Text>
          <div className="guide-card-actions">
            <Button
              disabled={index === 0}
              onClick={prev}
              size="small"
              style={{ marginRight: 8 }}
            >
              上一步
            </Button>
            {index < steps.length - 1 ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  theme="borderless"
                  type="secondary"
                  onClick={stop}
                  size="small"
                >
                  跳过
                </Button>
                <Button
                  theme="solid"
                  type="primary"
                  onClick={next}
                  size="small"
                >
                  下一步
                </Button>
              </div>
            ) : (
              <Button theme="solid" type="primary" onClick={stop} size="small">
                完成
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideOverlay;
