const edUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const mapUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const test="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
let education
let map

async function getData(url) {
  try {
    const response = await axios.get(url)
 
     return response.data
  } catch (error) {
    console.error(error);
  }
}

getData(edUrl)
.then(d => education=d)
.catch(err => console.log(err) )

getData(mapUrl)
.then(d => render(d))
.catch(err=> console.log(err) )



  function render (m){

    const width=1200
    const height=600

// const projection = d3.geoMercator()
//     .center([0, 50 ])
    //    .scale(50)
    //    .rotate([0,0]);

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    const path = d3.geoPath()
      //  .projection(projection);

    //var g = svg.append ("g")


    svg.selectAll('path')
    .data(topojson.feature(m, m.objects.counties) 
    .features) 
           .enter()
           .append('path')
           .attr('d', path)
           .attr('fill', "gray")
           .attr('class', 'county')



}


/*
const path = d3.geoPath(); //the method that does the actual drawing, which you'll call later

    svg  
      .selectAll("path")  // should be familiar, adding "path" for all data points, like adding 'rect'
      .data(topojson.feature(data2, data2.objects.counties).features) // here you convert topojson data to geojson data. I have no idea how the math works. Topojson is like a 'compressed' version of geojson
      .enter()
      .append("path")
      .attr("d", path)  // don't know what 'd' is, but it seems analogous to "x-y-cordinates", and path seems to tell the coordinates where to go using magical math



      */