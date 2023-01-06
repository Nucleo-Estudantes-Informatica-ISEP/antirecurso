<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnswerQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_wrong',
        'answer_id',
        'question_id',
        'option_id',
    ];

    public function question() : BelongsTo {
        return $this->belongsTo(related: Question::class);
    }

    public function answer() : BelongsTo {
        return $this->belongsTo(related: Answer::class);
    }

    public function option() : BelongsTo {
        return $this->belongsTo(related: Option::class);
    }
}
