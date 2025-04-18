import { useLanguage } from '../../../contexts/LanguageContext';

interface ShowInfoDisplayProps {
  showInfo?: string;
  label?: string;
  mname?: string;
}

// 文本截断辅助函数
const truncateText = (text: string): string => {
  if (text.length > 5) {
    return text.substring(0, 5) + '...';
  }
  return text;
};

export const ShowInfoDisplay = ({ showInfo, label, mname }: ShowInfoDisplayProps) => {
  const { t } = useLanguage();

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{mname || label}</div>
      {showInfo && (
        <div>
          {t.showInfo}: {truncateText(showInfo)}
        </div>
      )}
    </div>
  );
};