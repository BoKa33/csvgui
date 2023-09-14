
/*
Done: Possibility to put buttons in different rows and change their color
TODO: Add submenus which apear after a button was pressed.
TODO: Block buttons in submenus
TODO: Adds textfields for custom input
*/

// init globals
var CSV = [];
var buttons = [];
var images = [];
var config;

async function initialise(){ console.log("Step: 0");

  async function loadConfig(){ console.log("Step: 0.A");
    try {
      const response = await fetch('config.yml');
      const yamlText = await response.text();
      config = jsyaml.load(yamlText);
    } catch (error) {
      console.error('Error while loading config:', error);
      throw error;
    }
  }

  async function applyConfig(){ console.log("Step: 0.B");
    async function applyImageElements(){ console.log("Step: 0.B.A");
      async function createImageElements(){ console.log("Step: 0.B.A.A");

        await images.push(document.getElementById("image_field0"));
        var images_container = await document.getElementById("images_container");
        for(var i = 1; i <= config.csvfile_params.default_image_URL_Columns.length; i++){
          clone = images[0].cloneNode(true);
          clone.id = ("image_field"+i);
          clone.firstElementChild.id = ("comparision_image"+i);
          clone.firstElementChild.alt = (config.UI_text.img_alt);
          images_container.appendChild(clone);
          images.push(clone);
        }

      }
      async function deleteImageElement0(){ console.log("Step: 0.B.A.B");

          images[0].remove();

      }
      await createImageElements();
      await deleteImageElement0();
    }

    async function applyButtonElements(){ console.log("Step: 0.B.B");
      async function createButtonElements(){ console.log("Step: 0.B.B.A");

        //append button_field0
        await buttons.push(document.getElementById("button_field0"));
        var buttons_container = await document.getElementById("buttons_container");
        //Create the Button Rows:
        var button_rows = [];
        button_rows.push(document.getElementById("button_row0"));
        // -> get max row
        var maxRow = 0; for (const option of config.options) {if (option.row && option.row > maxRow){maxRow = option.row;}}
        console.log(maxRow)
        for (i = 1; i <= maxRow; i++) {
          var clone = button_rows[0].cloneNode(false);
          clone.id = ("button_row"+i);
          buttons_container.appendChild(clone);
          button_rows.push(clone);
          console.log(button_rows);
        }
        for (let i = 1; i <= config.options.length; i++) {
          clone = buttons[0].cloneNode(true);
          clone.firstElementChild.value = config.options[i-1].buttonvalue;
          clone.firstElementChild.style= "background-color:"+config.options[i-1].color+";"
          clone.firstElementChild.id = ("SelButton"+i);
          clone.id = ("button_field"+i)
          if(config.options[i-1].row !== undefined ){
            config.options[i-1].row
            button_rows[config.options[i-1].row].appendChild(clone);
          }else{
            button_rows[0].appendChild(clone);
          }
          buttons.push(clone.firstElementChild);
        }

      }
      async function deleteButtonElement0(){ console.log("Step: 0.B.B.B.B");

        buttons[0].remove()

      }
      await createButtonElements();
      await deleteButtonElement0();
    }
    async function applyTextConfig(){ console.log("Step: 0.B.C");

      document.getElementById("pls_download").innerHTML = config.UI_text.pls_download.replace('{0}', config.csvfile_params.new_column_name);
      document.getElementById("control_explanation").innerHTML = config.UI_text.task_explanation;

    }
    await applyImageElements();
    await applyButtonElements();
    await applyTextConfig();
  }
  await loadConfig();
  await applyConfig();
  CSVuploadGui();
}


async function CSVuploadGui(){ console.log("1");
  async function showCSVuploadGui(){ console.log("1.A");
    document.getElementById("CSVuploadGui").style.display = "block";
  }
  async function waitForCSV(){ console.log("1.B");
    document.getElementById('CSV_file_upload').addEventListener('change', function () {
       loadCSV(document.getElementById('CSV_file_upload').files[0]);
  });}
  async function loadCSV(file) {console.log("1.C");
    if(file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const data = event.target.result;
        const lines = data.split("\n");
        let CSVArray = [];
        for (let i = 0; i < lines.length; i++) {
          let fields = lines[i].split(config.csvfile_params.CSV_delimiter_default);
          CSVArray.push(fields.map(value => value.trim()));
        }
        //Add new Column
        CSVArray[0].push(config.csvfile_params.new_column_name);
        for(i = 1; i < CSVArray.length; i++){
          if(CSVArray[i].length > 2){CSVArray[i].push("");}else{CSVArray.splice(i);}
        }
        //Set CSV variable
        CSV = CSVArray;
        document.getElementById('CSV_file_upload').onchange = null;
        dataCollectionGui();
      };
      reader.onerror = function(error) {
        console.error(error.target.error);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  }
  await showCSVuploadGui();
  await waitForCSV();
}



async function dataCollectionGui(){ console.log("2: dataCollectionGui");
  async function hideCSVuploadGui(){ console.log("2.A");

    document.getElementById("CSVuploadGui").style.display = "none";

  }
  async function showDataCollectionGui(){ console.log("2.B");

    document.getElementById("DataCollectionGui").style.display = "block";

  }

  async function recursiveThroughCSV(iteration){ console.log("2.C");
    async function updateImages(){ console.log("2.C.A");

      for(var i = 1; i < images.length;i++){
        console.log("looking for comparision_image"+i);
        document.getElementById("comparision_image"+i).src = CSV[iteration][config.csvfile_params.default_image_URL_Columns[i-1]];
      }

    }
    async function handleButtons(){ console.log("2.C.B");
      return new Promise((resolve) => {
        const clickListeners = [];
        const keydownListener = (event) => {
          for (let i = 1; i <= config.options.length; i++) {
            if (event.key === config.options[i-1].shortcut_key) {
              resolve(config.options[i-1].label);
              // Remove the event listeners after a button is pressed
              clickListeners.forEach((listener, index) => {
                document.getElementById("SelButton" + index).removeEventListener("click", listener);
              });
              window.removeEventListener("keydown", keydownListener);
              return;
            }
          }
        };
        // Add click event listeners to buttons
        for (let i = 1; i <= config.options.length; i++) {
          const button = document.getElementById("SelButton" + i);
          const clickListener = () => resolve(config.options[i-1].label);
          button.addEventListener("click", clickListener, { once: true });
          clickListeners.push(clickListener);
        }
        window.addEventListener("keydown", keydownListener);
      });
    }

    async function AddResultsToCSV(){ console.log("2.C.C");

      var result = await handleButtons();
      console.log(result);
      try{
          CSV[iteration][CSV[iteration].length - 1] = result;
          console.log(CSV[iteration]);
          if(iteration+1 < CSV.length){
            await process_recursive(iteration+1);
          }
        } catch (error) {
          console.error(error);
          if(iteration+1 < CSV.length){
            await recursiveThroughCSV(iteration+1);
          }
        }

    }
    await updateImages();
    await AddResultsToCSV();
  }
  await hideCSVuploadGui();
  await showDataCollectionGui();
  await recursiveThroughCSV(1);
  exportCSV()
}
/* Todo
3: ExportArea
  3.A: buildCSVfile
  3.B: download
*/

function exportCSV(){ console.log("3");
  newCSV = "";
  for(i = 0; i < CSV.length; i++){
    newCSV += (CSV[i].join(",") + "\n");
  }
  const blob = new Blob([newCSV], { type: 'text/csv' });
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = 'file.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}

initialise()
