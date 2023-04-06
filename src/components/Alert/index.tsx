import { Danger } from '@/styles/Icons';
import { motion } from 'framer-motion';

interface AlertProps {
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Alert: React.FC<AlertProps> = ({ text, confirmText, cancelText, onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center py-6 justify-around bg-white rounded shadow-lg max-w-xl h-80">
              <motion.div
                initial={{ rotateY: 60, opacity: 0, scale: 0 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: 60,  opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}>
                <Danger className="text-primary" size={80} />
              </motion.div>
              <h1 className="text-4xl font-bold">{text}</h1>
              <div className="flex justify-center gap-4 mt-5">
                <button
                  className="bg-primary text-white px-5 py-2 rounded hover:bg-primary-dark"
                  onClick={onConfirm}>
                  {confirmText}
                </button>
                <button
                  className="bg-gray-200 text-gray-600 px-5 py-2 rounded hover:bg-gray-300"
                  onClick={onCancel}>
                  {cancelText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Alert;
