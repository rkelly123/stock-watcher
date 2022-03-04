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
            stockVolumeValues: [],
            companyName: [],
            company_52WeekHigh: [],
            company_52WeekLow: [],
            companyDescription: [],
            priceToSalesRatio: [],
            profitMargin: [],
            RevenuePerShareTTM: [],
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
        let stockVolumeValuesInner = [];
        let companyNameInner = [];
        let company_52WeekHighInner = [];
        let company_52WeekLowInner = [];
        let companyDescriptionInner = [];
        let priceToSalesRatioInner = [];
        let profitMarginInner = [];
        let RevenuePerShareTTMInner = [];
        let API_Mode = ''
        let API_Link = ''
        let company_OverviewAPI = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${this.state.stockTicker}&apikey=${API_KEY}`
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
                        stockVolumeValuesInner.push(data[API_Mode][key]['5. volume']);
                    }

                    selfPointer.setState({
                        stockPriceValues: stockPriceValuesInner,
                        stockTimeValues: stockTimeValuesInner,
                        stockVolumeValues: stockVolumeValuesInner
                    });
                }
            )

            fetch(company_OverviewAPI)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (data) {
                    companyNameInner.push(data['Name']);
                    company_52WeekHighInner.push(data['52WeekHigh']);
                    company_52WeekLowInner.push(data['52WeekLow']);
                    companyDescriptionInner.push(data['Description']);
                    priceToSalesRatioInner.push(data['PriceToSalesRatioTTM']);
                    profitMarginInner.push(data['ProfitMargin']);
                    RevenuePerShareTTMInner.push(data['RevenuePerShareTTM']);
                    
                    selfPointer.setState({
                        companyName: companyNameInner,
                        company_52WeekHigh: company_52WeekHighInner,
                        company_52WeekLow: company_52WeekLowInner,
                        companyDescription: companyDescriptionInner,
                        priceToSalesRatio: priceToSalesRatioInner,
                        profitMargin: profitMarginInner,
                        RevenuePerShareTTM: RevenuePerShareTTMInner
                    });
                }
            )
    }

    render() {
        let volumeText = ""
        this.state.graphMode === "100 days of " ? 
                    volumeText = "(Past Day)"
                    :
                    volumeText = "(Past 5 Minutes)"
                
        return (
            <div>
                <h1>Stock Watcher</h1>

                <StockForm sendStockFormData={this.receiveStockFormData}></StockForm>

                {this.state.stockTimeValues.length > 0 ?
                    <><Plot
                        data={[
                            {
                                x: this.state.stockTimeValues,
                                y: this.state.stockPriceValues,
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: 'red' },
                            }
                        ]}
                        layout={{ width: 800, height: 600, title: `${this.state.graphMode}${this.state.companyName}` }} /><div className="stockInfo">

                            <h4>{this.state.stockTicker} Information:</h4>
                            <p>Volume {volumeText}: {this.state.stockVolumeValues.at(0)}</p>
                            <p>52 Week High: {this.state.company_52WeekHigh}</p>
                            <p>52 Week Low: {this.state.company_52WeekLow}</p>
                            <p>Profit Margin: {this.state.profitMargin}</p>
                            <p>Price to Shares Ratio (TTM): {this.state.priceToSalesRatio}</p>
                            <p>Revenue Per Share (TTM) {this.state.RevenuePerShareTTM}</p>

                        </div>

                        <h2>About the company:</h2>
                        <h3>{this.state.companyDescription}</h3>
                        </>
                    :
                    <h2>Invalid Ticker</h2>
                }
            </div>
        )
    }
}

export default Stock;