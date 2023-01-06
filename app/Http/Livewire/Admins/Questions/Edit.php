<?php

namespace App\Http\Livewire\Admins\Questions;

use App\Models\Option;
use App\Models\Question;
use App\Models\QuestionType;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;

class Edit extends Component
{

    public Question $databaseQuestion;

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

    public array $options = [];

    public function mount(Question $question) {
        $this->databaseQuestion = $question;

        foreach(Option::where(['question_id' => $this->databaseQuestion->id])->get() as $option) {
            array_push($this->options, [
                'name' => $option->name,
                'order' => $option->order
            ]);
        }

        $this->fill($this->databaseQuestion);
        $this->questionTypes = QuestionType::where(['subject_id' => $this->subject_id])->get();
    }

    public function updated() {
        if($this->subject_id) {
            $this->questionTypes = QuestionType::where(['subject_id' => $this->subject_id])->get();
        }
    }

    public function submitOption() {
        $this->validate([
            'option' => 'required|min:1'
        ]);

        $this->submitEditOption();

        $this->option = "";
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

    private function submitEditOption() {
        $this->options[$this->key]['name'] = $this->option;

        $this->is_editing = false;
        $this->key = null;
    }

    public function submit() {
        $data = $this->validate([
            'question' => 'required|min:1|unique:questions,question,' . $this->databaseQuestion->id,
            'correct_option' => 'required|min:1',
            'exam' => 'required|min:1',
            'image' => 'nullable',
            'subject_id' => 'required|exists:subjects,id',
            'question_type_id' => 'required|exists:question_types,id'
        ]);

        $this->databaseQuestion->update($data);

        foreach($this->databaseQuestion->options as $key => $option) {
            $option->update([
                'name' => $this->options[$key]['name']
            ]);
        }

        return redirect()->route('admins.questions.index');
    }

    public function render()
    {
        return view('livewire.admins.questions.edit');
    }
}
