<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\Question;

class Option extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'order',
        'question_id'
    ];

    public function question() : BelongsTo {
        return $this->belongsTo(related: Question::class);
    }

}
