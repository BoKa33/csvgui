/*
TODO: Possibility to put buttons in different rows and change their color
TODO: Add submenus which apear after a button was pressed.
TODO: Block buttons in submenus
TODO: Add textfields for custom input

Pages:
1: LoadCSV
2: DataCollectionGui
3: ExportArea
*/

var CSV = [];
var buttons = [];
var images = [];
var config;

async function applyConfig(){

  // getConfig
  try {
    const response = await fetch('config.yml');
    const yamlText = await response.text();
    config = jsyaml.load(yamlText);
  } catch (error) {
    console.error('Error while loading config:', error);
    throw error;
  }
  // apply image elements
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
  //delete comparision_image0
  images[0].remove()

  // apply number of button elements
  await buttons.push(document.getElementById("button_field0"));
  buttons[0].value = config.options[0].buttonvalue;
  var buttons_container = await document.getElementById("buttons_container");

  //Create the Button Rows:
  var button_rows = [];
  button_rows.push(document.getElementById("button_row0"));
  // -> get max row<
  var maxRow = 0; for (const option of config.options) {if (option.row && option.row > maxRow){maxRow = option.row;}}
  console.log(maxRow)
  for (i = 1; i <= maxRow; i++) {
    var clone = button_rows[0].cloneNode(false);
    clone.id = ("button_row"+i);
    buttons_container.appendChild(clone);
    button_rows.push(clone);
    console.log(button_rows);
  }
  //Create the Buttons
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
  //Config SelButton0
  buttons[0].remove()

  // apply text configuration
  document.getElementById("pls_download").innerHTML = config.UI_text.pls_download.replace('{0}', config.csvfile_params.new_column_name);
  document.getElementById("control_explanation").innerHTML = config.UI_text.task_explanation;
}

async function startDataCollectionGui(){
  //loadCSV
  function loadCSV() {
    return new Promise((resolve, reject) => {
      const file = document.getElementById("CSV_file_upload").files[0];
      if (file) {
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
          resolve();
        };
        reader.onerror = function(error) {
          console.error(error.target.error);
          reject(error);
        };
        reader.readAsText(file);
      } else {
        reject("Please upload a valid CSV file.");
      }
    });
  }
  try {
    await loadCSV();
    // Display DataCollectionGui instead of CSVloading
    document.getElementById("CSVloading").style.display = "none";
    document.getElementById("ComparisonGUI").style.display = "block";
    await process_recursive(1);
    // Display Export Button instead of DataCollectionGui
    document.getElementById("control_images").style.display = "none";
    document.getElementById("ExportArea").style.display = "block";
  } catch (error) {
    alert(error);
  }

}

async function process_recursive(iteration){

  function waitForClick() {
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
      window.addEventListener("keydown", keydownListener)
    });
  }

  try {
    for(var i = 1; i < images.length;i++){
      console.log("looking for comparision_image"+i)
      document.getElementById("comparision_image"+i).src = CSV[iteration][config.csvfile_params.default_image_URL_Columns[i-1]];
    }
    const feedback = await waitForClick();
    console.log(feedback);
    CSV[iteration][CSV[iteration].length - 1] = feedback;
    console.log(CSV[iteration]);
    if(iteration+1 < CSV.length){
      await process_recursive(iteration+1);
    }
  } catch (error) {
    console.error(error);
    if(iteration+1 < CSV.length){
      await process_recursive(iteration+1);
    }
  }
}

function exportCSV(){
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

applyConfig()
