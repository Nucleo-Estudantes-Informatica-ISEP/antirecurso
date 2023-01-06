<?php

namespace App\Http\Livewire\Exams;

use App\Models\AnswerQuestion;
use App\Models\Option;
use App\Models\Question;
use App\Models\Answer as AnswerModel;
use App\Models\Score;
use App\Models\Subject;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use Jantinnerezo\LivewireAlert\LivewireAlert;
use Livewire\Component;

class Answer extends Component
{
    use LivewireAlert;

    public Subject $subject;

    public array $answers = [];


    public Collection $questions;
    public Question $current_question;
    public int $current = 0;
    public string $selected = "";

    protected $listeners = [
        'submit'
    ];

    public function mount(Subject $subject) {
        $this->subject = $subject;

        /**
         * Let's get all the questions related to the subject and
         * filter them to get 10 random questions
         */
        $this->questions = Question::where(['subject_id' => $subject->id])->get()->random(10);
        $this->current_question = $this->questions[0];
    }

    public function select_answer(String $option) : void {
        /**
         * Because the user may shuffle back and forth (anxiety, I guess),
         * we first gotta make sure if the question was already answered or
         * not.
         *
         * If it was, we're going to have to change the value of the selected
         * to the $option passed by argument
         */
        if($this->was_question_answered($this->current)) {
            $this->answers[$this->current]['selected'] = $option;
        } else {
            /**
             * If the question wasn't previously answered, then we gotta add
             * it to our answers array
             */
            array_push($this->answers, [
                'question' => $this->current,
                'selected' => $option
            ]);
        }

        /**
         * We gotta pay attention to that question limit,
         * otherwise our little precious boy would crash
         */
        if($this->current < 9) {
            $next = $this->current + 1;
            $this->change_question(question: $next);
        }
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
        $this->current_question = $this->questions[$question];
    }

    /**
     * We gonna looooop through the array and check
     * which is the answer to the current_question.
     *
     * I might have to improve this later.
     *
     * @return string
     */
    public function selected_answer() : string {
        foreach($this->answers as $answer) {
            if ($answer['question'] == $this->current)
                return $answer['selected'];
        }

        return '';
    }

    public function was_question_answered(int $question) : bool {
        foreach($this->answers as $answer) {
            if ($answer['question'] == $question)
                return true;
        }

        return false;
    }

    public function finish() {
        $this->alert('warning', 'Tens a certeza que queres terminar o exame?', [
            'showDenyButton' => true,
            'denyButtonText' => 'Não',
            'showConfirmButton' => true,
            'confirmButtonText' => 'Sim',
            'onConfirmed' => 'submit',
            'position' => 'center',
            'toast' => false,
            'timer' => 9000,
            'confirmButtonColor' => '#d35d19',
        ]);
    }

    private function update_score(Score $score, int $points) : void {
        $currentScore = $score->score;

        /**
         * Don't forget to turn the points we just calculated
         * into it's absolute as if the number is negative
         * the final score will get all f*cked up
         */
        $temporaryScore = $currentScore - abs($points);

        $score->update([
            'score' => $temporaryScore > 0 ? $temporaryScore : 0
        ]);
    }

    private function create_score(int $points) : void {
        /**
         * To maintain the integrity of the system, we
         * have to make sure to always set the score to 0
         * whenever the points are negative.
         *
         * @var int $points
        */
        $score = $points > 0 ? $points : 0;

        Score::create([
            'score' => $score,
            'user_id' => auth()->user()->id,
            'subject_id' => $this->subject->id
        ]);
    }

    private function create_answer(int $points) : AnswerModel {
        $user = auth()->user();

        $score = $points > 0 ? $points : 0;

        /**
         * Foreach exam the user solves, we create an Answer record in the database,
         * and this will allow us to keep track of each attempt a user makes
         */
        $createdAnswer = AnswerModel::create([
            'score' => $score,
            'user_id' => $user->id ?? null,
            'subject_id' => $this->subject->id
        ]);

        foreach($this->answers as $answer) {
            $question = $this->questions[$answer['question']];

            /**
             * Keep in mind that the selected answer is the same as the
             * order of an Option, being that order 'a', 'b', 'c', ...
             *
             * @var Option $selectedOption
            */
            $selectedOption = Option::where(['question_id' => $question->id, 'order' => $answer['selected']])->first();

            /**
             * Finally, for each answer, we need to create a AnswerQuestion, so then
             * we can evaluate if it is right or wrong when showing the results
             */
            AnswerQuestion::create([
                'answer_id' => $createdAnswer->id,
                'question_id' => $question->id,
                'option_id' => $selectedOption->id,
            ]);
        }

        return $createdAnswer;
    }

    public function submit() {
        $correctAnswers = 0;
        $incorrectAnswers = 0;

        foreach($this->answers as $answer) {
            /**
            * First, we havew to get the question from the questions array
            * we created earlier, using the position that exists in the $answer['question'].
            * Once again, e have to overcomplicate this because of the possible shuffle between
            * questions.
            */
            $question = $this->questions[$answer['question']];

            if($question->correct_option == $answer['selected']) {
                $correctAnswers++;
            } else {
                $incorrectAnswers++;
            }
        }

        /**
         * The points will be calculated just like in a test, where each
         * correct answer has the value of 10 points.
         * However, the wrong answers will have a negative effect, removing
         * 3 points each.
         *
         * @var int $points
         *
         */
        $correctPoints = $correctAnswers * 10;
        $incorrectPoints = $incorrectAnswers * 3;

        $points = $correctPoints - $incorrectPoints;

        /**
         * After doing the exam, let's verify if the user exists
         * and, if it does, let's create / update the score for
         * the subject
         */
        if(auth()->user()) {
            $score = Score::where(['user_id' => auth()->user()->id, 'subject_id' => $this->subject->id])->first();

            if($score) {
                $this->update_score(score: $score, points: $points);
            } else {
                $this->create_score(points: $points);
            }
        }

        $answer = $this->create_answer(points: $points);

        /**
         * Finally, before changing the page, we'll create a session variable
         * to store the points, and other to pass the wrong ones. This way we won't have to pass the variables back
         * and forth.
         */
        Session::put('points', $points);
        Session::put('wrong_answers', $incorrectAnswers);

        /**
         * We should also store the $answer variable for the exams.points view.
         * There we'll call the page to check the answers and we'll need this answer variable
         */
        Session::put('answer', $answer);

        return redirect()->route('exams.points', ['slug' => $this->subject->slug]);
    }

    public function render()
    {
        return view('livewire.exams.answer');
    }
}
