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
            stockDayValues: [],
            stockPriceValues: [],
            stockTicker: 'AAPL'
        }
    }

    /**
     * Receives Stock Ticker input from user through StockForm, and updates data on screen accordingly
     * @param stockFormData All data collected in the StockForm (currently just the desired ticker)
     */

    receiveStockFormData = (stockFormData) => {
        this.setState({stockTicker: stockFormData}, () => {
            this.getStock();
        })
    }

    componentDidMount() {
        this.getStock();
    }

    /**
    * Fetches US Stock Market API information from Alphadvantage, and stores data in stockDayValues and stockPriceValues
    */

    getStock() {
        const API_KEY = process.env.API_KEY;
        const selfPointer = this;
        let stockDayValuesInner = [];
        let stockPriceValuesInner = [];
        let daily_Stock_API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.stockTicker}&apikey=${API_KEY}`

        fetch(daily_Stock_API_Call)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (data) {
                    for (var key in data['Time Series (Daily)']) {
                        stockDayValuesInner.push(key);
                        stockPriceValuesInner.push(data['Time Series (Daily)'][key]['1. open']);
                    }

                    selfPointer.setState({
                        stockPriceValues: stockPriceValuesInner,
                        stockDayValues: stockDayValuesInner,
                    });
                }
            )
    }

    render() {
        return (
            <div>
                <h1>Stock Watcher</h1>
                <StockForm sendStockFormData = {this.receiveStockFormData}></StockForm>
                <Plot
                    data={[
                        {
                            x: this.state.stockDayValues,
                            y: this.state.stockPriceValues,
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: { color: 'red' },
                        }
                    ]}
                    layout={{ width: 800, height: 600, title: `100 Days of ${this.state.stockTicker}` }}
                />
            </div>
        )
    }
}

export default Stock;