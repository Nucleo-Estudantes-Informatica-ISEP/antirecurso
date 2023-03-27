<?php

namespace App\Jobs;

use App\Models\Option;
use App\Models\Question;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\File;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class QuestionsParser implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(public string $path, public int $subject_id)
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $file = asset($this->path);
        $jsonContent = file_get_contents($file);
        $exams = json_decode($jsonContent, true);

        foreach($exams as $name => $exam) {
            foreach($exam as $question) {
                $correct_option = $this->get_correct_letter_to_index(index: $question['correct_index']);

                if(Str::length($question['question']) < 255) {
                    $created_question = Question::create([
                        'question' => $question['question'],
                        'image' => 'image',
                        'correct_option' => $correct_option,
                        'exam' => $name,
                        'question_type_id' => 1,
                        'subject_id' => $this->subject_id
                    ]);

                    foreach($question['options'] as $key => $option) {
                        $order = $this->get_correct_letter_to_index($key);

                        Option::create([
                            'name' => $option,
                            'order' => $order,
                            'question_id' => $created_question->id
                        ]);
                    }
                }
            }
        }
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
}
