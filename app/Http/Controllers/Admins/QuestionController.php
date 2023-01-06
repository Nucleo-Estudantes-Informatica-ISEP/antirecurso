<?php

namespace App\Http\Controllers\Admins;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index() {
        $questions = Question::paginate(10);

        return view('admins.questions.index', compact('questions'));
    }

    public function create() {
        return view('admins.questions.create');
    }

    public function edit(Question $question) {
        return view('admins.questions.edit', compact('question'));
    }
}
