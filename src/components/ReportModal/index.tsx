import { useEffect } from 'react';
import Slider from '../Slider';
import Report from '@/types/Report';
import { Check } from '@/styles/Icons';

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
    <div className={`fixed left-0 top-0 h-screen w-full bg-gray-500/60 z-20 items-center justify-center ${isVisible ? 'fixed' : 'hidden'}`}>
      <div className="fixed left-0 z-20 flex h-screen w-full outline-none items-center justify-center overflow-y-auto overflow-x-hidden overflow-y-scroll">
        <div className={`flex flex-col w-full md:w-1/2 rounded-lg top-14 pb-8 lg:px-32 bg-gray-200 dark:bg-gray-700 items-center justify-around relative `}>
          <button
            onClick={() => setIsVisible(false)}
            className="text-2xl font-black text-red-500 hover:text-red-600 z-20 absolute top-10 right-10">
            X
          </button>
          <span className="w-full text-center text-xl lg:text-3xl font-black mb-6 px-2 pt-10 ">
            Report [{report?.id}]
          </span>
          <div className="h-full w-full">
            <div className="flex flex-col justify-between mb-12">
              <h2 className="w-full font-bold mb-6 text-lg  md:text-left">
                Descrição do report
              </h2>
              <span >
                {report?.reason}
              </span>
            </div>
            <div className="flex flex-col justify-between mb-12">
              <h2 className="w-full font-bold mb-6 text-lg md:text-left">
                Questão
              </h2>
              <span className="pb-4">
                {report?.question.title}
              </span>

              {report?.question.options.map((option, index) => (
                <span key={index} className="pb-2">
                  <div className={`w-full flex items-center px-1.5 md:px-4 py-2 md:py-3 border border-gray-100 min-h-[4rem] md:min-h-[5rem] rounded 
                    ${report?.question.correct_option === option.order && 'bg-primary text-white'}`}>
                    {option.name}
                    {report?.question.correct_option === option.order && <Check className="ml-1.5 md:ml-4" />}
                  </div>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col  mb-12">
                <h2 className="w-full font-bold mb-6 text-lg ">
                  Reportado por
                </h2>
                <p>
                  {report?.user}
                </p>
                <p>
                  {report?.email}
                </p>
                <p>
                  {report?.updated_at}
                </p>
              </div>
              {report?.solved && (
                <div className="flex flex-col mb-12">
                  <h2 className="w-full font-bold mb-6 text-lg">
                    Resolvido por
                  </h2>
                  <p>
                    {report?.reviewed_by?.name}
                  </p>
                  <p>
                    {report?.reviewed_by?.email}
                  </p>
                  <p>
                    {report?.reviewed_at}
                  </p>
                </div>
              )}
            </div>
          </div>
          {!report?.solved && (
              <button
                name="Criar Exame"
                className="w-full mt-2 p-2 text-xl bg-primary rounded-md text-white font-bold hover:brightness-90 hover:text-white"
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
