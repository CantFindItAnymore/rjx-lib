import React, { useEffect, useRef, FC, ReactNode } from 'react';

type Props = {
  innerId: string;
  rectStyle?: {
    borderStyle?: string;
    borderWidth?: string | number;
    borderColor?: string;
    background?: string;
    opacity?: string;
  };
  clearDarw?: () => void;
  onSelected?: () => void;
  children?: ReactNode;
};

const DrawArea: FC<Props> = ({
  innerId,
  rectStyle = {
    borderStyle: 'solid',
    borderWidth: '4px',
    borderColor: 'orange',
    background: 'gold',
    opacity: '.2',
  },
  children,
}) => {
  const flag = useRef<boolean>(false);
  const startPoint = useRef<{
    clientX?: number;
    clientY?: number;
  }>({});

  // 手动清除画框

  useEffect(() => {
    const area: HTMLElement | null = document.getElementById(innerId);
    const rect: HTMLElement | null = document.getElementById('rect');

    if (!area || !rect) {
      return;
    }

    const downEvent = (e: { clientX: number; clientY: number }) => {
      // 显示画框，获取初始坐标， 并开启mousemove计算许可
      flag.current = true;
      startPoint.current = {
        clientX: e.clientX,
        clientY: e.clientY,
      };
      rect.style.display = 'block';
      rect.style.borderStyle = rectStyle.borderStyle ?? 'solid';
      rect.style.borderWidth = rectStyle.borderWidth
        ? typeof rectStyle.borderWidth === 'number'
          ? rectStyle.borderWidth + 'px'
          : rectStyle.borderWidth
        : '2px';
      rect.style.borderColor = rectStyle.borderColor ?? 'orange';
      rect.style.background = rectStyle.background ?? 'gold';
      rect.style.opacity = rectStyle.opacity ?? '.2';
      rect.style.width = '1px';
      rect.style.height = '1px';
      rect.style.left = e.clientX + 'px';
      rect.style.top = e.clientY + 'px';
    };
    const moveEvent = (e: { clientX: number; clientY: number }) => {
      if (!flag) {
        return;
      }
      if (!startPoint.current.clientX || !startPoint.current.clientY) {
        return;
      }
      // 动态获取坐标并实时渲染，注意这里需要考虑到鼠标移动可能是任何一个方向的😭
      rect.style.width = Math.abs(e.clientX - startPoint.current.clientX) + 'px';
      rect.style.height = Math.abs(e.clientY - startPoint.current.clientY) + 'px';
      rect.style.left = Math.min(startPoint.current.clientX, e.clientX) + 'px';
      rect.style.top = Math.min(startPoint.current.clientY, e.clientY) + 'px';
    };
    const upEvent = () => {
      // 计算抓取选中的组件，移除画框,关闭mousemove计算许可
      init();
    };

    const overEvent = (e: { which: number }) => {
      // 当画框时鼠标移出到了外面，并且松开了鼠标左键。则回来时取消框选
      if (e.which === 0) {
        init();
      }
    };

    area.addEventListener('mousedown', downEvent);
    area.addEventListener('mousemove', moveEvent);
    area.addEventListener('mouseup', upEvent);
    area.addEventListener('mouseover', overEvent);
    rect.addEventListener('mouseover', overEvent);

    return () => {
      area.removeEventListener('mousedown', downEvent);
      area.removeEventListener('mousemove', moveEvent);
      area.removeEventListener('mouseup', upEvent);
      area.removeEventListener('mouseover', overEvent);
      rect.removeEventListener('mouseover', overEvent);
    };
  }, [document.getElementById(innerId)?.id]);

  const init = () => {
    const rect: HTMLElement | null = document.getElementById('rect');
    if (!rect) {
      return;
    }
    rect.style.display = 'none';

    flag.current = false;
    startPoint.current = {};
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      {children}
      <div id="rect" style={{ position: 'absolute' }}></div>
    </div>
  );
};

export default DrawArea;
