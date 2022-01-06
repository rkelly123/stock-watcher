import React from 'react';
import Plot from 'react-plotly.js';
import StockForm from './StockForm';

/**
 * A class handling all of the stock API fetching and manipulation/demonstration of the data gathered
 */

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockTimeValues: [],
            stockPriceValues: [],
            stockTicker: 'AAPL',
            graphMode: '100 days of '
        }
    }

    /**
     * Receives Stock Ticker input from user through StockForm, and updates data on screen accordingly
     * @param stockFormData All data collected in the StockForm (currently just the desired ticker)
     */

    receiveStockFormData = (stockTickerInput, stockTimeScaleInput) => {
        this.setState({ stockTicker: stockTickerInput, graphMode: stockTimeScaleInput }, () => {
            this.getStock();
        })
    }

    componentDidMount() {
        this.getStock();
    }

    /**
    * Fetches US Stock Market API information from Alphadvantage, and stores data in stockTimeValues and stockPriceValues
    */

    getStock() {
        const API_KEY = process.env.API_KEY;
        const selfPointer = this;
        let stockTimeValuesInner = [];
        let stockPriceValuesInner = [];
        let API_Mode = ''
        let API_Link = ''
        if (this.state.graphMode === "100 days of ") {
            API_Link = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.stockTicker}&apikey=${API_KEY}`
            API_Mode = 'Time Series (Daily)'
        }
        else if (this.state.graphMode === "Today's ") {
            API_Link = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.stockTicker}&interval=5min&apikey=${API_KEY}`
            API_Mode = 'Time Series (5min)'
        }
        fetch(API_Link)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (data) {
                    for (var key in data[API_Mode]) {
                        stockTimeValuesInner.push(key);
                        stockPriceValuesInner.push(data[API_Mode][key]['1. open']);
                    }

                    selfPointer.setState({
                        stockPriceValues: stockPriceValuesInner,
                        stockTimeValues: stockTimeValuesInner,
                    });
                }
            )
    }

    render() {
        return (
            <div>
                <h1>Stock Watcher</h1>

                <StockForm sendStockFormData={this.receiveStockFormData}></StockForm>

                {this.state.stockTimeValues.length > 0 ?
                    <Plot
                        data={[
                            {
                                x: this.state.stockTimeValues,
                                y: this.state.stockPriceValues,
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: 'red' },
                            }
                        ]}
                        layout={{ width: 800, height: 600, title: `${this.state.graphMode} ${this.state.stockTicker}` }}
                    /> :
                    <h2>Invalid Ticker</h2>
                }
            </div>
        )
    }
}

export default Stock;