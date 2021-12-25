import React from 'react';

class Stock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockChartXValues: [],
            stockChartYValues: []
        }
    }

    componentDidMount() {
        this.getStock();
    }

    getStock() {
            const API_KEY = '';
            let Daily_Stock_API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=${API_KEY}`

            fetch(Daily_Stock_API_Call)
            .then(
                function(response) {
                    return response.json();
                }
            )
            .then(
                function(data) {
                    console.log(data)
                }
            )
    }

    render() {
        return (
            <div>
                <h1>Stock Watcher</h1>
            </div>
        )
    }
}

export default Stock;