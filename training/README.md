# Training

The code that produced the two models, and the raw logs behind every number in the main README.

The image dataset and the model weights are not here. The dataset is thousands of images, and the weights are over the GitHub file limit, so best.pt is published as a [release asset](https://github.com/chris-setyawan/iFire/releases/download/v1.0-weights/best.pt) instead.

## Fire and smoke detection

`train.py` fine-tunes YOLOv8m on a Roboflow dataset that `download_dataset.py` fetches. `simple_train.py` is a shorter version of the same thing. `validate_model.py` runs the validation pass, and `export_onnx.py` and `quick_export.py` export the result.

There were six attempts. Only three left a complete log, and they are in `runs/`:

| Run | Result |
|---|---|
| fire_detector3 | early attempt, abandoned |
| fire_detector5 | stopped after one epoch |
| fire_detector6 | the one that counts |

`runs/fire_detector6/args.yaml` records the settings: YOLOv8m, 100 epochs, image size 640, batch 16. `runs/fire_detector6/results.csv` has one row per epoch. The last row, epoch 100:

```
metrics/precision(B)  0.84906
metrics/recall(B)     0.76707
metrics/mAP50(B)      0.80301
metrics/mAP50-95(B)   0.54304
```

Those are the 0.849, 0.767 and 0.803 quoted in the main README. The PR and F1 curves, the confusion matrix and the training curves are the PNG files in the same folder.

`data.yaml` is worth opening. It names the two classes as `火` and `烟`, Chinese for fire and smoke. That is the whole reason the API needed a translation table: the model returned Chinese class names and the app was checking for English ones, so it found fire and reported none.

## Fire risk scoring

`generate_risk_dataset.py` writes `fire_risk_sumatra.csv`, 15,000 rows of weather and land conditions with a risk label. The labels come from a scoring rule written into that script, not from real fire records. `train_risk_model.py` then fits a Random Forest on it, and `test_risk_prediction.py` checks a few predictions by hand.

This is why the 92 percent accuracy in the main README is presented as a caveat rather than a result. The model is learning to reproduce a formula that already exists in the generator. It shows the pipeline runs end to end. It does not show the predictions are useful, and it cannot until the model is retrained on real fire history such as NASA FIRMS hotspots paired with BMKG weather.

## Running any of this

These scripts expect the folder layout they were written in, with a `datasets/` directory beside them and a virtual environment with `ultralytics` and `scikit-learn` installed. They are here as evidence and as a starting point, not as a one command reproduction.
