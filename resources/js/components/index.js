import React, { useState, useEffect  } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Http from '../Http';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import { BrowserRouter as Router, Route, Link,Switch , browserHistory, IndexRoute} from 'react-router-dom';
import Addproduct from '../pages/Addproduct';


function Index(props) {

    const [Products, setProductsData] = useState([]);
    const [Producttemp, setProducttemp] = useState([]);
    
    const [picture, setPicture] = useState("");
    const [Regs, setRegData] = useState([]);
    const [Customers, setCustomersData] = useState([]);
    const [Setting, setSettingsData] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [csvfile, setCsvfile] = useState(null);
    const producturl  = '/api/getsavedproducts';
    const customerurl  = '/api/getsavedcustomers';
    const regurl  = '/api/getregistrations';
    const regseturl  = '/api/setproductregistrations';
    const uploadcsv  = '/api/uploadcsv';
    useEffect(() => {
      getProductData();
      getRegisteredData();
     
    }, []);
  
    const importCSV = e =>{
     
      addTodo(picture);
    };
    
    const updateData = async (result) => {
      var data = result.data;
      console.log(data);
    };
    
    const gotoaddproduct = ()=>{
        console.log(props);

    };

    const handleChange = e =>{
      // console.log(e.target.checked);
      e.preventDefault(); 
      if(e.target.name == "file")
      {
        setPicture(e.target.files[0])
          setProducttemp(URL.createObjectURL(e.target.files[0]))
      } else {
        if(e.target.checked == true )
        {
          e.preventDefault(); 
          setReg(e.target.name,1);
        }
        else
        {
         
          setReg(e.target.name,0);
        }
      }
         
         return false;
       };
  
  
       const addTodo = async (picture) => {
         
        const data = new FormData() 
        
        data.append('file', picture)
       
        Http.post(uploadcsv, data , { 
           
        })
          .then(({ res }) => {
           
            setSuccess('Products uploaded successfully.');
            getProductData();
      
        
          })
          .catch(() => {
  
            setError('Sorry, there was an error saving Product.');
            
          });
  
      };
      
  
       const setReg = async (product_id,reg) => {
    
        Http.post(regseturl, { product_id: product_id,registration:reg })
          .then(({ data }) => {
           
           if(data.registration == '1')
           {
            setSuccess('Product is available for registrations.');
           }else{
            setSuccess('Product is removed for registrations.');
           }
            getProductData();
            // this.todoForm.reset();
          })
          .catch(() => {
    
            setError('Sorry, there was an error saving .');
            
          });
    
      };
      
   
    const getProductData = async () => {
   
      Http.get(`${producturl}`)
      .then((response) => {
        //console.log(response.data);
        const { data } = response.data;
        setProductsData(data);
        
      })
      .catch(() => {
          setError('Sorry, ubable to fetch data');
    
      });
  };
  
  const getCustomersData = async () => {
   
    Http.get(`${customerurl}`)
    .then((response) => {
      //console.log(response.data);
      const { data } = response.data;
      setCustomersData(data);
      
    })
    .catch(() => {
        setError('Sorry, ubable to fetch data');
  
    });
  };
  
  const getRegisteredData = async () => {
   
    Http.get(`${regurl}`)
    .then((response) => {
      //console.log(response.data);
      const { data } = response.data;
      setRegData(data);
      
    })
    .catch(() => {
        setError('Sorry, ubable to fetch data');
  
    });
  };
  
  
  return (
    <div className="container py-15">
      <div className="add-todos mb-5">
        <h3 className="text-center mb-4">Welcome to Product Registration App</h3>

        
        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
        <Tab eventKey="home" title="Registrations" label="Registrations">
      
        <table className="table table-striped">
          <tbody>
            <tr>
            <th>No.</th>
            <th>Name</th>
              <th>Contact Details</th>
              <th>Address</th>
              <th>Product </th>
              <th>Purchase Date </th>
              <th>Proof</th>
              <th>Created at</th>
              <th>Status</th>
            </tr>
            {Regs.map((reg) => (
              
              <tr key={reg.id}>
                <td><Router><Link to= {`/showreg/${reg.id}`}>{reg.id}</Link></Router> </td>
                <td>{reg.first_name} {reg.last_name}</td>
                <td>{reg.email} / {reg.phone}</td>
                <td>{reg.address1} ,{reg.address2} ,{reg.city} ,{reg.state}, {reg.zip}</td>
                <td>{reg.product}</td>
                <td>{reg.purchase_date}</td>
                <td><a href={`/uploads/proof/${reg.proof}`} target="_blank"> {reg.proof}</a>
                 </td>
                <td>{reg.created_at} </td>
                <td>{reg.status} </td>
              </tr>
            ))} 
          </tbody>
        </table>
        </Tab>
        <Tab eventKey="products" title="Products" label="Products">
        

       <Router>
        <Link to="/addproduct">Add Product</Link>
        </Router>
        <h5>Import CSV File!  
        <Router>
            <Link to="/uploads/testcsv.csv" target="_blank" download> Click here to sample csv</Link>
            </Router>
            </h5>
        <div className="App">
      
      <input
        className="csv-input"
        type="file"
        name="file"
        placeholder={null}
        onChange={handleChange}
      />
     
      <button onClick={importCSV}> Upload now!</button>
    </div>
        {error && (
        <div className="alert alert-warning" role="alert">
         

          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-primary" role="alert">
          {success}
        </div>
      )}

        <table className="table table-striped">
          <tbody>
            <tr>
              
            <th>Name</th>
              <th>Image</th>
              <th>Registration</th>
             
            </tr>
            {Products.map((todo) => (
              
              <tr key={todo.product_id}>
               
                <td>{todo.name}</td>
                <td><img  className="thubnail" src={todo.image}></img></td>
                <td><input name={todo.product_id} type="checkbox" checked={todo.registration == 1 ? true : false} className="form-control" onChange={handleChange} /></td>
               
              </tr>
            ))} 
          </tbody>
        </table>
        </Tab>
        
      </Tabs>
      
      </div>
    </div>

        
   
  );
}



export default Index;

if (document.getElementById('index')) {
    ReactDOM.render(<Index />, document.getElementById('index'));
}



