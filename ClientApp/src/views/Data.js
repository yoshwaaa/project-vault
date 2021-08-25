import React, { Component } from 'react';
import axios from 'axios';


class Data extends Component {


////////////////////////////
// Initialize state
////////////////////////////

  state = {
    data: [],
    filteredData: [],
    dataList: []
  }

////////////////////////////
// Load data
////////////////////////////

  refreshList() {
    setTimeout(() => {
      axios.get(
        'http://api.bcbhtech.com/users',
        {headers: {
            "auth" : "2sx3SgceF2JK8DasoDYmngZ31SJaPmz2"
          }
        }
      )
      .then((response) => {
          let data = response.data;
          this.setState({
            data: data,
            filteredData: data
          });
        }
      );
    }, 150);
  }

  componentDidMount() {
    this.refreshList();
  }

// Hanlde Data

handleDataDropdown = (event) => {
    let dataDropdownList = [];
    let dataTerm = event.target.value;
    if (dataTerm !== "none") {
      for (let key in this.state.filteredData) {
        let dropdownItem = this.state.filteredData[key][dataTerm];
        dataDropdownList.push({name: dropdownItem, value: 1});
      }
      var tempResult = {}

      for ( let { name } of dataDropdownList)
      tempResult[name] = { 
          name, 
          count: tempResult[name] ? tempResult[name].count + 1 : 1
      }      
      let finalResults = Object.values(tempResult)
      this.setState({
          dataList: finalResults
      });
    } else {
      this.setState({
        dataList: []
    });
    }
}


////////////////////////////
// Render app
////////////////////////////

  render() {

    // D3 Logic
    // var data = [80, 120, 60, 150, 200];
    // var barHeight = 20;
    // var bar = d3.select('svg').selectAll('rect').data(data).enter().append('rect').attr('width', function(d) {  return d; }).attr('height', barHeight - 1).attr('transform', function(d, i) { return "translate(0," + i * barHeight + ")"; });

    // End D3 Logic

    let list = this.state.dataList != [] ?  this.state.dataList.map((d) => <li key={d.name}><span className="list-item-left">{d.name}</span> - <span>{d.count}</span></li>) : '';
    return (
    <div className="container">
        <h1>I will bring you the data!</h1>
       <p>Total records: {this.state.filteredData.length}</p>
       <select onChange={this.handleDataDropdown}>
            <option key="0" value="none">None</option>
            <option key="1" value="diagnosis">Diagnosis</option>
            <option key="2" value="stage">Stage</option>
            <option key="3" value="status">Status</option>
            <option key="4" value="owner">Owner</option>
       </select>
       <ul>
           {list}
       </ul>
       <div className='d3-graph'>
        <svg width='200' height='500'></svg>
       </div>
    </div>
    );
}
}

////////////////////////////
// End render app
////////////////////////////

export default Data;
