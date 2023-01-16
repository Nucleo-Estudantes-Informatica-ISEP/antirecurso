<?php

namespace App\Http\Livewire\Admins\Subjects;

use App\Jobs\QuestionsParser as JobsQuestionsParser;
use App\Models\Option;
use App\Models\Question;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Component;
use Livewire\WithFileUploads;

class QuestionsParser extends Component
{

    use WithFileUploads;

    public $questions_file;

    public int $subject_id;

    protected $rules = [
        'subject_id' => 'required|exists:subjects,id',
        'questions_file' => 'required|max:3096|mimes:json'
    ];

    public function submit() {
        $this->validate($this->rules);

        $path = $this->questions_file->store('questions', 'public');

        JobsQuestionsParser::dispatch(path: $path, subject_id: $this->subject_id);

        return redirect()->route('admins.questions.index');
    }

    private function get_correct_letter_to_index(int $index) {
        $correct_option = 'a';

        switch($index) {
            case 1:
                $correct_option = 'b';
                break;
            case 2:
                $correct_option = 'c';
                break;
            case 3:
                $correct_option = 'd';
                break;
        }

        return $correct_option;
    }

    public function render()
    {
        return view('livewire.admins.subjects.questions-parser');
    }
}
