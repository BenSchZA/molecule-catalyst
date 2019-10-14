/**
 *
 * MarketChartD3
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper } from '@material-ui/core';
import * as d3 from "d3";
import './d3Style.css';
import { Project, ProjectSubmissionStatus } from 'domain/projects/types';
import { ethers } from "@panterazar/ethers";
import { bigNumberify } from '@panterazar/ethers/utils';

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    container: {
      boxShadow: 'none',
    },
    chartDiv: {
      padding: theme.spacing(2),
    },
    lineFill: {
      fill: '#9ad9d1',
    },
    buyLine: {
      stroke: '#3fb6e0',
    },
    sellLine: {
      stroke: '#51bdaf',
    },
    currentTooltipCircle: {
      stroke: '#3fb6e0',
      fill: '#3fb6e0',
    },
  });

interface OwnProps extends WithStyles<typeof styles> {
  project: Project,
};

class MarketChartD3 extends React.Component<OwnProps> {

    _rootNode;
    _svgNode;

    renderChart() {
      if (!this._rootNode) return;

      const marketData = this.props.project.chainData.marketData;
      const contributionRate = marketData.taxationRate;
      const currentTokenValue = Number(ethers.utils.formatEther(marketData.tokenPrice));
      const currentTokenSupply = Number(ethers.utils.formatEther(marketData.totalSupply));
      const poolValue = Number(ethers.utils.formatEther(marketData.poolValue));

      // D3 Code to create the chart
      // using this._rootNode as container
      // line & graph parameters
      const project = this.props.project;
      const ended = project.status == ProjectSubmissionStatus.ended;

      // Flat 100% collateralized token distribution
      const scaledPrice = bigNumberify(project.chainData.marketData.poolValue).mul(1e8).div(bigNumberify(project.chainData.marketData.totalSupply).add(1)).toNumber();
      const redistributePrice = scaledPrice/1e8;

      const current_supply = currentTokenSupply + 1,
        current_price = ended ? redistributePrice : currentTokenValue,
        y_intercept = ended ? redistributePrice : 0.5,
        slope = ended ? 0 : (current_price - y_intercept) / current_supply;

      let max_supply = current_supply > 0 ? current_supply*2 : 2;
      let min_mint = max_supply/1000;

      // set the dimensions and margins of the graph
      let margin = {
          top: 20,
          right: 70,
          bottom: 70,
          left: 100
        },
        width = this._rootNode.offsetWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // aggregate line data points in array of objects
      let data_sell = d3.range(0, max_supply, min_mint).map(
        function (d) {
          return {
            "x": d,
            "y": d * slope + y_intercept - (contributionRate/100)*(d * slope + y_intercept)
          }
        });

      let data = d3.range(0, max_supply, min_mint).map(
        function (d) {
          return {
            "x": d,
            "y": d * slope + y_intercept
          }
        });

      let area_function = !ended ? (d) => d * slope + y_intercept - (contributionRate/100)*(d * slope + y_intercept) : 
        (d) => d * slope + y_intercept;

      // data array to draw area below curve
      let area_data = d3.range(0, current_supply - 1, min_mint).map(
        function (d) {
          return {
            "x": d,
            "y": area_function(d), 
          }
        });

      // helper function to calculate optimum y-tick settings
      function getSmartTicks(max_y) {
        //base step between nearby two ticks
        let step = Math.pow(2, Math.round(max_y).toString().length - 1);

        //add one more step if the last tick value is the same as the max value
        //if you don't want to add, remove "+1"
        let slices_count = Math.ceil((max_y) / step); //Math.ceil((max_y + 1) / step); 

        return {
          end_point: slices_count * step,
          count: Math.min(10, slices_count) //show max 10 ticks
        };
      }

      // data.map(a => a.y)) create array of y-values
      let y_tick_settings = getSmartTicks(d3.max(data.map(a => a.y)));

      // set the ranges
      let xscale = d3.scaleLinear()
        .domain([0, max_supply])
        .range([0, width]);

      let yscale = d3.scaleLinear()
        .domain([0, y_tick_settings.end_point])
        .range([height, 0]);

      // line generator
      let line = d3.line()
        .x(function (d) {
          return xscale(d.x);
        })
        .y(function (d) {
          return yscale(d.y);
        })
        .curve(d3.curveMonotoneX); // apply smoothing to the line

      let line_sell = d3.line()
        .x(function (d) {
          return xscale(d.x);
        })
        .y(function (d) {
          return yscale(d.y);
        })
        .curve(d3.curveMonotoneX); // apply smoothing to the line

      // area generator (area = collateral)
      let area = d3.area()
        .x(function (d) {
          return xscale(d.x);
        })
        .y0(height)
        .y1(function (d) {
          return yscale(d.y);
        });

      // append the svg obgect to the body of the page
      if(this._svgNode) {
        this._rootNode.childNodes.forEach(node => {
          node.remove();
        });
      }

      this._svgNode = d3.select(this._rootNode)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // fill area below line to indicate current market cap
      this._svgNode.append("path")
        .datum(area_data)
        .attr("class", `area ${this.props.classes.lineFill}`)
        .attr("d", area);

      // add line to grah
      this._svgNode.append("path")
        .datum(data)
        .attr("class", `line ${this.props.classes.buyLine}`)
        .attr("d", line);

      !ended ? this._svgNode.append("path")
        .datum(data_sell)
        .attr("class", `line ${this.props.classes.sellLine}`)
        .attr("d", line_sell) : null;

      // grid line functions
      function makexGridlines() {
        return d3.axisBottom(xscale)
      };

      function makeyGridlines() {
        return d3.axisLeft(yscale)
      };

      // add gridlines to graph
      this._svgNode.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .style("stroke-dasharray", ("3,3"))
        .call(makexGridlines()
          .tickSize(-height)
          .tickFormat("")
        );

      this._svgNode.append("g")
        .attr("class", "grid")
        .style("stroke-dasharray", ("3,3"))
        .call(makeyGridlines()
          .ticks([y_tick_settings.count])
          .tickSize(-width)
          .tickFormat("")
        );

      // add x- and y-axis
      this._svgNode.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom().scale(xscale));

      this._svgNode.append("g")
        .call(d3.axisLeft().scale(yscale).ticks(y_tick_settings.count));

      // axis titles
      this._svgNode.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + -1 * (margin.left / 3 * 2) + "," + (height / 2) + ")rotate(-90)")
        .text("Price per token");

      this._svgNode.append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.bottom / 3 * 2) + ")")
        .text("Supply");

      // append group holding tooltip elements
      let tooltipGroup = this._svgNode.append("g")
        .attr("class", "tooltip-group")
        .style("display", "none");

      // append line to show x-coordinate of tooltip
      tooltipGroup.append("line")
        .attr("class", "x-line")
        .attr("y1", 0)
        .attr("y2", height);

      // append line to show y-coordinate of tooltip
      tooltipGroup.append("line")
        .attr("class", "y-line")
        .attr("x1", width)
        .attr("x2", width);

      // text to display token price at mouse location
      tooltipGroup.append("text") // white shade to make text legible when over line
        .attr("class", "label-shade y-label-shade")
        .attr("dx", 8)
        .attr("dy", "-.3em");
      tooltipGroup.append("text") // actual text
        .attr("class", "label-text y-label-text")
        .attr("dx", 8)
        .attr("dy", "-.3em");

      // text to display date at mouse location
      tooltipGroup.append("text")
        .attr("class", "label-shade x-label-shade")
        .attr("dx", 8)
        .attr("dy", "1em");
      tooltipGroup.append("text")
        .attr("class", "label-text x-label-text")
        .attr("dx", 8)
        .attr("dy", "1em");

      // add circle around data point closest to mouse pointer
      tooltipGroup.append("circle")
        .attr("class", `tooltip-circle ${this.props.classes.currentTooltipCircle}`)
        .attr("r", 4);

      // format displayed numbers for human consumption
      let formatNumber = d3.format(",.2f");

      // function to select data point based on mouse position
      function mouseMove(context: MarketChartD3) {
        let x0 = xscale.invert(d3.mouse(d3.event.currentTarget)[0]); // x-coordinate of mouse pointer
        let i = d3.bisector(function (d) {
          return d.x;
        }).left(data, x0, 1);
        let d0 = data[i - 1];
        let d1 = data[i - 1];
        let d = x0 - d0.supply > d1.supply - x0 ? d1 : d0;

        // move x-line to data point closest to mouse location
        tooltipGroup.select("line.x-line")
          .attr("transform",
            "translate(" + xscale(d.x) + "," + yscale(d.y) + ")")
          .attr("y2", height - yscale(d.y));

        // move y-line to data point closest to mouse location
        tooltipGroup.select("line.y-line")
          .attr("transform",
            "translate(" + -1 * width + "," + yscale(d.y) + ")")
          .attr("x2", width + xscale(d.x));

        // move tooltip circle to data point closest to mouse location
        tooltipGroup.select("circle.tooltip-circle")
          .attr("transform",
            "translate(" + xscale(d.x) + "," + yscale(d.y) + ")");

        // move token price text to data point closest to mouse location
        tooltipGroup.select("text.y-label-shade")
          .attr("transform",
            "translate(" + (xscale(d.x)-150) + "," + yscale(d.y) + ")")
          .text("Price:\t\t\t " + " $" + formatNumber(d.y));

        tooltipGroup.select("text.y-label-text")
          .attr("transform",
            "translate(" + (xscale(d.x)-150) + "," + yscale(d.y) + ")")
          .text("Price:\t\t\t " + " $" + formatNumber(d.y));

        // move token supply text to data point closest to mouse location
        tooltipGroup.select("text.x-label-shade")
          .attr("transform",
            "translate(" + (xscale(d.x)-150) + "," + yscale(d.y) + ")")
          .text("Supply: " + formatNumber(d.x));

        tooltipGroup.select("text.x-label-text")
          .attr("transform",
            "translate(" + (xscale(d.x)-150) + "," + yscale(d.y) + ")")
          .text("Supply: " + formatNumber(d.x));
      }

      // rectangle to catch mouse movement
      this._svgNode.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function () {
          tooltipGroup.style("display", null);
        })
        .on("mouseout", function () {
          tooltipGroup.style("display", "none");
        })
        .on("mousemove", () => {
          mouseMove(this)
        });

    this.appendCurrentData({x: current_supply, y: current_price}, data, data_sell, poolValue, width, height, xscale, yscale, formatNumber, ended)
  }

  appendCurrentData(d, buy_data, sell_data, collateralPool, width, height, xscale, yscale, formatNumber, ended) {
    const tag = "current";

    // append group holding tooltip elements
    const tooltipGroup = this._svgNode.append("g")
      .attr("class", `tooltip-group-${tag}`)
      .style("display", null);

    // pool label text
    tooltipGroup.append("text") // actual text
      .attr("class", `label-text pool-label-text-${tag}`)
      .attr("dx", 8)
      .attr("dy", "-.3em");

    // token price text
    tooltipGroup.append("text") // actual text
      .attr("class", `label-text y-label-text-${tag}`)
      .attr("dx", 8)
      .attr("dy", "-.3em");

    // text to display date at mouse location
    tooltipGroup.append("text")
      .attr("class", `label-text x-label-text-${tag}`)
      .attr("dx", 8)
      .attr("dy", "1em");

    // append line to show x-coordinate of tooltip
    tooltipGroup.append("line")
      .attr("class", `x-line-${tag}`)
      .attr("y1", 0)
      .attr("y2", height);

    // append line to show y-coordinate of tooltip
    tooltipGroup.append("line")
      .attr("class", `y-line-${tag}`)
      .attr("x1", width)
      .attr("x2", width);

    // tooltip circle
    tooltipGroup.append("circle")
      .attr("class", `tooltip-circle-${tag} ${this.props.classes.currentTooltipCircle}`)
      .attr("r", 4);

    // x-line
    tooltipGroup.select(`line.x-line-${tag}`)
      .attr("transform",
        "translate(" + xscale(d.x) + "," + yscale(d.y) + ")")
      .attr("y2", height - yscale(d.y));
  
    // y-line
    tooltipGroup.select(`line.y-line-${tag}`)
      .attr("transform",
        "translate(" + -1 * width + "," + yscale(d.y) + ")")
      .attr("x2", width + xscale(d.x));

    // place tooltip circle
    tooltipGroup.select(`circle.tooltip-circle-${tag}`)
      .attr("transform",
        "translate(" + xscale(d.x) + "," + yscale(d.y) + ")");

    // pool label text
    tooltipGroup.select(`text.pool-label-text-${tag}`)
      .attr("transform",
        "translate(" + (xscale(d.x)) + "," + (yscale(d.y/2)) + ")")
      .text(`Incentive Pool:\t\t\t ${formatNumber(collateralPool)} DAI`);

    // token price text
    tooltipGroup.select(`text.y-label-text-${tag}`)
      .attr("transform",
        "translate(" + (xscale(d.x)-100) + "," + (yscale(d.y)-30) + ")")
      .text(`Current Price:\t\t\t ${formatNumber(d.y)} DAI`);

    // token supply text
    tooltipGroup.select(`text.x-label-text-${tag}`)
      .attr("transform",
        "translate(" + (xscale(d.x)-100) + "," + (yscale(d.y)-30) + ")")
      .text(`Current Supply:\t\t\t ${formatNumber(d.x - 1)}`);

    // Line labels: buy/sell
    tooltipGroup.append("text")
      .attr("class", `label-text line-label-buy-${tag} ${this.props.classes.buyLine}`)
      .attr("dx", 8)
      .attr("dy", "-.3em");

    tooltipGroup.append("text")
      .attr("class", `label-text line-label-sell-${tag} ${this.props.classes.sellLine}`)
      .attr("dx", 8)
      .attr("dy", "-.3em");

    tooltipGroup.select(`text.line-label-buy-${tag}`)
      .attr("x", function(_) { return xscale(buy_data[`${buy_data.length - 100}`].x) - 50 })
      .attr("y", function(_) { return yscale(buy_data[`${buy_data.length - 100}`].y) - 10 })
      .text(!ended ? "Buy" : "Redistribute");

    !ended ? tooltipGroup.select(`text.line-label-sell-${tag}`)
      .attr("x", function(_) { return xscale(sell_data[`${sell_data.length - 100}`].x) - 50 })
      .attr("y", function(_) { return yscale(sell_data[`${sell_data.length - 100}`].y) - 10 })
      .text("Sell") : null;
  }

  constructor(props) {
    super(props);
    this.renderChart = this.renderChart.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  _setRef(componentNode) {
    this._rootNode = componentNode;
    // remove old nodes
    if(this._rootNode) {
      this._rootNode.childNodes.forEach(node => {
        node.remove();
      });
    }
    this.renderChart();
  }

  componentDidMount() {
    // Re-render from scratch on each resize
    window.addEventListener('resize', this.renderChart);
  }

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <section className={classes.layout}>
          <Paper className={classes.container} square>
            <div className={classes.chartDiv}>
              <div ref={this._setRef.bind(this)} />
            </div>
          </Paper>
        </section>
      </Fragment> 
    );
  }
};

export default withStyles(styles, { withTheme: true })(MarketChartD3);
