<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'subject_id'
    ];

    public function subject() : BelongsTo {
        return $this->belongsTo(related: Subject::class);
    }
}
