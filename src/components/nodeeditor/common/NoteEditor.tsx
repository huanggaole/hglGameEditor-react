import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface NoteEditorProps {
  note: string;
  setNote: (value: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, setNote }) => {
  const { t } = useLanguage();
  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>{t.note}:</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: '100%', padding: '5px', minHeight: '100px' }}
      />
    </div>
  );
};

export default NoteEditor;