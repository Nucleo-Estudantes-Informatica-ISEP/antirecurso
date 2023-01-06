<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment',
        'user_id',
        'question_id'
    ];

    public function user() : BelongsTo {
        return $this->belongsTo(related: User::class);
    }

    public function question() : BelongsTo {
        return $this->belongsTo(related: Question::class);
    }
}
