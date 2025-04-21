import React from 'react';
import { useReactFlow, Panel, PanelPosition } from 'reactflow';
import { FiZoomIn, FiZoomOut, FiMaximize2, FiClipboard } from 'react-icons/fi';

interface CustomControlsProps {
  position?: PanelPosition;
  showZoom?: boolean;
  showFitView?: boolean;
  showPaste?: boolean;
  copiedNode: any | null;
  onPaste: () => void;
}

const CustomControls: React.FC<CustomControlsProps> = ({
  position = 'bottom-right',
  showZoom = true,
  showFitView = true,
  showPaste = true,
  copiedNode,
  onPaste,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const onZoomInHandler = () => {
    zoomIn();
  };

  const onZoomOutHandler = () => {
    zoomOut();
  };

  const onFitViewHandler = () => {
    fitView();
  };

  const onPasteHandler = () => {
    onPaste();
  };

  // 通用按钮样式
  const buttonStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '4px',
    backgroundColor: '#fefefe',
    border: '1px solid #eee',
    marginBottom: '5px',
    color: '#555',
    transition: 'all 0.2s ease-in-out',
  };

  // 禁用按钮样式
  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <Panel position={position} className="react-flow__controls">
      {showZoom && (
        <>
          <button
            type="button"
            onClick={onZoomInHandler}
            className="react-flow__controls-button react-flow__controls-zoomin"
            title="放大"
            style={buttonStyle}
          >
            <FiZoomIn />
          </button>
          <button
            type="button"
            onClick={onZoomOutHandler}
            className="react-flow__controls-button react-flow__controls-zoomout"
            title="缩小"
            style={buttonStyle}
          >
            <FiZoomOut />
          </button>
        </>
      )}
      {showFitView && (
        <button
          type="button"
          onClick={onFitViewHandler}
          className="react-flow__controls-button react-flow__controls-fitview"
          title="适应视图"
          style={buttonStyle}
        >
          <FiMaximize2 />
        </button>
      )}
      {showPaste && (
        <button
          type="button"
          onClick={onPasteHandler}
          className="react-flow__controls-button react-flow__controls-paste"
          title="粘贴节点 (Ctrl+V)"
          style={copiedNode ? buttonStyle : disabledButtonStyle}
          disabled={!copiedNode}
        >
          <FiClipboard />
        </button>
      )}
    </Panel>
  );
};

export default CustomControls;