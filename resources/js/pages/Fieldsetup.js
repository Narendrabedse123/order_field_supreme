import React, { useState, useEffect,lazy  } from 'react';

//import { connect } from 'react-redux';
import Http from '../Http';
//import {CopyToClipboard} from 'react-copy-to-clipboard';
import Nav from 'react-bootstrap/Nav'
import { BrowserRouter as Router, Route, Link,useHistory, Switch, browserHistory, IndexRoute } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const Header = lazy(() => import("../components/Header"));

function FieldSetup(props) {
 
let shop=props.match.params.shop;
let string = "";
const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;
const [fieldlist, setFieldList] = useState([]);
const [loader, setIsLoaded] = useState([]);
const [error, setError] = useState([]);
const [fieldname, setFieldName] = useState('');
const [fieldVal, setFieldVal] = useState("text");
const [active, setActive] = useState(0);
const [success, setSuccess] = useState(null);
const [successError, setSuccessError] = useState(null);
const [fieldNotNull, setFieldNotNull] = useState(null);
const [liquidfileNotAvail, setLiquidFileNotFound] = useState(null);
const [snippetCode, setSnippetCode] = useState(false);
const [statecopied, setStateCopied] = useState({
  value: '',
  copied: false,
});



const [successdelete, setSuccessDelete] = useState(null);
const [successupdate, setSuccessUpdate] = useState(null);
const [host, setHost] = useState();
const [isLoading, setIsLoading] = useState(false);
const [scriptnote, setScript] = useState();

const planurl = '/api/getplanurl';
const getFieldList = '/api/getfields';

const getactivefields= '/api/getactivefields';
const deleteField= '/api/deletefield';
const saveField  = '/api/savefield';
const saveUpdatedScript= '/api/getorders';
const enabledfield= '/api/enabledfield';
const getshopifyScriptCartPageCode= '/api/getorders';
const setupdetailsurl ='/api/setupdetails';
const editfieldrequrl ='/api/editfieldrequrl';



var tbnnav = cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) ? cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) : 'metafield';
let i=1;


const [tabmykey, setmytabKey] = useState(tbnnav);
const [features, setFeatures] = useState([]);
const [fieldToListing, setOrderFieldListingData] = useState([]);
const getplan ='/api/getplan';
const editfieldorderurl = '/api/editfieldorderurl'

function handleOnDragEnd(result) {

  // console.log(result);
  if (!result.destination) return;
  const items = Array.from(fieldToListing);


  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);
  
  //console.log(items)
  
  editfieldorderdrag(items);
  setOrderFieldListingData(items);

}

const editfieldorderdrag = async (allitems) => {


  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${editfieldorderurl}`, {  allitems: allitems,shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {
    setSuccess('Field Order Changed.');
    setupdetails();
        }) 
   
    .catch(() => {
     
      setError('Sorry, ubable to fetch data');

    });
};
var planUrlVar =0;
var fieldToListingVar =0;
var fieldListActiveVar =0;
useEffect(() => {

  getplanURL();

  getFieldsToListing();
  getFieldListActive();
  getaddvisits();

}, []);

const  addvisits = '/api/addvisits';

const getaddvisits = async () => {

  await Http.get('/authenticate/token?shop='+shop);
 
  var millisecondsLoading =planUrlVar+fieldToListingVar+fieldListActiveVar;

             Http.post(addvisits,  { menu: 'field setup', shop: shop,milisecond:millisecondsLoading},{
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


const getplanURL = async()=>
{
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
 
  const config={ headers: { Authorization: `Bearer ${window.sessionToken}`} }
  
  

  Http.post(`${getplan}`, { shop: shop},config)
  .then((response) => {
     const { data } = response;
    
    setFeatures(data)
    // console.log(data)
    var endTime = (new Date()).getTime();
    planUrlVar=parseInt(endTime-startTime)

  })
  .catch(() => {
   
  });

}

const getFieldListActive = async () => {
  var startTime = (new Date()).getTime();

    await Http.get('/authenticate/token?shop='+shop);
    Http.post(`${getactivefields}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {
            
            const { data } = response.data;
        
            var endTime = (new Date()).getTime();
       fieldListActiveVar=parseInt(endTime-startTime)
           // console.log(data)
         }) 
     
    
  };






const getFieldsToListing = async () => {
  var startTime = (new Date()).getTime();

    await Http.get('/authenticate/token?shop='+shop);
    Http.post(`${getFieldList}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {
                  const { data } = response.data;
                  setOrderFieldListingData(data);
                  var endTime = (new Date()).getTime();
       fieldToListingVar=parseInt(endTime-startTime)
          }) 
     
    
    
  };
const handleChangeActiveField = async (e, id) => {
    if (e.target.getAttribute("type") == "checkbox") {
      if (e.target.checked == true) {
        updateActiveFieldValue(1, id);
      } else {
        updateActiveFieldValue(0, id);
      }
    }
  };


  const updateActiveFieldValue = async (active, id) => {
   
   
    await Http.get('/authenticate/token?shop='+shop);
    Http.post(`${enabledfield}`, { shop: shop,status:active,id:id},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {
     
        setSuccessUpdate(response.data.success);
        setSuccess(null);
        setFieldList([]);
        getFieldsToListing();
        getFieldListActive();
        setupdetails()
      })

    
  };

  const deletefieldById = async (id) => {
       await Http.get('/authenticate/token?shop='+shop);
       Http.post(`${deleteField}`, { shop: shop,id:id},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
       .then((response) => {

       setSuccessDelete(response.data.success);
         setSuccess(null);
         setFieldList([]);
         getFieldsToListing();
         getFieldListActive();
         setupdetails();
       })
  };
  
  
  const alertSubmit = (cust_obj_id) =>
  {
    confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
              <h1>Are you sure?</h1>
               <p style={{color:'red'}}>This will remove fields from the cart page and Order List</p>
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                    deletefieldById(cust_obj_id);
                  onClose();
                }}
              >
                Yes, Delete it!
              </button>
            </div>
          );
        }
      });
    
   
   
  }

  const setupdetails = async () => {
    await Http.get('/authenticate/token?shop='+shop);
    Http.post(`${setupdetailsurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
    .then((response) => {
            
          //  console.log("yes");
           
           
    })
  }

  
  const geteditreq = (id, val, para) => {
    if (val == true) {
      val = 1;
    } else {
      val = 0;
    }

    editfieldreq(id, val, para);


  };

  
  const editfieldreq = async (id, val, para) => {
    console.log(id);
    // console.log(val);
   //  console.log(para);
   await Http.get('/authenticate/token?shop='+shop);
   Http.post(`${editfieldrequrl}`, { id: id, value: val, shop: shop },{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
 
     .then((response) => {
     
       setOrderFieldListingData([])
       getFieldsToListing();
       setupdetails();
       getFieldListActive();
      
       setSuccess('Saved');


     })
     .catch(() => {
       setError('Sorry, ubable to fetch data');

     });
 };


return (



<div class="container"  style={{paddingBottom:"50px"}}>
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
            {features.plan_id == 3? <Nav.Item>
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

{/* 
<div className="row justify-content-left" style={{marginLeft:"1px",marginTop:"-12px",marginBottom:"-71px"}}>
        <div className="form-group form-inline text-center"> 
        
        <form onSubmit={handleSubmit} style={{marginLeft:"5px"}}>

        <div
          className="form-group form-inline text-center"
          style={{ display: "inline-flex", paddingTop: "15px" }}
        >
          <label> Field Name   </label>
          <input
            id="addTodo"
            name="fieldname"
            autoComplete="off"
            //defaultValue={fieldname}
            className="form-control "
            style={{ margin: "7px" }}
            placeholder="field name"
            onChange={(e) => setFieldName(e.target.value)}
            required
          />

          <label> Value Type     </label>

          <select className="form-control "   style={{ margin: "7px" }}   value={fieldVal} onChange={(e) => setFieldVal(e.target.value)}  >
            <option value="text">Text</option>
            <option value="Integer">Integer</option>
            <option value="date">Date</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Select/Dropdown</option>
          </select>
          <label> Active </label>
          <input style={{ margin: "7px" }}
            name="checkbox_static"
            id="checkbox_static"
            type="checkbox"
            defaultChecked={active}
            onChange={handleChange}
          />

      
           <button type="submit" style={{ margin: "8px", backgroundColor: "#022866"}}  className="btn btn-primary">Add</button>
        </div>
      </form>
            </div> 

</div> */}


<div className="float-center" style={{ paddingTop: "10px" }}>
              <h4> <strong>Field setup</strong></h4> 
            <div className="float-left" style={{marginTop:"-34px"}}>
              <Link to={`/addnewfield/${shop}`}> <button className="btn btn-dark" style={{background:"rgb(2 40 102)"}} type="button">

                Add New Field  </button> </Link>
            </div>
            </div>
 {/* <h4 className="text-center" style={{paddingTop:"60px"}}> <strong>Field setup</strong></h4>  */}

 {success != null ? (
          <div
            class="alert alert-primary"
            role="alert"
            style={{  marginTop: "23px", textAlign: "center"  }}
          >
            {success}
          </div>
        ) : (
          ""
        )}






{successError != null ? (
          <div
            class="alert alert-warning"
            role="alert"
            style={{  marginTop: "23px",  textAlign: "center"  }}
          >
            {successError}
          </div>
        ) : (
          ""
        )}

{fieldNotNull != null ? (
          <div
            class="alert alert-warning"
            role="alert"
            style={{ marginTop: "23px",  textAlign: "center"  }}
          >
            {fieldNotNull}
          </div>
        ) : (
          ""
        )}



        {successupdate != null ? (
          <div
            class="alert alert-primary"
            role="alert"
            style={{ marginTop: "23px",  textAlign: "center" }}
          >
            {successupdate}
          </div>
        ) : (
          ""
        )}

        {successdelete != null ? (
          <div
            class="alert alert-warning"
            role="alert"
            style={{ marginTop: "23px", textAlign: "center" }}
          >
            {successdelete}
          </div>
        ) : (
          ""
        )}

 <div style={{paddingTop:"0px"}} className="table-responsive">
 <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>    
             <table className="table table-bordered table-striped table-highlight">
               <tbody>
                 <tr>

                           <th className="text-center" style={{width:"15%"}}>Field Name</th>
                           <th className="text-center"  style={{width:"15%"}}>Field Type</th>
                           <th className="text-center"   style={{width:"15%"}}>Enable</th>
                           {features.plan_id == 1? "": <th className="text-center"   style={{width:"15%"}}>Required</th>}
                          
                          
                           <th  className="text-center"   style={{width:"15%"}}>Field Display Order</th>
                           <th className="text-center" style={{width:"15%"}}>Delete</th>


                 </tr>
                 {fieldToListing.map((todo,index) => (
     <Draggable key={todo.fieldsname} draggableId={todo.fieldsname} index={index++} >
     {(provided) => (


                   <tr key={todo.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                 
               
                        <td className="text-center"> {todo.fieldsname.split("_").join(" ")}</td>
                        <td className="text-center"> {todo.field_type}</td>
                        <td className="text-center">
                          <input
                            name="checkbox"
                            id="products"
                            type="checkbox"
                            defaultChecked={todo.active}
                            onChange={(e) =>
                              handleChangeActiveField(e, todo.id)
                            }
                          />
                        </td>
                        {features.plan_id == 1? "":   <td>
                                      <input name={todo.id} type="checkbox" checked={todo.required == 1 ? true : false} onChange={(e) => geteditreq(todo.id, e.target.checked, 'required')} />
                            </td>}
                        <td>
                        {/* {todo.field_order == 0 && (
                                        <span> {i++} </span>
                                      )}
                                       */}
                                   <span> {i++} </span>       
                                      </td>


                        <td className="text-center">
                          <button
                            style={{ backgroundColor: "#022866" }}
                            className="btn btn-primary"
                            onClick={()=>alertSubmit(todo.id)}
                          >
                            Delete
                          </button>
                        </td>
                     
                    
                     </tr>
                     
                     )}

                     </Draggable>
                 ))}
               </tbody>
             </table>
             </div>
                  )}
                </Droppable>
              </DragDropContext>

           </div>



  </div>
);


}



export default FieldSetup;


