<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admins\QuestionController;
use App\Http\Controllers\Admins\QuestionTypeController;
use App\Http\Controllers\Admins\SubjectController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\PenguinController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScoreboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/documents', function () {
    return view('documents.index');
})->name('documents');

Route::get('/penguin', [PenguinController::class, 'index'])->name('penguin.index');

Route::prefix('/exams')->group(function () {
    Route::get('/', [ExamController::class, 'index'])->name('exams.index');
    Route::prefix('/{slug}')->group(function () {
        Route::get('/answer', [ExamController::class, 'answer'])->name('exams.answer');
        Route::get('/points', [ExamController::class, 'points'])->name('exams.points');
        Route::get('/check', [ExamController::class, 'check'])->name('exams.check');
        Route::get('/check/{answer}', [ExamController::class, 'checkPrevious'])->name('exams.checkPrevious');
    });
});

Route::prefix('/admins')->group(function () {
    Route::get('/login', [AdminController::class, 'login'])->name('admins.login');
});

Route::prefix('/scoreboard')->group(function () {
    Route::get('/', [ScoreboardController::class, 'index'])->name('scoreboard.index');
    Route::get('/{slug}', [ScoreboardController::class, 'show'])->name('scoreboard.show');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'is_admin'])->prefix('/admins')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admins.index');
    Route::get('users', [\App\Http\Controllers\UserController::class, 'index'])->name('admins.users.index');

    Route::prefix('/subjects')->group(function () {
        Route::get('/', [SubjectController::class, 'index'])->name('admins.subjects.index');
        Route::get('/create', [SubjectController::class, 'create'])->name('admins.subjects.create');
        Route::get('/{subject}/edit', [SubjectController::class, 'edit'])->name('admins.subjects.edit');
    });

    Route::prefix('/question-types')->group(function () {
        Route::get('/', [QuestionTypeController::class, 'index'])->name('admins.question-types.index');
        Route::get('/create', [QuestionTypeController::class, 'create'])->name('admins.question-types.create');
        Route::get('/{questionType}/edit', [QuestionTypeController::class, 'edit'])->name('admins.question-types.edit');
    });

    Route::prefix('/questions')->group(function () {
        Route::get('/', [QuestionController::class, 'index'])->name('admins.questions.index');
        Route::get('/create', [QuestionController::class, 'create'])->name('admins.questions.create');
        Route::get('/{question}/edit', [QuestionController::class, 'edit'])->name('admins.questions.edit');
    });
});

require __DIR__.'/auth.php';

Route::middleware('auth')->group(function () {
    Route::view('about', 'about')->name('about');

    Route::get('users', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
});
