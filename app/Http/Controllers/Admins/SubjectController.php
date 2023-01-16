<?php

namespace App\Http\Controllers\Admins;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index() {
        $subjects = Subject::paginate(10);

        return view('admins.subjects.index', compact('subjects'));
    }

    public function create() {
        return view('admins.subjects.create');
    }

    public function edit(Subject $subject) {
        return view('admins.subjects.edit', compact('subject'));
    }

    public function questionsParser() {
        return view('admins.subjects.questions-parser');
    }
}
