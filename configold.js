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


async function startDataCollectionGui(){
  //loadCSV

  try {
    await loadCSV();
    // Display DataCollectionGui instead of CSVloading

    await process_recursive(1);
    // Display Export Button instead of DataCollectionGui
    document.getElementById("control_images").style.display = "none";
    document.getElementById("ExportArea").style.display = "block";
  } catch (error) {
    alert(error);
  }

}

async function process_recursive(iteration){



  try {

    const feedback = await waitForClick();
    console.log(feedback);

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
