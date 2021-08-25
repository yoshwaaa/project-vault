import React, { Component } from 'react';
import axios from 'axios';

////////////////////////////
// Import helper functions
////////////////////////////

import {updateStaticFilter} from '../helper-functions/update-static-filter';
import {updateDynamicFilter} from '../helper-functions/update-dynamic-filter';
import {updateGlobalSearch} from '../helper-functions/update-global-search';


class Main extends Component {

  ////////////////////////////
  // Initialize state
  ////////////////////////////

  state = {
    data: [],
    filteredData: [],
    formValue: {
      name: '',
      email: '',
      phone: '',
      diagnosis: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    },
    editing: false,
    editID: '',
    editUser: {
      name: '',
      email: '',
      phone: '',
      diagnosis: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    },
    selectedStaticFilter: [{"value": "All Working Leads", "label": ""}],
    dynamicFilter: [{"All": ""}],
    dynamicFilterActive: false,
    dynamicFilterEmptyValue: "",
    globalFilter: ""
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
 
  ////////////////////////////
  // Handle updates
  ////////////////////////////

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState( prevState => ({
      formValue: {
        ...prevState.formValue,
        [name]: value
      }
    }))
  }

  handleSubmit = (event) => {
    event.preventDefault();
      axios.post('http://api.bcbhtech.com/users', {name: this.state.formValue.name, email: this.state.formValue.email, phone: this.state.formValue.phone, diagnosis: this.state.formValue.diagnosis}, 
      {headers: {
        "auth" : "2sx3SgceF2JK8DasoDYmngZ31SJaPmz2"
        }
      }
    ).then(
      this.setState({
        formValue: {
          name: '',
          email: '',
          phone: '',
          diagnosis: '',
          address: '',
          city: '',
          state: '',
          zip: ''
        }
      })
    ).then(
      this.refreshList()
    );
  }

  handleEdit = (event) => {

    axios.get(
      `http://api.bcbhtech.com/users/${event.target.id}`,
      {headers: {
          "auth" : "2sx3SgceF2JK8DasoDYmngZ31SJaPmz2"
        }
      }
    )
    .then((response) => {
      let data = response.data;
      this.setState({
        editing: true,
        editID: data[0].id,
        editUser: {
          name: data[0].full_name,
          email: data[0].email_address,
          phone: data[0].phone_number,
          diagnosis: data[0].diagnosis,
          address: '',
          city: '',
          state: '',
          zip: ''
        }
      });
    }
  );
  }

  handleEditChange = (event) => {
    const {name, value} = event.target;
    this.setState( prevState => ({
      editUser: {
        ...prevState.editUser,
        [name]: value
      }
    }))
  }

  handleEditSubmit = (event) => {
    event.preventDefault();
    let editID = this.state.editID;
      axios.put(`http://api.bcbhtech.com/users/${editID}`, {name: this.state.editUser.name, email: this.state.editUser.email, phone: this.state.editUser.phone, diagnosis: this.state.editUser.diagnosis, archive: false}, 
      {headers: {
        "auth" : "2sx3SgceF2JK8DasoDYmngZ31SJaPmz2"
        }
      }
    ).then(
      this.setState({
        editing: false,
        editID: '',
        editUser: {
          name: '',
          email: '',
          phone: '',
          diagnosis: '',
          address: '',
          city: '',
          state: '',
          zip: ''
        }
      })
    ).then(
      this.refreshList()
    );
  }


  handleDelete = (ID) => {
      axios.delete(`http://api.bcbhtech.com/users/${ID}`,
      {headers: {
        "auth" : "2sx3SgceF2JK8DasoDYmngZ31SJaPmz2"
        }
      }
    ).then(
      this.refreshList()
    );
  }

  handleArchive = (event) => {
    event.preventDefault();
      let editID = this.state.editID;
      axios.put(`http://api.bcbhtech.com/users/${editID}`, {name: this.state.editUser.name, email: this.state.editUser.email, phone: this.state.editUser.phone, diagnosis: this.state.editUser.diagnosis, archive: true}, 
      {headers: {
        "auth" : "2sx3SgceF2JK8DasoDYmngZ31SJaPmz2"
        }
      }
    ).then(
      this.setState({
        editing: false,
        editID: '',
        editUser: {
          name: '',
          email: '',
          phone: '',
          diagnosis: '',
          address: '',
          city: '',
          state: '',
          zip: ''
        }
      })
    ).then(
      this.refreshList()
    );
  }

  handleClearForm = () => {
    this.setState({
      editing: false,
      editID: '',
      editUser: {
        name: '',
        email: '',
        phone: '',
        diagnosis: '',
        address: '',
        city: '',
        state: '',
        zip: ''
      }
    })
  }


  ////////////////////////////
  // Filter bar
  ////////////////////////////

  handleStaticFilter = (event) => {
    let staticFilteredList = this.state.data;
    let dropdownTarget = document.getElementById('filter-static-dropdown');
    let eventValue = event.target.value;
    let eventLabel = dropdownTarget.options[dropdownTarget.selectedIndex].text;
    console.log(eventValue);
    console.log(eventLabel);
    let filteredList = updateStaticFilter(eventValue, eventLabel, staticFilteredList);
    this.setState({
      filteredData: filteredList,
      selectedStaticFilter: [{"value": eventValue, "label": eventLabel}],
      dynamicFilter: [{"All": ""}],
      dynamicFilterActive: false,
      dynamicFilteredData: [],
      globalFilter: ""
    });
    // Clear dynamic filters:
    let dynamicFilterDropdowns = document.getElementsByClassName("dynamic-filter-dropdowns");
    let dynamicFilterInputs = document.getElementsByClassName("dynamic-filter-inputs");
    for (var i = 0; i < dynamicFilterDropdowns.length; i++) {
      dynamicFilterDropdowns[i].value = "none";
      dynamicFilterInputs[i].value = "";
      dynamicFilterInputs[i].disabled= true;
    }
  }

  handleDynamicDropdown = (event) => {
    let dropdownNumber = parseInt(event.currentTarget.name);
    if (event.target.value === "none") {
      document.getElementById("filter-dynamic-input-" + dropdownNumber).disabled = true;
    } else {
      document.getElementById("filter-dynamic-input-" + dropdownNumber).disabled = false;
    }
    document.getElementById("filter-dynamic-input-" + dropdownNumber).value = "";
    this.setState({
      dynamicFilter: [{"All": ""}],
      dynamicFilterActive: false,
      dynamicFilteredData: [],
      globalFilter: ""
    });
  }

  handleDynamicFilter = (event) => {
    let eventNumber = parseInt(event.target.name);
    let dropdownTarget = document.getElementById('filter-dynamic-dropdown-' + eventNumber);
    let eventValue = dropdownTarget.value;
    let eventLabel = event.target.value;
    let filteredValues = this.state.dynamicFilter;
    typeof filteredValues[eventNumber] === 'undefined' ? filteredValues.push({[eventValue]: eventLabel}) : filteredValues[eventNumber] = {[eventValue]: eventLabel};
    let filteredList = updateDynamicFilter(filteredValues, this.state.filteredData);
    this.setState({
      dynamicFilter: filteredValues,
      dynamicFilteredData: filteredList,
      globalFilter: ""
    });
    if (eventLabel !== "") {
      this.setState({
        dynamicFilterActive: true
      });
    } else {
      // Logic for empty values in dynamic search field - will need to change once the ability to add multiple dynamic fields is made
      filteredValues = filteredValues.splice(eventNumber, 1);
      this.setState({
        dynamicFilterActive: false,
        dynamicFilter: filteredValues
      });
    }
  }

  handleGlobalSearch = (event) => {
    let globalSearchTerm = event.target.value;
    let globalSearchList = this.state.dynamicFilterActive ? this.state.dynamicFilteredData : this.state.filteredData;
    let filteredList;
    if (globalSearchTerm === "") {
      filteredList = updateDynamicFilter(this.state.dynamicFilter, this.state.filteredData);
    } else {
      filteredList = updateGlobalSearch(globalSearchTerm, globalSearchList);
    }
    let uniqueSet = new Set(filteredList);
    let deDupedList = [...uniqueSet];
    this.setState({
      globalFilter: globalSearchTerm,
      dynamicFilteredData: deDupedList
    });
  }

  ////////////////////////////
  // Add/Edit User
  ////////////////////////////

  handleAddUser = (event) => {
    console.log("It's working!! It's working!!!!")
    // Open the modal
    let addUserModal = document.getElementById("add-new-user-modal");
    addUserModal.style.display = "block";
  }

  handleExitModal = (event) => {
    console.log("get outta here!!!")
    // Close the modal
    let addUserModal = document.getElementById("add-new-user-modal");
    addUserModal.style.display = "none";
  }

  ////////////////////////////
  // Render app
  ////////////////////////////
  render() {
    let listData;
    if (this.state.dynamicFilterActive || this.state.globalFilter !== "") {
      listData = this.state.dynamicFilteredData;
    } else {
      listData = this.state.filteredData
    }
  let list = listData.map((d) => <li key={d.id}><span className="list-item-left">{d.full_name}</span> | <span>{d.email_address}, {d.diagnosis} - {d.user_address}, {d.user_city}, {d.user_state} {d.user_zip} - Assigned to {d.owner} </span><button id={d.id} onClick={this.handleEdit}>Edit</button> <button id={d.id} onClick={() => { if (window.confirm(`Are you sure you wish to delete ${d.full_name}?`)) this.handleDelete(d.id) } }>Delete</button></li>);
    if (this.state.editing === true) {
      return (
        <div className="container">
          <h1>I am the walrus</h1>
          <p>{list.length} results</p>
          <ul>
            {list}
          </ul>
          <div id="edit-user-modal" className="modal"> 
            <h2>Edit user</h2>
            <form className="edit-user-form" onSubmit={this.handleEditSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={this.state.editUser.name} onChange={this.handleEditChange} />
              </label>
              <label>
                Email:
                <input type="text" name="email" value={this.state.editUser.email} onChange={this.handleEditChange} />
              </label>
              <label>
                Phone:
                <input type="text" name="phone" value={this.state.editUser.phone} onChange={this.handleEditChange} />
              </label>
              <label>
                Diagnosis:
                <input type="text" name="diagnosis" value={this.state.editUser.diagnosis} onChange={this.handleEditChange} />
              </label>
              <input type="submit" value="Submit" />
              <button onClick={this.handleClearForm}>Clear</button>
              <button onClick={this.handleArchive}>Archive</button>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <h1>I am the walrus</h1>
          <p>{list.length} results</p>
          <div className="filter-bar">
            <div>
              <select id="filter-static-dropdown" onChange={this.handleStaticFilter}>
                <option key="0" value="">All Working Leads</option>
                <option key="1" value="owner" label="Assigned to Jenna">Jenna</option>
                <option key="2" value="owner" label="Assigned to Carl">Carl</option>
                <option key="3" value="diagnosis" label="All Meso Leads">Mesothelioma</option>
                <option key="4" value="status" label="All Working Meso Cases">Working</option>
                <option key="5" value="status" label="Unreached Meso Leads">Unreached</option>
                <option key="6" value="status" label="All Signed Cases">Signed</option>
              </select>
            </div>
            <div>
              <label>Dynamic Filter: &nbsp;&nbsp; </label>
              <select id="filter-dynamic-dropdown-1" className="dynamic-filter-dropdowns" onChange={this.handleDynamicDropdown} name="1">
                <option key="0" value="none">None</option>
                <option key="1" value="diagnosis">Diagnosis</option>
                <option key="2" value="stage">Stage</option>
                <option key="3" value="status">Status</option>
                <option key="4" value="owner">Owner</option>
              </select>
              &nbsp;&nbsp;
              <input id="filter-dynamic-input-1" className="dynamic-filter-inputs" disabled type="text" onChange={this.handleDynamicFilter} name="1"/>
            </div>
            <div>
              <label>Gloabl Search: &nbsp;&nbsp; </label>
              <input type="text" onChange={this.handleGlobalSearch} value={this.state.globalFilter}/>
            </div>
          </div>
          <ul>
            {list}
          </ul>
          <button id="addUserBtn" type="button" onClick={this.handleAddUser}>Add User</button>
          <div id="add-new-user-modal" className="modal"> 
            <form className="add-user-form" onSubmit={this.handleSubmit}>
              <h2>Add a user</h2>
              <label>
                Name:
                <input type="text" name="name" value={this.state.formValue.name} onChange={this.handleChange} />
              </label>
              <label>
                Email:
                <input type="text" name="email" value={this.state.formValue.email} onChange={this.handleChange} />
              </label>
              <label>
                Phone:
                <input type="text" name="phone" value={this.state.formValue.phone} onChange={this.handleChange} />
              </label>
              <label>
                Diagnosis:
                <input type="text" name="diagnosis" value={this.state.formValue.diagnosis} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
              <button id="closeModalBtn" className="close" type="button" onClick={this.handleExitModal}>&times;</button>
            </form>
          </div>
        </div>
      );
    }
  }
}

////////////////////////////
// End render app
////////////////////////////

export default Main;
