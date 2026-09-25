# iFire

Detects fire and smoke in a photo, and scores wildfire risk from weather conditions before anything burns.

Team project for an AI course at Binus University, themed on SDG 13 (climate action). My part was training the detector, building the risk model, the FastAPI backend and wiring the Next.js app to it. Teammates wrote the report, made the slides and sourced the dataset. The frontend layout started from a v0 template.

## What is in here

| Part | Stack | Where |
|---|---|---|
| Fire and smoke detection | YOLOv8m, fine-tuned | fire_api.py, weights below |
| Fire risk scoring | scikit-learn Random Forest | models/ |
| API | FastAPI | fire_api.py |
| Web app | Next.js, Tailwind, Leaflet | app/, components/, hooks/, lib/ |

## Results

Detection, YOLOv8m after 100 epochs, run fire_detector6, on the validation set:

| mAP50 | Precision | Recall |
|---|---|---|
| 0.803 | 0.849 | 0.767 |

For a fire alarm, recall is the number that matters more. At 0.767 the model still misses about one fire or smoke region in four. There is no baseline to compare against yet, so the next step is a YOLOv8n run on the same split.

The risk model is a Random Forest with 200 trees at depth 15 and it reaches 92 percent accuracy, but on synthetic data. The 15,000 rows were generated from a rule I wrote over temperature, humidity, wind speed, rainfall, consecutive dry days, soil moisture, land type and month, so the score only shows the model can learn that rule back. It proves the pipeline works, not that the predictions are useful. Retraining on real fire history (NASA FIRMS hotspots with BMKG weather) is the next step.

Both models were trained in Colab, and those notebooks are not in this repository yet. What is here is everything needed to run the models, not to retrain them. The trained risk model and its metadata sit in models/, and the detector weights are linked below.

## A bug worth knowing about

The detector kept finding fire while the app reported none. The dataset labelled its classes in Chinese, so the English check in the API never matched anything. Printing the raw class names found it, and CLASS_MAPPING in fire_api.py now translates them.

## Run it

The weights file best.pt is around 150 MB, which is over the GitHub file limit, so it is published as a [release asset](https://github.com/chris-setyawan/iFire/releases/download/v1.0-weights/best.pt) instead. Download it and put it in the project root, next to fire_api.py, which is where the backend looks for it.

Backend:

```bash
pip install -r requirements-api.txt
uvicorn fire_api:app --port 8000
```

Frontend:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
