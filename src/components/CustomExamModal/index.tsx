import { useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';
import { useRouter } from 'next/navigation';

interface ModalProps {
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  onClose?: () => void;
  params: {
    id: number;
    mode: string;
  };
}

// @ts-expect-error ignore
const CustomExamModal: React.FC<ModalProps> = ({ isVisible, setIsVisible, title, params }) => {
  const numberOfQuestionRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLSelectElement>(null);
  const [selectedDiscount, setSelectedDiscount] = useState(0.1);

  const handleDiscountChange = () => {
    const selectedValue = discountRef.current!.value;
    setSelectedDiscount(parseFloat(selectedValue));
  };
  const router = useRouter();

  useEffect(() => {
    const closeWithEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    window.addEventListener('keydown', closeWithEsc);

    return () => window.removeEventListener('keydown', closeWithEsc);
  }, [setIsVisible]);

  const handleSaveClick = () => {
    const numberOfQuestions = numberOfQuestionRef.current?.value;
    const discount = discountRef.current?.value;

    if (numberOfQuestions && discount) {
      setIsVisible(false);
      router.push(
        `/exams/${params.id}/answer/${params.mode}?n_of_questions=${numberOfQuestions}&penalizing_factor=${discount}`
      );
    } else {
      swal('Erro', 'Preencha todos os campos!', 'error');
    }
  };

  const discounts = [
    { value: 0.1, label: '10%' },
    { value: 0.25, label: '25%' },
    { value: 0.33, label: '33%' },
    { value: 1, label: '100%' }
  ];

  return (
    isVisible && (
      <>
        <div className="fixed left-0 top-0 h-screen w-screen bg-secondary-dark p-20 z-20">
          <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center">
            <div
              className={`flex h-fit w-4/5 flex-col rounded-xl bg-primary p-8 items-center justify-center`}>
              <button
                onClick={() => setIsVisible(false)}
                className="self-end text-2xl font-black text-red-500 hover:text-red-600 z-20">
                X
              </button>
              <span className="-mt-9 mb-6 w-full text-center text-4xl font-black">{title}</span>
              <div className="max-h-[75vh] overflow-y-auto">
                <div className="flex flex-col items-center justify-between mb-6 ">
                  <label className="w-full p-2">Número de Questões</label>
                  <input
                    className="w-full p-2"
                    placeholder="Número de Questões"
                    ref={numberOfQuestionRef}
                  />
                  <span className="text-xs mt-1">
                    (Escolhe o número de questões que queres responder no exame)
                  </span>
                </div>
                <div className="flex flex-col items-center justify-between gap-x-8">
                  <label className="w-full p-2">Desconto nas perguntas</label>
                  <select
                    className="w-full p-2 text-black"
                    placeholder="Desconto"
                    ref={discountRef}
                    value={selectedDiscount}
                    onChange={handleDiscountChange}>
                    {discounts.map((discount) => (
                      <option key={discount.value} value={discount.value}>
                        {discount.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs mt-1">
                    (Escolhe a percentagem de penalização para cada resposta errada)
                  </span>
                </div>
              </div>
              <button
                name="criar exame"
                onClick={handleSaveClick}
                className="w-1/5 mt-4 p-2 text-xl text-white rounded-md bg-primary-dark font-bold">
                Criar exame
              </button>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default CustomExamModal;
