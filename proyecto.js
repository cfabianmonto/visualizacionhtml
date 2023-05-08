// Se establece el tamaño del gráfico
var width = 700;
var height = 450;

// Aqui se establece la margen del gráfico
var margin = { top: 30, right: 30, bottom: 45, left: 55 };

// Aqui se establece el  SVG y establece el tamaño
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Leer el archivo JSON
d3.json("https://raw.githubusercontent.com/FabioSuarez1/Herramientasdevisualizaci-n/main/traficodrogas.json").then(function (data) {

    //Aqui se comenta para la absorcion del dataset local
//d3.json("./traficodrogas.json").then(function (data) {

  // Ajustar fechas para visualizar 
  var parseDate = d3.timeParse("%Y");

  // Se estable rango y dominio de X
  var x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, function (d) { return parseDate(d.Agno); }));

  // Se estable rango y dominio de Y
  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, function (d) { return d.Valor; })]);

  // Se realiza la creación de los  ejes X e Y
  var EjeX = d3.axisBottom(x);
  var EjeY = d3.axisLeft(y);


  // se asignan nombre al eje X
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom) + ")")
    .style("text-anchor", "middle")
    .style("fill", "WHITE")
    .text("AÑO");

  // Se asignan nombre al eje Y
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 4)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "WHITE")
    .text("CIFRAS");


  // Se Agregan ejes al gráfico
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(EjeX);
  svg.append("g")
    .call(EjeY);

  // Se agregan línea de tiempo
  svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", d3.line()
      .x(function (d) { return x(parseDate(d.Agno)); })
      .y(function (d) { return y(d.Valor); })
  );

  // Se realiza la creación de las escalas en el color de la linea que interpola entre rojo y Azul con blanco

  var color = d3.scaleLinear()
    .domain([8000, d3.max(data, function (d) { return d.Valor; })])
    .range(["white", "red"]);

  // Se asigna el  elemento div para el tooltip y asignarle una clase

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

  // Se realiza la agregación línea vertical al gráfico

  var verticalLine = svg.append("line")
    .attr("id", "verticalLine")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "gray")
    .attr("stroke-width", 0.25)
    .style("display", "none");

  // Añadir puntos a la línea
  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) { return x(parseDate(d.Agno)); })
    .attr("cy", function (d) { return y(d.Valor); })
    .attr("r", 4)
    .attr("fill", function (d) { return color(d.Valor); })
    .on("mouseover", function (d) {

      // Se presenta la visualización del tooltip con la información del punto

      tooltip.style("visibility", "visible")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")
        .html("Fecha: " + d.Agno + "<br>Valor: " + d.Valor);

      // Se agrega para mostrar la línea vertical
      verticalLine
        .attr("x1", x(parseDate(d.Agno)))
        .attr("x2", x(parseDate(d.Agno)))
        .attr("y1", y(d.Valor))
        .attr("y2", height)
        .style("display", "block");
    })
    .on("mouseout", function (d) {
      // Se ocultar el tooltip
      tooltip.style("visibility", "hidden");

      // Se oculta la línea vertical
      verticalLine.style("display", "none");
    });

  // Se agrega una descripción mas amplia de la información que se presenta a continuación.
  d3.select("#chart")
    .append("div")
    .attr("class", "caption")
    .html("<p style='color: slategray;font-size: 16px'>El gráfico representa la evolución desde el año 2012 al 2022 con un Balance de Criminalidad del Ministerio de Interior permite ver cómo han ido evolucionando otros tipos de delitos en España como son el tráfico de drogas, los hurtos o los robos de vehículos. Además, recientemente Interior ha incluido en sus estadísticas periódicas los secuestros y las agresiones sexuales. </p>");
});
