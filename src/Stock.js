import React from 'react';
import Plot from 'react-plotly.js';
import StockForm from './StockForm';

/**
 * A class handling all of the stock API fetching and manipulation/demonstration of the data gathered
 */

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            stockDayValues: [],
            stockPriceValues: [],
            stockTicker: 'AAPL',
            isToggleOn: false
        }
    }

    /**
     * Receives Stock Ticker input from user through StockForm, and updates data on screen accordingly
     * @param stockFormData All data collected in the StockForm (currently just the desired ticker)
     */

    receiveStockFormData = (stockFormData) => {
        this.setState({ stockTicker: stockFormData }, () => {
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
        let API_Mode = ''
        let API_Link = ''
        if (this.state.isToggleOn === false) {
            API_Link = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.stockTicker}&apikey=${API_KEY}`
            API_Mode = 'Time Series (Daily)'
        }
        else {
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
                        stockDayValuesInner.push(key);
                        stockPriceValuesInner.push(data[API_Mode][key]['1. open']);
                    }

                    selfPointer.setState({
                        stockPriceValues: stockPriceValuesInner,
                        stockDayValues: stockDayValuesInner,
                    });
                }
            )
    }
    handleClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn,
        }));
        this.getStock()
    }
    render() {
        return (
            <div>
                <h1>Stock Watcher</h1>
                <button onClick={this.handleClick}>
                    {this.state.isToggleOn ? 'Intraday: ON' : 'Intraday: OFF'}
                </button>
                <button onClick={this.handleClick}>
                    {this.state.isToggleOn ? 'Daily: OFF' : 'Daily: ON'}
                </button>
                <StockForm sendStockFormData={this.receiveStockFormData}></StockForm>

                {this.state.stockDayValues.length > 0 ?
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
                    /> :
                    <h2>Invalid Ticker</h2>
                }
            </div>
        )
    }
}

export default Stock;