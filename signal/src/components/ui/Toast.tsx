import { Toaster } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

export const ToastProvider = () => {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f1f5f9' : '#0f172a',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          borderRadius: '12px',
          fontSize: '14px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        success: {
          iconTheme: { primary: '#f59e0b', secondary: isDark ? '#1e293b' : '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: isDark ? '#1e293b' : '#ffffff' },
        },
      }}
    />
  );
};
