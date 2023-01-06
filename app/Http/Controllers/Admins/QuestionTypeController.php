<?php

namespace App\Http\Controllers\Admins;

use App\Http\Controllers\Controller;
use App\Models\QuestionType;
use Illuminate\Http\Request;

class QuestionTypeController extends Controller
{
    public function index() {
        $question_types = QuestionType::paginate(10);

        return view('admins.question-types.index', compact('question_types'));
    }

    public function create() {
        return view('admins.question-types.create');
    }

    public function edit(QuestionType $questionType) {
        return view('admins.question-types.edit', compact('questionType'));
    }
}
