from pydantic import BaseModel
from typing import List
from datetime import datetime

class AttireCompleteness(BaseModel):
    id: int
    coat: bool
    shoes: bool
    gloves: bool
    date_captured: datetime

class AttireCompletenessResponse(BaseModel):
    attire_completeness: List[AttireCompleteness]