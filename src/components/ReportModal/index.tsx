"use client";

import { useEffect, useState, useRef } from 'react';
import Report from '@/types/Report';
import Option from '@/types/Option';
import { Check } from '@/styles/Icons';
import { FaEdit } from "react-icons/fa";

interface ModalProps {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  report: Report | null;
  solveReport: (reportId: number) => void;
}

const ReportModal: React.FC<ModalProps> = ({ isVisible, setIsVisible, report, solveReport }) => {

  // form
  const [questionTitle, setQuestionTitle] = useState<string>(report?.question.title ?? '');
  const [options, setOptions] = useState<Option[]>(report?.question.options ?? []);
  const [correctOption, setCorrectOption] = useState<string>(report?.question.correct_option ?? '');

  const [editingQuestionTitle, setEditingQuestionTitle] = useState(false);
  const [editingOption, setEditingOption] = useState<number | null>(null);

  // toggle edit mode for the question title
  const handleQuestionEdit = () => {
    setEditingQuestionTitle(true);
  };

  // toggle edit mode for an option
  const handleOptionEdit = (index: number) => {
    setEditingOption(index);
    if (editingQuestionTitle) setEditingQuestionTitle(false);
  };

  // handle input change for option
  const handleOptionInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    // Handle input change for option
  };

  // When the report changes, update the form
  useEffect(() => {
    if (report) {
      // update form
      setQuestionTitle(report.question.title);
      setOptions(report.question.options);
      setCorrectOption(report.question.correct_option);
    }
  }, [report]);


  useEffect(() => {
    const closeWithEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    window.addEventListener('keydown', closeWithEsc);

    return () => window.removeEventListener('keydown', closeWithEsc);
  }, [setIsVisible]);

  return (
    <div className={`fixed left-0 top-0 h-screen w-full bg-gray-500/60 z-20 items-center justify-center ${isVisible ? 'fixed' : 'hidden'}`}>
      <div className="fixed left-0 z-20 pt-44 flex h-screen w-full outline-none items-center justify-center overflow-y-auto ">
        <div className={`flex flex-col w-full md:w-1/2 rounded-lg top-14 pb-8 lg:px-32 bg-gray-200 dark:bg-gray-700 items-center justify-around relative overflow-x-hidden overflow-y-scroll`}>
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
                Razão do report
              </h2>
              <span >
                {report?.reason}
              </span>
            </div>
            <div className="flex flex-col justify-between mb-6">
              <h2 className="w-full font-bold mb-6 text-lg md:text-left">
                Questão
              </h2>
              <span className="pb-4 flex" onClick={handleQuestionEdit}>
                {editingQuestionTitle ? (
                  <textarea
                    className="w-full px-1.5 md:px-4 py-2 md:py-3 rounded bg-transparent border"
                    // ref={textAreaRef}
                    rows={2}
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    onBlur={() => setEditingQuestionTitle(false)}
                  />
                ) : (
                  <>
                    {report?.question.title} <FaEdit className="mx-8 cursor-pointer" title="Editar" />
                  </>
                )}

              </span>

              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className={`w-full flex items-center justify-between px-1.5 md:px-4 py-2 md:py-3 border border-gray-100 min-h-[4rem] md:min-h-[5rem] rounded cursor-pointer 
                    ${correctOption === option.order ? 'bg-primary text-white' : ''}`}
                    onClick={() => handleOptionEdit(index)}
                    title="Editar"
                  >
                    {editingOption === index ? (
                      <textarea
                        className="w-full px-1.5 md:px-4 py-2 md:py-3 rounded bg-transparent border focus:outline-none focus:border-none"
                        rows={4}
                        value={option.name}
                        onChange={(event) => handleOptionInputChange(event, index)}
                        onBlur={() => setEditingOption(null)}
                      />
                    ) : (
                      option.name
                    )}
                  </div>

                  <div className="mt-2 ml-4 cursor-pointer">
                    <Check title="Marcar como correta" />
                  </div>

                </div>
              ))}
            </div>

            <div className="flex items-left mb-12">
              <button className="w-full p-2 mr-8 text-xl bg-primary rounded-md text-white font-bold hover:brightness-90 hover:text-white ">Salvar</button>
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
                  {report?.created_at}
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
