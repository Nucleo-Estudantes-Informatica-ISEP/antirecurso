import { useEffect } from 'react';
import Slider from '../Slider';
import Report from '@/types/Report';

interface ModalProps {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  report: Report | null;
  solveReport: (reportId: number) => void;
}

const ReportModal: React.FC<ModalProps> = ({ isVisible, setIsVisible, report, solveReport }) => {



  useEffect(() => {
    const closeWithEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    window.addEventListener('keydown', closeWithEsc);

    return () => window.removeEventListener('keydown', closeWithEsc);
  }, [setIsVisible]);

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-full bg-gray-500/60 z-20 items-center justify-center ${isVisible ? 'fixed' : 'hidden'
        }`}>
      <div className="fixed left-0 top-0 z-20 flex h-screen w-full items-center justify-center overflow-y-scroll">
        <div
          className={`flex w-full md:w-1/2 flex-col mx-6 rounded-lg p-14 lg:px-32 bg-gray-200 dark:bg-gray-700 items-center gap-y-6 justify-around relative min-h-[520px]`}>
          <button
            onClick={() => setIsVisible(false)}
            className="text-2xl font-black text-red-500 hover:text-red-600 z-20 absolute top-10 right-10">
            X
          </button>
          <span className="w-full text-center text-xl md:text-3xl font-black mb-6 px-2">
            Report [{report?.id}]
          </span>
          <div className="h-full w-full">
            <div className="flex flex-col items-center justify-between mb-12">
              <h2 className="w-full font-bold mb-6 text-lg text-center md:text-left">
                Descrição do report
              </h2>
              <span >
                {report?.reason}
              </span>
            </div>
            <div className="flex flex-col items-center justify-between mb-12">
              <h2 className="w-full font-bold mb-6 text-lg text-center md:text-left">
                Questão
              </h2>
              <span>
                {report?.question.title}
              </span>
              <span>
                {report?.question.options.map((option, index) => (
                  <div className="w-full border-gray-400 border h-full md:h-12 text-sm md:text-base flex flex-col md:flex-row items-center justify-center rounded-lg">
                   
                      {option.name}
                   
                      {report?.question.correct_option === option.order && <span>✅</span>}
                  
                  </div>

                ))}
              </span>
            </div>
            <div className="flex flex-col items-center justify-between mb-12">
              <h2 className="w-full font-bold mb-6 text-lg text-center md:text-left">
                Submetido por
              </h2>
              <span >
                {report?.user} - {report?.email}
              </span>
            </div>
            {report?.solved && (
              <div className="flex flex-col items-center justify-between mb-12">
                <h2 className="w-full font-bold mb-6 text-lg text-center md:text-left">
                  Resolvido por
                </h2>
                <span>
                  {report?.reviewed_by?.name} - {report?.reviewed_by?.email}
                </span>
                <span>
                  {report?.reviewed_at}
                </span>
              </div>
            )
            }

          </div>
          {!report?.solved && (
            <button
              name="Criar Exame"
              className="w-full mt-8 p-2 text-xl bg-primary rounded-md text-white disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 font-bold enabled:hover:brightness-90 enabled:hover:text-white"
              onClick={() => { solveReport(report?.id ?? 0); setIsVisible(false) }}
            >
              Marcar Como Resolvido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
