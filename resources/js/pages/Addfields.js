import React, { useState, useEffect,lazy } from 'react';


import { connect } from 'react-redux';
import Http from '../Http';
//import {CopyToClipboard} from 'react-copy-to-clipboard';
import Nav from 'react-bootstrap/Nav'
import { BrowserRouter as Router, Route, Link,useHistory, Switch, browserHistory, IndexRoute } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faFileCode,  faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt } from '@fortawesome/free-solid-svg-icons'
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
//import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
const Header = lazy(() => import("../components/Header"));


function Addfield(props) {
  const history = useHistory();
  let shop=props.match.params.shop;
  const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
  let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;
  const [fieldname, setFieldname] = useState("");
  const [fieldtype, settype] = useState("text");
  const [dropvalues, setdropvalues] = useState(null);
  const [radiovalues, setRadiovalues] = useState(null);

  const [req, setRegData] = useState("");
  const [enb, setEnbData] = useState("");
  const [StoreData, setTodo] = useState();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [Selectbox, SetSelectbox] = useState(false);
  const [radio, setRadio] = useState(false);

  const [features, setFeatures] = useState([]);

  var initial = {
   
    fieldtype: "text",
    fieldname: "",
    dropvalues: "",
    enb: 1,
  }

  const addfield = '/api/addfield';
  const saveField  = '/api/savefield';
  const setupdetailsurl ='/api/setupdetails';
  const getplan ='/api/getplan';
  var planUrl=0;
  useEffect(() => {

    setTodo(initial)
    setRegData(1)
    setEnbData(1)
    getplanURL()
    getaddvisits();

  }, []);


  
  const  addvisits = '/api/addvisits';

  const getaddvisits = async () => {
  
      await Http.get('/authenticate/token?shop='+shop);
    
      var millisecondsLoading = planUrl;
                 Http.post(addvisits,  { menu: 'add fields', shop: shop,milisecond:millisecondsLoading  },{
                   headers: { Authorization: `Bearer ${window.sessionToken}` }
               })
               .then((response) => {
                 // getFieldData();
                 // setisActive(true);
                 // setSuccess('Field Order Changed.');
    
    
               })
               .catch(() => {
                 setError('Sorry, ubable to fetch data');
    
               });
    }
  const handleChange = e => {


    if (e.target.name == 'required') {

      if (e.target.checked == true) {
        setRegData(1);
      }
      else {
        setRegData(0);
      }
    } else if (e.target.name == 'enabled') {

      if (e.target.checked == true) {
        setEnbData(1);
      }
      else {
        setEnbData(0);
      }
    }


    else {
      if (e.target.value == "select") {
        SetSelectbox(true)
        setRadio(false)
      }
      else if (e.target.value == "radio") {
          setRadio(true)
          SetSelectbox(false)
        }
        else{
          SetSelectbox(false)
          setRadio(false)
        }

      }
      
      settype(e.target.value)
    

  };

  const handleSubmit = e => {

    e.preventDefault();
    addTodo(fieldname, fieldtype, enb, dropvalues,radiovalues);
    e.target.reset();

  };

  const getplanURL = async()=>
  {
    var startTime = (new Date()).getTime();

    await Http.get('/authenticate/token?shop='+shop);
   
    const config={ headers: { Authorization: `Bearer ${window.sessionToken}`} }
    
    

    Http.post(`${getplan}`, { shop: shop},config)
    .then((response) => {
       const { data } = response;
      
      setFeatures(data)

      var endTime = (new Date()).getTime();
      planUrl=parseInt(endTime-startTime)
    })
    .catch(() => {
     
    });

  }

  const addTodo = async (fieldname, fieldtype,  enb, dropvalues,radiovalues) => {


//console.log(fieldname, fieldtype,  enb, dropvalues)


await Http.get('/authenticate/token?shop='+shop);
   
const config={ headers: { Authorization: `Bearer ${window.sessionToken}`} }
var data1 = null;
if(fieldtype == 'select')
{
          data1 = {
            fieldtype:fieldtype,
            fieldname:fieldname,
            enb:enb,
            dropvalues:dropvalues,
            shop:shop
        }
        SetSelectbox(false)
}
else if(fieldtype == 'radio')
{
          data1 = {
            fieldtype:fieldtype,
            fieldname:fieldname,
            enb:enb,
            dropvalues:radiovalues,
            shop:shop
        }
        setRadio(false)
}
else{

     data1 = {
        fieldtype:fieldtype,
        fieldname:fieldname,
        enb:enb,
       
        shop:shop
    }
} 
 // console.log(data1)
    Http.post(`${saveField}`, data1,config)
    .then((response) => {
            
     
         setFieldname("");
         settype("text");
         setdropvalues(null);
          //setSuccess('Field added successfully.');
          setSuccess( response.data.success);
          setError( response.data.error);
          setupdetails();
    })
   
      .catch(() => {

        setError('Sorry, there was an error .');

      });

  };
  const setupdetails = async () => {
    await Http.get('/authenticate/token?shop='+shop);
    Http.post(`${setupdetailsurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {
            
          //  console.log("yes");
           
           
    })
  }

  return (
    <div className="container ">
      <div className="add-todos mb-10">
      <Header/>




      <div className="mynav"> 
      <Nav className="container-fluid"> 
            <Nav.Item>
            <Nav.Link className="" href={home_url} target="_parent">{<span> <FontAwesomeIcon icon={faTag} /> Orders</span>}</Nav.Link>
            </Nav.Item>
        
            <Nav.Item>
            <Nav.Link className="btn btn-primary btn-sm" href={`/fieldsetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCogs} /> Field Setup</span>}</Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
            <Nav.Link className="" href={`/cartlayout/${shop}`}>{<span> <FontAwesomeIcon icon={faFile} /> Cart Layout</span>}</Nav.Link>
            </Nav.Item>
           {features.plan_id == 3 ? <Nav.Item>
            <Nav.Link className="" href={`/showtranslation/${shop}`}>{<span> <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} /> Field Translation</span>}</Nav.Link>
            </Nav.Item>:""}
            <Nav.Item>
            <Nav.Link className="" href={`/pagesetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCode} /> Page Script</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link className="" href={`/help/${shop}`}>{<span> <FontAwesomeIcon icon={faHandsHelping} /> Help</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="ml-auto">
            <Nav.Link href={`/plan/${shop}`} className="">{ <span> <FontAwesomeIcon icon={faList}  /> Plans </span>}</Nav.Link>
            </Nav.Item>
            </Nav>
 </div>






        <div className="text-left" style={{paddingTop:"15px"}}>
          <h5  >
          <Link to={`/fieldsetup/${shop}`} style={{background:"#022866"}} className="btn btn-dark"> Back </Link>
            {/* <button className="btn btn-dark" href="#" style={{background:"#022866"}}   onClick={() => {
              history.goBack();
            }}>Back</button > */}

            <strong style={{ paddingLeft: "375px" }}> Add New Field</strong></h5>
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
        <div className="row justify-content-left" style={{paddingTop:"30px"}}>
          <form
            method="post"
            onSubmit={handleSubmit}
            style={{ marginLeft: "100px" }}
          >
            <div className="form-group form-inline text-center">


              <label >
                <strong> Field Name*&nbsp;&nbsp;&nbsp;</strong> </label>

              <input
                id="addTodo"
                name="fieldname"
                maxlength="100"
                className="form-control "
                style={{ marginLeft: "60px" }}
                placeholder="Field Name"
                onChange={e => setFieldname(e.target.value)}
                required
              />



            </div>



            <div className="form-group form-inline text-center">

              <label >
                <strong> Field Type *&nbsp;&nbsp;&nbsp;</strong></label>

              <select name="fieldtype" onChange={handleChange} style={{ marginLeft: "63px" }} className="form-control mr-3" required>
                   
                   {features.plan_id == 1 ? <>
                   <option value="text">Text</option>
                   </>:""}
                   {features.plan_id == 2 || features.plan_id == 3 ? 
                      <>
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="Integer">Integer</option>
                    <option value="date">Date</option>
                    <option value="radio">Radio</option>

                    <option value="checkbox">Checkbox</option>
                    <option value="select">Select/Dropdown</option></>:""}
               

              </select>
              {radio && (
                <div className="form-group form-inline text-center">


                  <label >
                    <strong> Add Comma Seprated Values for Radio *&nbsp;&nbsp;&nbsp;</strong> </label>

                  <input
                    id="addTodo"
                    name="radio"

                    className="form-control "
                    style={{ marginLeft: "60px" }}
                    placeholder="Value1,Value2,Value3"
                    onChange={e => setRadiovalues(e.target.value)}
                    required
                  />



                </div>
              )}


              {Selectbox && (
                <div className="form-group form-inline text-center">


                  <label >
                    <strong> Add Comma Seprated Values for Dropdown *&nbsp;&nbsp;&nbsp;</strong> </label>

                  <input
                    id="addTodo"
                    name="dropvalues"

                    className="form-control"
                    style={{ marginLeft: "60px" }}
                    placeholder="Value1,Value2,Value3"
                    onChange={e => setdropvalues(e.target.value)}
                    required
                  />



                </div>
              )}


            </div>
           

            <div className="form-group form-inline text-center">
              <label > <strong>  Select For Enabled &nbsp;&nbsp;&nbsp;</strong>
                <input
                  name="enabled"
                  type="checkbox"
                  defaultChecked="1"
                  style={{ marginLeft: "65px" }}
                  className="form-control mr-3"
                  onChange={handleChange} />
              </label>
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-dark text-center" style={{  backgroundColor: "#022866"}}><strong>Submit </strong>

              </button>
            </div>

          </form>
        </div>
      </div>



    </div>
  );


}
const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});
export default connect(mapStateToProps)(Addfield);

