import { Toaster } from 'sonner';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'Merriweather, Georgia, serif',
        },
        className: 'font-body',
      }}
      icons={{
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
      }}
    />
  );
};

export default ToastProvider;
