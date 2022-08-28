var dataset;

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    // TO use it in different functions
    dataset = data;
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildBubbleChart(firstSample);
  });
}


function optionChanged(newSample) {
   option = newSample;
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  buildBubbleChart(newSample);
    
  
}

function displayObject(obj) {
    var str = "";
    Object.entries(obj).forEach(([key,value]) => {
        str += `<br>${key}:${value}</br>`;
        if(key=="wfreq"){
            buildGauge(value);
            console.log("gauge value is:" +value);
        }
        
    });
    return str;
}

// Demographics Panel 
function buildMetadata(sample) {
    var metadata = dataset.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    d3.select("#sample-metadata").html(displayObject(resultArray[0]));
}

// 1. Create the buildCharts function.
function buildCharts(option) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    // Inividual Chosen Sample
    console.log("Selected: ", option);

    // 3. Create a variable that holds the samples array. 
    var sampleArray = dataset.samples.filter(sample => sample.id != option);

    //  5. Create a variable that holds the first sample in the array. 
    var firstSample = dataset.samples[0];
    // console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;
    // console.log(otu_ids,otu_labels,sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var y = sampleArray.map(row =>row.otu_ids);  
    var y1 = [];

    for(i=0;i<y[0].length;i++){
        y1.push(`OTU ${y[0][i]}`);
    }

    var x = sampleArray.map(row =>(row.sample_values));
    var text = sampleArray.map(row =>row.otu_labels);


    // 8. Create the trace for the bar chart. 
    var trace = {
        x:x[0].slice(0,10),
        y:y1.slice(0,10),
        text:text[0].slice(0,10),
        type:"bar",
        orientation:"h",
        
    };

    var data = [trace];

    // 9. Create the layout for the bar chart. 
    var layout = {
        yaxis: {
            autorange: "reversed" 
        }
    }
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",data,layout);
}


function buildBubbleChart(option) {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = dataset.samples.filter(sample => sample.id != option);

    var x = sampleArray.map(row =>row.otu_ids); 
    var y = sampleArray.map(row =>row.sample_values); 
    var text = sampleArray.map(row =>row.otu_labels);
    var marker_size = sampleArray.map(row =>row.sample_values);
    var marker_color = sampleArray.map(row =>row.otu_ids);
    
    console.log(x[0]);
    console.log(y[0]);
    console.log(text);
    
    var trace1 = {
        x:x[0],
        y:y[0],
        text: text[0],
        mode:"markers",
        marker: {
            color: marker_color[0],
            size: marker_size[0],
            colorscale: "Earth"
        }
        
    };

    var data = [trace1];

    var layout = {
        xaxis:{
            title: "OTU ID"
        }
    };

    Plotly.newPlot("bubble",data,layout);
}


function buildGauge(wfreq) {
    var level = parseFloat(wfreq) * 20;
    
    var degrees = 180 - level;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    
    var mainPath = "M -.0 -0.05 L .0 0.05 L ";
    var pathX = String(x);
    var space = " ";
    var pathY = String(y);
    var pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
    var data = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 12, color: "850000" },
        showlegend: false,
        name: "Freq",
        text: "",
        hoverinfo: "text+name"
      },
      {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgba(0, 105, 11, .5)",
            "rgba(10, 120, 22, .5)",
            "rgba(14, 127, 0, .5)",
            "rgba(110, 154, 22, .5)",
            "rgba(170, 202, 42, .5)",
            "rgba(202, 209, 95, .5)",
            "rgba(210, 206, 145, .5)",
            "rgba(232, 226, 202, .5)",
            "rgba(240, 230, 215, .5)",
            "rgba(255, 255, 255, 0)"
          ]
        },
        labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ];
  
    var layout = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000"
          }
        }
      ],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      height: 500,
      width: 500,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };
  
    var GAUGE = document.getElementById("gauge");
    Plotly.newPlot(GAUGE, data, layout);
  }

// Initialize the dashboard
init();
