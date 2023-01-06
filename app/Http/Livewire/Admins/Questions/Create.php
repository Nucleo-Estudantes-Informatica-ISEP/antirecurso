<?php

namespace App\Http\Livewire\Admins\Questions;

use App\Models\Option;
use App\Models\Question;
use App\Models\QuestionType;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;

class Create extends Component
{

    public string $question = "";
    public string $correct_option = "";
    public string $exam = "";
    public string $image = "";
    public ?int $subject_id = null;
    public ?int $question_type_id = null;
    public ?Collection $questionTypes = null;

    public string $option = "";

    /**
     * This variable will allow us to control if the user is
     * editing an option or simply adding one
     *
     * @var bool
     */
    public bool $is_editing = false;

    public ?int $key = null;

    public array $order = [
        1 => 'a',
        2 => 'b',
        3 => 'c',
        4 => 'd'
    ];
    public int $current_order = 1;

    public array $options = [];

    protected $rules = [
        'question' => 'required|min:1|unique:questions,question',
        'correct_option' => 'required|min:1',
        'exam' => 'required|min:1',
        'image' => 'nullable',
        'subject_id' => 'required|exists:subjects,id',
        'question_type_id' => 'required|exists:question_types,id'
    ];

    public function updated() {
        if($this->subject_id) {
            $this->questionTypes = QuestionType::where(['subject_id' => $this->subject_id])->get();
        }
    }

    public function editOption(int $key) {
        /**
         * Get the name of the option in the selected key,
         * while keeping it's order
         */
        $this->option = $this->options[$key]['name'];

        $this->key = $key;
        $this->is_editing = true;
    }

    public function submitOption() {
        $this->validate([
            'option' => 'required|min:1'
        ]);

        /**
         * If the is_editing variable is false, then
         * it means we want to add the option to our array.
         * Otherwise, we're going to edit it
         */
        if(!$this->is_editing) {
            $this->addOption();
        } else {
            $this->submitEditOption();
        }

        $this->option = "";
    }

    private function addOption() {
        /**
         * We'll limit the number of options to 4, but
         * let's make it in a way we can change later
         */
        if($this->current_order > 4) {
            return $this->addError('option', 'Que estás a fazer? Não podes adicionar mais que 4 opções! Mau mau Maria!');
        } else {
            array_push($this->options, [
                'name' => $this->option,
                'order' => $this->order[$this->current_order],
            ]);

            $this->current_order++;
        }
    }

    private function submitEditOption() {
        $this->options[$this->key]['name'] = $this->option;

        $this->is_editing = false;
        $this->key = null;
    }

    public function submit() {
        $data = $this->validate($this->rules);
        $question = Question::create($data);

        /**
         * After creating our creation we have to create all of it's options,
         * just like a fall.
         * The Niagara falls. Oh wait...
         */
        foreach($this->options as $option) {
            Option::create([
                'name' => $option['name'],
                'order' => $option['order'],
                'question_id' => $question->id
            ]);
        }

        return redirect()->route('admins.questions.index');
    }

    public function render()
    {
        return view('livewire.admins.questions.create');
    }
}
