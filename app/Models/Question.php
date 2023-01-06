<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Models\Option;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question',
        'image',
        'exam',
        'correct_option',
        'subject_id',
        'question_type_id'
    ];

    public function options() : HasMany {
        return $this->hasMany(related: Option::class);
    }

    public function subject() : BelongsTo {
        return $this->belongsTo(related: Subject::class);
    }

    public function question_type() : BelongsTo {
        return $this->belongsTo(related: QuestionType::class);
    }

}
