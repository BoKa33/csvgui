# csvgui
Edit CSV files, to preprocess data for machine learning, eg. labelling, filtering, sorting.

Overview main.js:

Steps:

0: initialise
  0.A: loadConfig
  0.B: applyConfig
    0.B.A: applyImageElements
      0.B.A.A: createImageElements
      0.B.A.B: deleteImageElement0
    0.B.B: applyButtonElements
      0.B.B.A: createButtonElements
        - append Buttonfiel0
        - Create button rows
        - Get max row
        - Create fields with buttons
      0.B.B.B: deleteButtonElement0
    0.B.C: applyTextConfig

1: CSVuploadGui
  1.A: showCSVuploadGui
  1.B: waitForCSV
  1.C: loadCSV

2: DataCollectionGui
  2.A: hideCSVuploadGui
  2.B: showDataCollectionGui
  2.C: recursiveThroughCSV:
    2.C.A: updateImages
    2.C.B: handleButtons
      2.C.B.A: addEventHandlers
      2.C.B.B: waitForEvent
      2.C.B.C: removeEventHandler
  2.C.C: AddResultsToCSV

3: ExportArea
  3.A: buildCSVfile
  3.B: download

Todo: Step1 is just copied, no new structure yet
