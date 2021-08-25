import React, { Component } from 'react';
import axios from 'axios';


class Archive extends Component {


////////////////////////////
// Initialize state
////////////////////////////

  state = {
    data: [],
    filteredData: [],
    dataList: [],
    archiveLimit: 10,
    archiveOffset: 0
  }

////////////////////////////
// Load data
////////////////////////////

  refreshList(archiveLimit, archiveOffset) {
    setTimeout(() => {
      axios.get(
        'http://api.bcbhtech.com/users/archive',
        {headers: {
            "auth" : "2sx3SgceF2JK8DasoDYmngZ31SJaPmz2",
            "limit": archiveLimit,
            "offset": archiveOffset
          }
        }
      )
      .then((response) => {
          let data = response.data;
          console.log(data);
          this.setState({
            data: data,
            filteredData: data
          });
        }
      );
    }, 150);
  }

  componentDidMount() {
    this.refreshList(this.state.archiveLimit, this.state.archiveOffset);
  }

////////////////////////////
// Pagination Functions
////////////////////////////

handleNextBtn = () => {
  let offset = this.state.archiveOffset + 10;
  this.refreshList(this.state.archiveLimit, offset);
  this.setState({
    archiveOffset: offset
  });
}

handlePrevBtn = () => {
  let offset = this.state.archiveOffset >= 9 ? this.state.archiveOffset - 10 : 0;
  this.refreshList(this.state.archiveLimit, offset);
  this.setState({
    archiveOffset: offset
  });
}

////////////////////////////
// Render app
////////////////////////////

  render() {
    let listData = this.state.filteredData;
    let list = listData.map((d) => <li key={d.id}><span className="list-item-left">{d.full_name}</span> | <span>{d.email_address}, {d.diagnosis} - {d.user_address}, {d.user_city}, {d.user_state} {d.user_zip} - Assigned to {d.owner} </span></li>);
    return (
    <div className="container">
        <h1>Welcome to the archives!</h1>
       <ul>
           {list}
       </ul>
       {this.state.archiveOffset >= 9 && (
         <button onClick={this.handlePrevBtn}>Previous</button>
       )}
       <button onClick={this.handleNextBtn}>Next</button>
    </div>
    );
}
}

////////////////////////////
// End render app
////////////////////////////

export default Archive;
