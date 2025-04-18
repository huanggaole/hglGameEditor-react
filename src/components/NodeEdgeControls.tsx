import React from 'react';
import { Node, Edge } from 'reactflow';
import { useLanguage } from '../contexts/LanguageContext';

interface NodeControlsProps {
  node: Node;
  onEdit: (node: Node) => void;
  onDelete: (nodeId: string) => void;
  onCopy?: (node: Node) => void;
}

interface EdgeControlsProps {
  edge: Edge;
  onEdit: (edge: Edge) => void;
  onDelete: (edgeId: string) => void;
}

// 节点操作按钮组件
export const NodeControls: React.FC<NodeControlsProps> = ({ node, onEdit, onDelete, onCopy }) => {
  return (
    <div
      className="node-controls"
      style={{
        position: 'absolute',
        top: '-30px',
        right: '0',
        display: 'flex',
        gap: '5px',
        zIndex: 10,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(node);
        }}
        style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        {useLanguage().t.edit || '编辑'}
      </button>
      {node.type === 'container' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            node.data.onEnter && node.data.onEnter(node.id);
          }}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {useLanguage().t.enter || '进入'}
        </button>
      )}
      {node.type !== 'start' && node.type !== 'entry' && onCopy && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(node);
          }}
          style={{
            backgroundColor: '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {useLanguage().t.copy || '复制'}
        </button>
      )}
      {node.type !== 'start' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          style={{
            backgroundColor: '#e24a4a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          {useLanguage().t.delete || '删除'}
        </button>
      )}
    </div>
  );
};

// 边操作按钮组件
export const EdgeControls: React.FC<EdgeControlsProps> = ({ edge, onEdit, onDelete }) => {
  return (
    <div
      className="react-flow__edge-controls"
      style={{
        position: 'absolute',
        display: 'flex',
        gap: '5px',
        zIndex: 10,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(edge);
        }}
        style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        {useLanguage().t.edit || '编辑'}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(edge.id);
        }}
        style={{
          backgroundColor: '#e24a4a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        {useLanguage().t.delete || '删除'}
      </button>
    </div>
  );
};