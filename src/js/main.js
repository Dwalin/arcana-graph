let $           = require('jquery');
let d3          = require('d3');



'use strict';

$(function() {

  fetch("./data.json")
    .then(res => res.json())
    .then(data => {





      let input  = data.input.split('');
      let length = +input.length;

      console.log(input, length);

      let forwardPrimers  = data.parts[0]["primers"]["forward"];
      let reversePrimers  = data.parts[0]["primers"]["reverse"];
      let pairs = data.parts[0]["primers"]["pairs"];


      const svg = d3
        .select('.ar-graph')
        .append("svg");


      svg.selectAll('*').remove();

      const g = svg.append('g');

      svg.attr("height", "1000");
      svg.attr("width", "1000");
      svg.attr("viewBox", "0 0 1000 1000");
      svg.attr("preserveAspectRatio", "xMidYMid meet");

      const margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

      console.log(width, height);

      const x = d3.scaleLinear()
        .domain([0, length])
        .rangeRound([0, width]);


      const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain(
          d3.extent(forwardPrimers.map(d => parseFloat(d.quality)).concat(reversePrimers.map(d => parseFloat(d.quality))))
        ).nice();

      g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      svg.call(d3.zoom().on("zoom", function () {

        //console.log(
        //	"transform",
        //	"translate(" + d3.event.transform.x + "px " + d3.event.transform.y + "px)"
        //	+
        //	" scale(" + d3.event.transform.k + ")"
        //);

        g.style(
          "transform",
          "translate(" + (margin.left + d3.event.transform.x) + "px, " + (margin.left + d3.event.transform.y) + "px)"
          +
          " scale(" + d3.event.transform.k + ")"
        );

        //graph.transition()
        //	.duration(200)
        //	.attr("transform", "translate( -1500 -200 )" + " rotate(" + ( d3.event.transform.x/10) + " 2000 2000)" + " scale(4)");

      }));

      g.append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(0,' + width + ')')
        .call(
          d3.axisBottom(x)
          .ticks(length)
          .tickFormat(function(d, i) {
            return input[i];
          })
        );

      g.append('g')
        .attr('class', 'axis-y')
        .call(d3.axisLeft(y).ticks(25, 'f'));

      g.append('g')
        .attr('class', 'axis-y2')
        .attr('transform', 'translate(' + width + ',0)')
        .call(d3.axisRight(y).ticks(25, 'f'));

      var forward = g.selectAll('line.forward')
        .data(forwardPrimers)
        .enter();

      forward.append('line')
        .attr('class', 'forward')
        .attr('x1', d => x(parseInt(d.start)))
        .attr('y1', d => y(parseFloat(d.quality)))
        .attr('x2', d => x(parseInt(d.start) + parseInt(d.length)))
        .attr('y2', d => y(parseFloat(d.quality)))
        .classed('ar-line _forward', true);

      forward
        .append("circle")
        .attr("cx", d => x(parseInt(d.start) + parseInt(d.length)))
        .attr("cy", d => y(parseFloat(d.quality)))
        .classed('ar-circle _forward', true);



      var reverse = g.selectAll('line.reverse')
        .data(reversePrimers)
        .enter();

      reverse
        .append("circle")
        .attr("cx", d => x(d.start - d.length))
        .attr("cy", d => y(parseFloat(d.quality)))
        .classed('ar-circle _reverse', true);

      reverse
        .append('line')
        .attr('class', 'reverse')
        .attr('x1', d => x(d.start))
        .attr('y1', d => y(d.quality))
        .attr('x2', d => x(d.start - d.length))
        .attr('y2', d => y(d.quality))
        .classed('ar-line _reverse', true);

    });


});