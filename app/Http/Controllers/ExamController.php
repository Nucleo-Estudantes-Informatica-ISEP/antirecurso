<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ExamController extends Controller
{
    public function index() {
        return view('exams.index');
    }

    public function answer(string $slug) {
        $subject = Subject::where(['slug' => $slug])->first();

        return view('exams.answer', compact('subject'));
    }

    public function points(string $slug) {
        $subject = Subject::where(['slug' => $slug])->first();

        return view('exams.points', compact('subject'));
    }

    public function check(string $slug) {
        $subject = Subject::where(['slug' => $slug])->first();
        $answer = Session::get('answer');

        return view('exams.check', compact('subject', 'answer'));
    }

    public function checkPrevious(string $slug, Answer $answer) {
        /**
         * Careful soldier! Our pretty little user might be trying
         * to snoop in in other's exams. We must hide the traces of
         * previous exams by throwing a 404. This should keep him
         * away!
         */
        if($answer->user_id != auth()->user()->id) return abort(404);

        $subject = Subject::where(['slug' => $slug])->first();

        return view('exams.check', compact('subject', 'answer'));
    }
}
