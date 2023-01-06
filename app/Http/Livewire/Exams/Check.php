<?php

namespace App\Http\Livewire\Exams;

use App\Models\Answer;
use App\Models\AnswerQuestion;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Support\Collection;
use Livewire\Component;

class Check extends Component
{

    public Subject $subject;
    public Answer $answer;

    public Collection $answer_questions;
    public AnswerQuestion $current_question;
    public int $current = 0;
    public string $selected = "";

    public function mount(Subject $subject, Answer $answer) {
        $this->subject = $subject;
        $this->answer = $answer;

        $this->answer_questions = AnswerQuestion::where(['answer_id' => $this->answer->id])->get();
        $this->current_question = $this->answer_questions[0];
    }

    /**
     * A simple function to change the current question.
     * Keep in mind that in order to track the current_question
     * we also gotta change the current variable.
     *
     * @param int $question
     * @return void
     */
    public function change_question(int $question) : void {
        /**
         * In case someone decides to try and f*ck the system.
         * Keep in midn that, for us programmers, the qeustions start at 0,
         * just like an array
         */
        if($question < 0 || $question > 9) {
            $question = 0;
        }

        $this->current = $question;
        $this->current_question = $this->answer_questions[$question];
    }

    public function is_correct_option(string $option) : bool {
        $correct_option = $this->current_question->question->correct_option;

        return $correct_option == $option;
    }

    public function render()
    {
        return view('livewire.exams.check');
    }
}
