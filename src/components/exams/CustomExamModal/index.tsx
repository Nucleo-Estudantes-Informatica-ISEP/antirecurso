import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import swal from 'sweetalert';

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

const discounts = [
  { value: 0, label: '0%' },
  { value: 0.1, label: '10%' },
  { value: 0.25, label: '25%' },
  { value: 0.33, label: '33%' },
  { value: 0.5, label: '50%' },
  { value: 1, label: '100%' }
];

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'new', label: 'Novas' }
];

const CustomExamModal: React.FC<ModalProps> = ({ isVisible, setIsVisible, title, params }) => {
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [discount, setDiscount] = useState<number | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const router = useRouter();

  const handleSaveClick = () => {
    if (numberOfQuestions && discount !== null && filter !== null) {
      setIsVisible(false);
      router.push(
        `/exams/${params.id}/answer/${params.mode}?n_of_questions=${numberOfQuestions}&penalizing_factor=${discount}&filter=${filter}`
      );
    } else {
      swal('Erro', 'Preenche todos os campos!', 'error');
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">{title}</DialogTitle>
          <DialogDescription>
            Configura as opções abaixo para criares o teu exame personalizado.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Number of Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Número de questões</h3>
              <span className="text-sm">
                <span className="text-primary font-bold text-base">{numberOfQuestions}</span>{' '}
                <span className="text-muted-foreground">questões</span>
              </span>
            </div>
            <Slider
              min={5}
              max={50}
              step={1}
              value={[numberOfQuestions]}
              onValueChange={(values) => setNumberOfQuestions(values[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          {/* Penalty */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Penalização por erro</h3>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {discounts.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDiscount(d.value)}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md border h-10 text-sm font-medium transition-colors',
                    discount === d.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Escolhe a percentagem de penalização para cada resposta errada.
            </p>
          </div>

          {/* Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Filtro de questões</h3>
            <div className="grid grid-cols-2 gap-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md border h-10 text-sm font-medium transition-colors',
                    filter === f.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Aplica um filtro às questões do teu exame.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsVisible(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveClick}
            disabled={discount === null || filter === null}
            className="w-full sm:w-auto"
          >
            Criar exame
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomExamModal;
