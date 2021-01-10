movieURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"

let movieData

let svg = d3.select('#canvas')

let tooltip = d3.select('#tooltip')

width = 1000
height = 700

drawCells = () => {
  
  let hierarchy = d3.hierarchy(movieData, (node) => {
    return node['children']
  }).sum((node) => {
    return node['value']
  }).sort((node1, node2) => {
    return node2['value'] - node1['value']
  })
  
  let createTreeMap = d3.treemap()
                        .size([width, height])
  
  createTreeMap(hierarchy)
  
  let movieTiles = hierarchy.leaves()
  
  let block = svg.selectAll('g')
      .data(movieTiles)
      .enter()
      .append('g')
      .attr('transform', (movie) => {
           return "translate(" + movie['x0'] + ", " + movie['y0'] + ")"})
      
  
  block.append('rect')
        .attr('class', 'tile')
        .attr('fill', (movie) => {
          let genre = movie.data.category
          if (genre === "Action") {
            return "#ee4035"
          } else if (genre === "Drama") {
            return '#f37736'
          } else if (genre === "Adventure") {
            return '#fdf498'
          } else if (genre === "Family") {
            return '#7bc043'
          } else if (genre === "Animation") {
            return '#0392cf'
          } else if (genre === "Comedy") {
            return '#851e3e'
          } else {
            return '#f6abb6'
          }
  })
        .attr('data-name', (d) => {
          return d.data.name
  })
        .attr('data-category', (d) => {
          return d.data.category
  })
        .attr('data-value', (d) => {
          return d.data.value
  })
        .attr('width', (movie) => {
          return movie.x1 - movie.x0
  })
        .attr('height', (movie) => {
          return movie.y1 - movie.y0
  })
        .on('mouseover', (event, item) => {
          tooltip.transition()
                .style('visibility', 'visible')
         
          tooltip.text(item.data.name + " - " + item.data.category + " - $" + item.data.value.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,'))
          tooltip.attr('data-value', item.data.value)
  })
        
      .on("mouseout", function(d) {
       tooltip.style('visibility', 'hidden')
  })
 
  block.append('text')
        .attr('class', 'titletext')
        .text((movie) => movie.data.name)
        .attr('x', 5)
        .attr('y', 20)
        .attr('font-size', 12)
  
  svg.attr('width', width)
     .attr('height', height)
 
     
  
}

d3.json(movieURL).then(
  (data, error) => {
    if(error) {
      console.log(error)
    }else {
      movieData = data
      drawCells()
  }})