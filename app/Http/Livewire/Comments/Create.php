<?php

namespace App\Http\Livewire\Comments;

use App\Models\Comment;
use App\Models\Question;
use Livewire\Component;

class Create extends Component
{

    public Question $question;

    public string $comment = "";

    protected $rules = [
        'comment' => 'required|min:1'
    ];

    public function mount(Question $question) {
        $this->question = $question;
    }

    public function submit() {
        /**
         * Let's first validate the comment introduced by the
         * user
         */
        $this->validate($this->rules);

        Comment::create([
            'comment' => $this->comment,
            'user_id' => auth()->user()->id,
            'question_id' => $this->question->id
        ]);
    }

    public function render()
    {
        return view('livewire.comments.create');
    }
}
