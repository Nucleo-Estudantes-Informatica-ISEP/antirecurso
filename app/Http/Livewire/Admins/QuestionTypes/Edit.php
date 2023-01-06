<?php

namespace App\Http\Livewire\Admins\QuestionTypes;

use App\Models\QuestionType;
use Livewire\Component;

class Edit extends Component
{

    public QuestionType $questionType;

    public string $name = "";
    public ?int $subject_id = null;

    protected $rules = [
        'name' => 'required|min:1',
        'subject_id' => 'required|exists:subjects,id'
    ];

    public function mount(QuestionType $questionType) {
        $this->questionType = $questionType;

        $this->fill($this->questionType);
    }

    public function submit() {
        $data = $this->validate($this->rules);
        $this->questionType->update($data);

        return redirect()->route('admins.question-types.index');
    }

    public function render()
    {
        return view('livewire.admins.question-types.edit');
    }
}
