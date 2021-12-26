import React from 'react';
import Plot from 'react-plotly.js';

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockDayValues: [],
            stockPriceValues: [],
            stockTicker: ''
        }
    }

    componentDidMount() {
        this.getStock();
    }

    getStock() {
        const API_KEY = '';
        const selfPointer = this;
        let stockDayValuesInner = [];
        let stockPriceValuesInner = [];
        let stockTickerInput = 'IBM';
        let daily_Stock_API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockTickerInput}&apikey=${API_KEY}`

        fetch(daily_Stock_API_Call)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (data) {
                    console.log(data)

                    for (var key in data['Time Series (Daily)']) {
                        stockDayValuesInner.push(key);
                        stockPriceValuesInner.push(data['Time Series (Daily)'][key]['1. open']);
                    }

                    selfPointer.setState({
                        stockPriceValues: stockPriceValuesInner,
                        stockDayValues: stockDayValuesInner,
                        stockTicker: stockTickerInput
                    });
                }
            )
    }

    render() {
        return (
            <div>
                <h1>Stock Watcher</h1>
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