/**
 *
 * MarketChartD3
 *
 */

import React, { Fragment } from 'react';
import { Theme, createStyles, withStyles, WithStyles, Paper, } from '@material-ui/core';
import * as d3 from "d3";
import './d3Style.css';
import { ethers } from 'ethers';
import dayjs from 'dayjs';
import { MintTX, BurnTX, TransactionType, Project } from 'domain/projects/types';

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    container: {
      boxShadow: 'none',
    },
    chart: {
    },
    chartDiv: {
      padding: theme.spacing(2),
    },
  });

interface OwnProps extends WithStyles < typeof styles > {
  project: Project;
};

class MarketHistoryChart extends React.Component<OwnProps> {

  _rootNode;
  _svgNode;

  renderChart() {
    if (!this._rootNode) return;

    const {
      project,
    } = this.props;

    const spotPrice = Number(ethers.utils.formatEther(project.chainData.marketData.tokenPrice));
    const transactions = project.marketData.transactions;
    const ended = !project.marketData.active;

    if (transactions.length === 0) return;

    const cleanTransactions = transactions.map(value => {
      switch (value.txType) {
        case TransactionType.MINT:
          return {
            ...value,
            tokenAmount: Number(ethers.utils.formatEther((value as MintTX).amountMinted)),
            daiAmount: Number(ethers.utils.formatEther((value as MintTX).collateralAmount)),
          };
        case TransactionType.BURN:
          return {
            ...value,
            tokenAmount: Number(ethers.utils.formatEther((value as BurnTX).amountBurnt)),
            daiAmount: Number(ethers.utils.formatEther((value as BurnTX).collateralReturned)),
          };
        default:
          return {
            ...value,
            tokenAmount: 0,
            daiAmount: 0,
          };
      }
    });

    const marketHistory = cleanTransactions.map(value => {
      return {
        type: value.txType,
        timestamp: dayjs(value.timestamp).unix(),
        blockNumber: value.blockNumber,
        transactionHash: value.txHash,
        tokenAmount: value.tokenAmount,
        daiAmount: value.daiAmount,
        firstTokenPrice: value.daiAmount/value.tokenAmount,
      }
    });

    // set the dimensions and margins of the graph
    let margin = {top: 20, right: 70, bottom: 70, left: 100},
    width = this._rootNode.offsetWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // axis highlight box dimensions
    let axis_rect_width = 100,
        axis_rect_height = 30;

    const dataPointXShift = 120;
    const dataPointYShift = 120;

    // formatters
    let parseEpoch = d3.timeParse("%s");
    let formatTime = d3.timeFormat("%d/%m/%Y");
    let formatNumber = d3.format(",.5f");
    let formatTokens = d3.format(",.2f");

    // market variables
    let market_creation_date = parseEpoch(marketHistory[0].timestamp),
      initial_price = marketHistory[0].firstTokenPrice,
      current_date = new Date(),
      current_price = spotPrice;

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

    let data = marketHistory.map((value) => ({
      date: parseEpoch(value.timestamp),
      first_token_price: value.firstTokenPrice,
      token_amount: value.tokenAmount,
      dai_amount: value.daiAmount,
      type: value.type,
    }));

    // add data point for current price
    if(!ended) {
      data.push({
        date: current_date,
        first_token_price: current_price,
        token_amount: 0,
        dai_amount: 0,
        type: TransactionType.TRANSFER,
      });
    }
    
    // label boxes for data points
    let tooltipLabel = d3.select(this._rootNode)
      .append("div")
      .attr("class", "tooltip-label")
      .style("opacity", 0);

    // set data ranges and scales
    let xscale = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([0, width]);

    let yscale = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.first_token_price; })])
      .range([height, 0]);

    // line generator
    let line = d3.line()
      .x(function(d) { return xscale(d.date); })
      .y(function(d) { return yscale(d.first_token_price); })
      .curve(d3.curveLinear); //d3.curveStepBefore

    // area generator
    let area = d3.area()
      .x(function(d) { return xscale(d.date); })
      .y0(height)
      .y1(function(d) { return yscale(d.first_token_price); })
      .curve(d3.curveLinear); //d3.curveStepBefore

    // fill area below curve
    this._svgNode.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    // add gridlines to graph
    this._svgNode.append("g")
      .attr("class", "grid x-grid")
      .attr("transform", "translate(0," + height + ")")
      .style("stroke-dasharray", ("3,3"))
      .call(d3.axisBottom(xscale)
        .tickSize(-height)
        .tickFormat("")
      );

    this._svgNode.append("g")
      .attr("class", "grid y-grid")
      .style("stroke-dasharray", ("3,3"))
      .call(d3.axisLeft(yscale)
        .tickSize(-width)
        .tickFormat("")
      );

    // add line to grah
    this._svgNode.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

    // add x- and y-axis
    this._svgNode.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom()
        .scale(xscale)
        .ticks(5)
        .tickFormat(d3.timeFormat("%d/%m/%Y")))

    this._svgNode.append("g")
      .call(d3.axisLeft()
        .scale(yscale)
        .tickFormat(formatNumber));

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
      .text("Date");

    // group holding tooltip elements
    let tooltipGroup = this._svgNode.append("g")
      .attr("class", "tooltip-group")
      .style("display", "none");

    // line showing x-coordinate of tooltip
    tooltipGroup.append("line")
      .attr("class", "x-line")
      .attr("y1", 0)
      .attr("y2", height);

    // append line to show y-coordinate of tooltip
    tooltipGroup.append("line")
      .attr("class", "y-line")
      .attr("x1", 0)
      .attr("x2", width);

    // add circle around data point closest to mouse pointer
    tooltipGroup.append("circle")
      .attr("class", "tooltip-circle")
      .attr("r", 4);

    // group holding axis highlight elements
    let axisRectGroup = this._svgNode.append("g")
      .attr("class", "axis-highlight-group")
      .style("display", "none");

    // rect displaying x value
    axisRectGroup.append("rect")
      .attr("class", "axis-rect x-axis-rect")
      .attr("width", axis_rect_width)
      .attr("height", axis_rect_height);
    axisRectGroup.append("text")
      .attr("class", "axis-rect-text axis-rect-text-x")
      .style("text-anchor", "middle")
      .style("alignment-baseline", "central");

    // rect displaying y value
    axisRectGroup.append("rect")
      .attr("class", "axis-rect y-axis-rect")
      .attr("width", axis_rect_width)
      .attr("height", axis_rect_height);
    axisRectGroup.append("text")
      .attr("class", "axis-rect-text axis-rect-text-y")
      .style("text-anchor", "middle")
      .style("alignment-baseline", "central");

    // function to select data point based on mouse position
    function mouseMove() {

      // mouse coordinates
      let mouse_x = d3.mouse(d3.event.currentTarget)[0];
      // let mouse_y = d3.mouse(d3.event.currentTarget)[1];

      // determine data point that should be highlighted
      let x0 = xscale.invert(mouse_x); // conver x-coordinate to date
      let i = d3.bisector(function(d) { return d.date; }).left(data, x0, 1);
      let d0 = data[i - 1]; // data point to the left of cursor
      let d1 = data[i]; // data point to the right of cursor
      let d = x0 - d0.date > d1.date - x0 ? d1 : d0; // data point closest to cursor

      // move x-coordinate line to mouse location
      tooltipGroup.select("line.x-line")
        .attr("transform",
            "translate(" + mouse_x + ",0)");

      // x-axis highlight rect
      let rect_x =  mouse_x - axis_rect_width/2;
      let rect_y = height + margin.top - axis_rect_height/2 - 3;
      let text_x = mouse_x;
      let text_y = height + margin.top;

      // correct location if rect too close to y-axis or too far to the right
      if (mouse_x < axis_rect_width/2) {
        rect_x = 0;
        text_x = axis_rect_width/2;
      } else if (mouse_x > width - axis_rect_width/2) {
        rect_x = width - axis_rect_width;
        text_x = width - axis_rect_width/2;
      }

      axisRectGroup.select("rect.x-axis-rect")
          .attr("x", rect_x)
          .attr("y", rect_y);

      axisRectGroup.select("text.axis-rect-text-x")
        .attr("x", text_x)
        .attr("y", text_y)
        .text(formatTime(x0));

      // date below cursor is to the right of the second data point
      if (x0 >= data[1]["date"]) {
        // move y-coordinate line to height of data point to the right of cursor
        tooltipGroup.select("line.y-line")
        .attr("transform",
            "translate(0," + yscale(d1.first_token_price) + ")");

        // move tooltip circle to data point closest to mouse location
        tooltipGroup.select("circle.tooltip-circle")
          .style("display", null)
          .attr("transform",
              "translate(" + xscale(d.date) + "," + yscale(d.first_token_price) + ")");

        // data point label box
        tooltipLabel
          .html(d.type + "<br>" +
              "Tokens: " + formatTokens(d.token_amount) + "<br>" +
              `DAI: ${formatTokens(Math.abs(d.dai_amount))}`)
          .style("left", (xscale(d.date) + dataPointXShift) + margin.left + "px")
          .style("top", (yscale(d.first_token_price) + dataPointYShift) + "px")
          .style("display", null)
          .style("opacity", "1");

        // y-axis highlight rect
        let rect_x =  -axis_rect_width;
        let rect_y = yscale(d1.first_token_price) + margin.top - axis_rect_height - 3;
        let text_x = -axis_rect_width/2;
        let text_y = yscale(d1.first_token_price) + margin.top - 0.5*axis_rect_height;

        axisRectGroup.select("rect.y-axis-rect")
          .attr("x", rect_x)
          .attr("y", rect_y);

        axisRectGroup.select("text.axis-rect-text-y")
          .attr("x", text_x)
          .attr("y", text_y)
          .text(formatNumber(d1.first_token_price));

        // cursor assigns to most right data point (current price)
        // display current price label
        if (d["date"] == current_date) {
          // display special current price label
          tooltipLabel
            .html("Current Price: " + formatNumber(current_price))
            .style("left", (xscale(d.date) + dataPointXShift) + margin.left + "px")
            .style("top", (yscale(d.first_token_price) + margin.top + dataPointYShift) + "px")
            .style("display", null)
            .style("opacity", "1");
        }
      } else if (x0 < data[1]["date"]) {

        // move tooltip circle to data point closest to mouse location
        tooltipGroup.select("circle.tooltip-circle")
          .style("display", null)
          .attr("transform",
              "translate(" + xscale(d.date) + "," + yscale(d.first_token_price) + ")");

        // move y-coordinate line to 0
        tooltipGroup.select("line.y-line")
          .attr("transform",
            "translate(0," + yscale(initial_price) + ")");

        // y-axis highlight rect
        let rect_x =  -axis_rect_width;
        let rect_y = yscale(d.first_token_price) + margin.top - axis_rect_height - 3;
        let text_x = -axis_rect_width/2;
        let text_y = yscale(d.first_token_price) + margin.top - 0.5*axis_rect_height;

        axisRectGroup.select("rect.y-axis-rect")
          .attr("x", rect_x)
          .attr("y", rect_y);

        axisRectGroup.select("text.axis-rect-text-y")
          .attr("x", text_x)
          .attr("y", text_y)
          .text(formatNumber(d.first_token_price));

        // cursor assigns to left most point which is the market creation
        // display special market creation label
        if (d["date"] == market_creation_date) {
          // data point label box
          tooltipLabel
            .html("Market Creation: " + formatTime(market_creation_date) + "<br>" +
                "Initial Price: " + formatNumber(initial_price))
            .style("left", (xscale(d.date) + margin.left + dataPointXShift) + "px")
            .style("top", (yscale(d.first_token_price) + margin.top + dataPointYShift) + "px")
            .style("display", null)
            .style("opacity", "1");
        }
      }
    }

    // rectangle to catch mouse movement
    this._svgNode.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { tooltipGroup.style("display", null);
                      tooltipLabel.style("display", null);
                      axisRectGroup.style("display", null); })
      .on("mouseout", function() { tooltipGroup.style("display", "none");
                    tooltipLabel.style("display", "none");
                    axisRectGroup.style("display", "none"); })
      .on("mousemove", mouseMove);
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

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <section className={classes.layout}>
          <Paper className={classes.container} square>
              <div className={classes.chartDiv}>
                <div className={classes.chart} ref={this._setRef.bind(this)} />
              </div>
          </Paper>
        </section>
      </Fragment>
    );
  }
};

export default withStyles(styles, { withTheme: true })(MarketHistoryChart);
