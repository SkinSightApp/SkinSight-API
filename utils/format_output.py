import numpy as np
import json
from typing import List

from pydantic import BaseModel

class ImagePred(BaseModel):
    classes: List[str]
    prob: List[float]
    top_2: dict

# Format model prediction to JSON
# for easy-to-read api response.
def format_image_pred(pred, classes):
    data = {}
    data['classes'] = classes
    data['prob'] = pred[0].tolist()
    data['top_2'] = {}
    
    top_2_ind = pred[0].argsort()[::-1][:2]
    top_2_prob = pred[0][top_2_ind]
    top_2_classes = np.array(classes)[top_2_ind]
    
    for index, key in enumerate(top_2_classes):
        data["top_2"][key] = top_2_prob[index].item()
        
    data = ImagePred(classes=data['classes'], prob=data['prob'], top_2=data["top_2"])

    output = {}
    output['status'] = "success"
    output['message'] = "Predict success"
    output['data'] = data
    
    return output