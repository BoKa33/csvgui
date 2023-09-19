
/*
Done: Possibility to put buttons in different rows and change their color
Done: Add submenus which apear after a button was pressed.
Done: Adds textfields for custom input
TODO: Block buttons in submenus
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
    if(typeof(config.csvfile_params.default_image_URL_Columns) == "number"){
      config.csvfile_params.default_image_URL_Columns = [config.csvfile_params.default_image_URL_Columns]
    }
    if(typeof(config.csvfile_params.text_columns) == "number"){
      config.csvfile_params.text_columns = [config.csvfile_params.text_columns];
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
        var buttons_container = await document.getElementById("buttons_container");
        //Create the Button Rows:
        var button_rows = [];
        // -> get max row
        var maxRow = 0; for (const option of config.options) {if (option.row && option.row > maxRow){maxRow = option.row;}}
        console.log(maxRow)
        for (i = 1; i-1 <= maxRow; i++) {
          let button_row = document.createElement("tr")
          button_row.id = ("button_row"+i);
          buttons_container.appendChild(button_row);
          button_rows.push(button_row);
          console.log(button_rows);
        }

        for (let i = 1; i <= config.options.length; i++) {
          button_field = document.createElement("td")
          selButton = document.createElement("input")
          selButton.value = config.options[i-1].buttonvalue;
          selButton.style = "background-color:"+config.options[i-1].color+";"
          selButton.id = ("SelButton"+i);
          selButton.type = "button";
          selButton.className = "btn btn-secondary"
          button_field.id = ("button_field"+i)
          let row;
          if(config.options[i-1].row !== undefined ){
            row = config.options[i-1].row;
          }else{
            row = 0;
          }
          button_rows[row].appendChild(button_field)
          button_field.appendChild(selButton)
          buttons.push(selButton);



        }

      }
      await createButtonElements();
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


async function CSVuploadGui(){ console.log("Step: 1");
  async function showCSVuploadGui(){ console.log("1.A");
    document.getElementById("CSVuploadGui").style.display = "block";
  }
  async function waitForCSV(){ console.log("Step: 1.B");
    document.getElementById('CSV_file_upload').addEventListener('change', function () {
       loadCSV(document.getElementById('CSV_file_upload').files[0]);
  });}
  async function loadCSV(file) {console.log("Step: 1.C");
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
          if(CSVArray[i].length > 1){CSVArray[i].push("");}else{CSVArray.splice(i);}
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



async function dataCollectionGui(){ console.log("Step: 2");
  async function hideCSVuploadGui(){ console.log("Step: 2.A");

    document.getElementById("CSVuploadGui").style.display = "none";

  }
  async function showDataCollectionGui(){ console.log("Step: 2.B");

    document.getElementById("DataCollectionGui").style.display = "block";

  }

  async function recursiveThroughCSV(iteration){ console.log("Step: 2.C");
    async function updateImages(){ console.log("Step: 2.C.A");
      for(var i = 1; i < images.length;i++){
        console.log("looking for comparision_image"+i);
        document.getElementById("comparision_image"+i).src = CSV[iteration][config.csvfile_params.default_image_URL_Columns[i-1]];
        try{
          document.getElementById("image_field"+i).children[1].innerHTML = CSV[iteration][config.csvfile_params.text_columns[i-1]];
        }catch{
          console.log("No Info Found")
        }
      }
    }
    async function updateButtonRows(active_rows){
      for(var i = 0; i < document.getElementById("buttons_container").children.length;i++){
        table_row = document.getElementById("buttons_container").children[i];
        if(active_rows.includes(i)){
          table_row.style.display = "block";
        }else{
          table_row.style.display = "none";
        }
      }
    }
    async function updateInstruction(instruction){
      document.getElementById("control_explanation").innerHTML = instruction;
    }
    async function handleButtons(active_rows = config.GUI_params.default_rows, instruction = config.UI_text.task_explanation){ console.log("Step: 2.C.B");
      updateButtonRows(active_rows);
      updateInstruction(instruction);
        async function waitForEvent(){
          return new Promise((resolve) => {
            const clickListeners = [];
            const keydownListener = (event) => {
              for (let i = 1; i <= config.options.length; i++) {
                if (event.key === config.options[i-1].shortcut_key) {

                  // Remove the event listeners after a button is pressed
                  clickListeners.forEach((listener, index) => {
                    try{
                      document.getElementById("SelButton" + (index+1)).removeEventListener("click", listener);
                    } catch(error){
                    }
                  });
                  window.removeEventListener("keydown", keydownListener);
                  resolve(config.options[i-1]);
                }
              }
            };
            // Add click event listeners to buttons
            for (let i = 1; i <= config.options.length; i++) {
              const button = document.getElementById("SelButton" + i);
              const clickListener = () => {
                // Remove the event listeners after a button is clicked
                clickListeners.forEach((listener, index) => {
                  document.getElementById("SelButton" + i).removeEventListener("click", listener);
                });
                window.removeEventListener("keydown", keydownListener);
                resolve(config.options[i-1]);
              }
              button.addEventListener("click", clickListener);
              clickListeners.push(clickListener);
            }
            window.addEventListener("keydown", keydownListener);
          });
      }
        option = await waitForEvent() // recursively calls the handleButtons method if submenu button was clicked or returns the label
        if(option.hasOwnProperty('sub_menu_rows')){
          if(typeof(option.sub_menu_rows) == "number"){
            sub_menu_rows = [option.sub_menu_rows]
          }else{
            sub_menu_rows = option.sub_menu_rows
          }
          subSelection = await handleButtons(active_rows = sub_menu_rows, instruction = option.sub_menu_instructions);
          return(subSelection);
        }else if(option.hasOwnProperty('label')){
          return option.label;
        }else if(option.hasOwnProperty('placeholder')){
          return prompt(option.prompt_text, option.placeholder); //TODO: Change this
        }else{
          alert("BadConfiguratedButton" + option.buttonvalue)
          return("BadConfiguratedButton" + option.buttonvalue)
        }
    }
    async function AddResultsToCSV(){ console.log("Step: 2.C.C");

      var result = await handleButtons();
      console.log(result);
      try{
          CSV[iteration][CSV[iteration].length - 1] = result;
          console.log(CSV[iteration]);
          if(iteration+1 < CSV.length){
            await recursiveThroughCSV(iteration+1);
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

function exportCSV(){ console.log("Step: 3");
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
