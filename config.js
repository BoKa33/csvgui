/*
TODO: Possibility to put buttons in different rows and change their color
TODO: Add submenus which apear after a button was pressed.
TODO: Block buttons in submenus
TODO: Add textfields for custom input

Steps:

0: initialise
  0.A: loadConfig
  0.B: applyConfig
    0.B.A: applyImageElements
      0.B.A.A: createImageElements
      0.B.A.B: deleteImageElement0
    0.B.B: applyButtonElements
      0.B.B.A: createButtonElements
      0.B.B.B: deleteButtonElement0
    0.B.C: applyTextConfig

1: CSVuploadGui
  1.A: showCSVuploadGui

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
*/

// init globals
var CSV = [];
var buttons = [];
var images = [];
var config;

async def initialise(){
  console.log("Step: 0")
  async def loadConfig{
    console.log("Step: 0.A")
    try {
      const response = await fetch('config.yml');
      const yamlText = await response.text();
      config = jsyaml.load(yamlText);
    } catch (error) {
      console.error('Error while loading config:', error);
      throw error;
    }
  }

  async def applyConfig{
    async def applyImageElements{
      async def createImageElements{

      }
      async def deleteImageElement0{

      }
    }
    async def applyButtonElements{
      async def createButtonElements{

      }
      async def deleteButtonElement0{

      }
    }
    async def applyTextConfig{

    }
  }
}

1: CSVuploadGui
  1.A: showCSVuploadGui

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
*/
