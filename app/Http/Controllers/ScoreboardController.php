<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class ScoreboardController extends Controller
{
    public function index() {
        return view('scoreboard.index');
    }

    public function show(string $slug) {
        $subject = Subject::where(['slug' => $slug])->first();

        return view('scoreboard.show', compact('subject'));
    }
}
