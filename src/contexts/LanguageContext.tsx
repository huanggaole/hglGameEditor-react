import React, { createContext, useState, useContext, ReactNode } from 'react';
import locales, { LanguageType, LocaleTexts } from '../locales';

// 语言上下文接口
interface LanguageContextType {
  currentLanguage: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: LocaleTexts; // 当前语言的文本
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 语言提供者属性接口
interface LanguageProviderProps {
  children: ReactNode;
}

// 语言提供者组件
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // 默认使用中文
  const [currentLanguage, setCurrentLanguage] = useState<LanguageType>('zh');
  
  // 获取当前语言的文本
  const t = locales[currentLanguage];
  
  // 设置语言的函数
  const setLanguage = (lang: LanguageType) => {
    setCurrentLanguage(lang);
  };
  
  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言的自定义Hook
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};