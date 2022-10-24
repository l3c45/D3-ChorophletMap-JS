const edUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const mapUrl="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

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
    const height=700
    const path = d3.geoPath()

    const min=d3.min(education,d =>d.bachelorsOrHigher)

    const max=d3.max(education,d =>d.bachelorsOrHigher)


    const colors = d3.scaleQuantize()
        .domain([min,max])
        .range(["#f4af03","#ffb532","#ffc766","#ffda99",
        "#ffeccc","#ffffff"]);
            
    const colorsValues = d3.scaleLinear()
        .domain([min,max])
        .range([0,195])
    
    const valuesAxis = d3.axisBottom(colorsValues)
                        .tickFormat(d => d + "%")
                        .ticks(6)

    const educationData= id => {
      return education.find(item=>item.fips===id)
    }    

    const mouseover=(event,d)=>{
      console.log(event)
      tooltip.transition().style("opacity",.9)
  
      tooltip.attr("data-education", (education.find(item=>item.fips===d.id)).bachelorsOrHigher)
      .style("left" , (event.pageX +15) + "px")
         .style("top" , (event.pageY +15) + "px")
         .html(`<p>${educationData(d.id).area_name} : ${educationData(d.id).state}</p>
         <p>Superior Education:${educationData(d.id).bachelorsOrHigher}%</p>`)
     
       
        d3.select(event.target).attr("opacity",0.2)
    }; 
  
    const mouseout=(event)=> {
      
      tooltip.transition().style("opacity",0)
      d3.select(event.target).attr("opacity",1)

    };


    const tooltip=d3.select("body").append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
    
    const svg = d3.select("body").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append ("g")
                  .attr("transform", "translate(" + 150+ "," + 50+ ")")
        
    svg.append("text")
       .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")
       .attr("transform", "translate(" + 150 + "," + 0+ ")")
       .attr("id","description")

    svg.selectAll('path')
        .data(topojson.feature(m, m.objects.counties) 
               .features) 
        .enter()
        .append('path')
        .attr('d', path)
        .attr('class', 'county')
        .attr("stroke","gray")
        .attr("data-fips",(d)=> d.id)
        .attr("data-education", d=> educationData(d.id).bachelorsOrHigher)
        .attr("fill", d=> colors(educationData(d.id).bachelorsOrHigher))
        .on("mouseover",mouseover)
        .on("mouseout",mouseout)


    // svg.selectAll('.states')
    //     .data(topojson.feature(m, m.objects.states) 
    //            .features) 
    //     .enter()
    //     .append('path')
    //     .attr('d', path)
    //     .attr('class', 'states')
    //     .attr("fill","transparent")
        

    const legend=svg.append("g")
                    .attr("id","legend")
                    .attr("width", 100)
                    .attr("height", 50)
                    .attr("transform", "translate(" + 650 + "," +20+ ")")

    legend.selectAll(".rects")
          .data(d3.range(min,max,6))
          .enter()
          .append("rect")
          .attr("y", 20)
          .attr("height", 20)
          .attr("x", (d,i)=> i*15)
          .attr("width",15)
          .attr("fill", d=>colors(d))
    
    legend.append("g")
          .attr("id","colorAxis")
          .attr("transform", "translate(0," + 40 + ")")
          .call(valuesAxis)

}


