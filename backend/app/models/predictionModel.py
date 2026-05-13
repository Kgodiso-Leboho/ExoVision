from pydantic import BaseModel

class model_prediction(BaseModel):
    id: int
    model_name: str
    model_description: str
    model_accuracy: float
    model_f1_score: float
    model_precision: float
    model_recall: float

    class Config:
        orm_mode = True