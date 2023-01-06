<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Score extends Model
{
    use HasFactory;

    protected $fillable = [
        'score',
        'user_id',
        'subject_id'
    ];

    public function user() : BelongsTo {
        return $this->belongsTo(related: User::class);
    }

    public function subject() : BelongsTo {
        return $this->belongsTo(related: Subject::class);
    }
}
