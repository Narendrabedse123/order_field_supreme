import React, { useState, useEffect,lazy } from 'react';
//import { Link } from 'react-router-dom';
//import { connect } from 'react-redux';
import Http from '../Http';
import Nav from 'react-bootstrap/Nav'
//import Dashboard from '../pages/Dashboard';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCode,faHandsHelping,faFileImport,faCogs ,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import  { Redirect,useHistory  } from 'react-router-dom'
const Header = lazy(() => import("../components/Header"));


import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
function Plan(props) {
  
  let history = useHistory();
  const [features, setFeatures] = useState([]);
  //const [shop, setShop] = useState('');
  const [plan_id, setplanID] = useState('');
  const planurl = '/api/getplandetails';
  const setplanurl = '/api/setplanurl';
  var tbnnav = cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) ? cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) : 'metafield';
  const appurl = process.env.MIX_REACT_APP_URL_HANDLE;

 
  var tbnnav = cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) ? cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) : 'metafield';
  const [tabmykey, setmytabKey] = useState('plan');

  let shop=props.match.params.shop;
    let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;
    //   var ref = document.referrer;
    //   var refr = ref.split("&token=");
    //   var token = refr[1];
    //  var shopurl= refr[0].split("/?host=");
    //  let base64ToString = Buffer.from(shopurl[1], "base64").toString();
  
    //  var shopfinal = base64ToString.split("/admin");
    //  var shop = shopfinal[0];
    var planUrl=0;
  useEffect(() => {

    //getplanfeature();

    getplanURL()
    getaddvisits();
   
  }, []);

  const  addvisits = '/api/addvisits';

  

const getaddvisits = async () => {

  await Http.get('/authenticate/token?shop='+shop);
  var millisecondsLoading = planUrl;

             Http.post(addvisits,  { menu: 'plan', shop: shop,milisecond:millisecondsLoading  },{
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


  const timedelay = (ms) =>
  new Promise((res) => {
    setTimeout(() => {
      res()
    }, ms)
  })
  const getplanURL = async()=>
  {
    var startTime = (new Date()).getTime();

    await Http.get('/authenticate/token?shop='+shop);
    await timedelay(2000);
    //await Http.get('/authenticate/token');

    // let shop=cookies.get('shop',{path: '/', sameSite: 'none', secure: true});
    // setShop(shop);
   

    Http.post(`${planurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}` }
   })
    .then((response) => {
       
       const { data } = response.data;

     //  console.log(response)
      // setFeatures(response);
       setplanID(response.data.plan_id);
       var endTime = (new Date()).getTime();
    planUrl=parseInt(endTime-startTime)
    })
    .catch(() => {
     
    });

  }

  const delay = (ms) =>
  new Promise((res) => {
    setTimeout(() => {
      res()
    }, ms)
  })
  
  const changeplan = async(id)=>
  {
    Redirect("https://"+shop+"/admin/apps/arcafy-metafield-local-1/billing/"+id);
  }

  const redirectplan = async(id)=>
  {
   // console.log("https://"+shop+"/admin/apps/"+appurl+"/billing/"+id)
    const url=("https://"+shop+"/admin/apps/"+appurl+"/billing/"+id);
    window.open(url, '_parent');

  }


 
  const alertSubmit = (id) =>
  {
    confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
              <h1>Are you sure?</h1>
               <p style={{color:'red'}}>This will delete additional fields and translations</p>
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  redirectplan(id);
                  onClose();
                }}
              >
                Order Now!
              </button>
            </div>
          );
        }
      });
    
   
   
  }





//console.log(plan_id);
  return (
   
     
    <div className="container py-15">
    <div className="add-todos mb-5">
<Header/>

    <div className="mynav"> 
      <Nav className="container-fluid"> 
      <Nav.Item>
            <Nav.Link className="" href={home_url} target="_parent">{<span> <FontAwesomeIcon icon={faTag} /> Orders</span>}</Nav.Link>
            </Nav.Item>
        
            <Nav.Item>
            <Nav.Link className="" href={`/fieldsetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCogs} /> Field Setup</span>}</Nav.Link>
            </Nav.Item>
          
            <Nav.Item>
            <Nav.Link className="" href={`/cartlayout/${shop}`}>{<span> <FontAwesomeIcon icon={faFile} /> Cart Layout</span>}</Nav.Link>
            </Nav.Item>
            {plan_id == 3?<Nav.Item>
            <Nav.Link className="" href={`/showtranslation/${shop}`}>{<span> <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} /> Field Translation</span>}</Nav.Link>
            </Nav.Item>:""}
            <Nav.Item>
            <Nav.Link className="" href={`/pagesetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCode} /> Page Script</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link className="" href={`/help/${shop}`}>{<span> <FontAwesomeIcon icon={faHandsHelping} /> Help</span>}</Nav.Link>
            </Nav.Item>
           <Nav.Item className="ml-auto">
            <Nav.Link href={`/plan/${shop}`} className={tabmykey == "plan" ? "btn btn-primary" : ""} onClick={() => {cookies.set('tabkeymainmenu', 'plan', {path: '/', sameSite: 'none', secure: true});setmytabKey('plan')}}>{ <span> <FontAwesomeIcon icon={faList}  /> Plans </span>}</Nav.Link>
            </Nav.Item>
    
            </Nav>
            </div>








    <div className="container mb-5 mt-5">
    <div className="pricing card-deck flex-column flex-md-row mb-3">
   
        <div className={"card card-pricing " +
        (plan_id == 1 ? "popular shadow " : "") +
        "text-center px-3 mb-4"}>
           
            <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">Basic</span>
            <div className="bg-transparent card-header pt-4 border-0">
            <h1 className="h1 font-weight-normal text-primary text-center mb-0" data-pricing-value="45">$<span className="price">2.99</span><span className="h6 text-muted ml-2">/ per month</span></h1>
            </div>
            <div className="card-body pt-0" style={{padding: "0.25rem"}}>
                <ul className="list-unstyled mb-4" style={{paddingLeft:"0.5"}}>
                 
                    <li>One custom order field</li>
                    <li>Text field type available</li>
                    <li>Field added to the cart page</li>
                    <li>Order list with custom field view for quick review</li>

                    <li style={{color:"rgb(2,40,102)",fontWeight:"bold"}}> 10 Days Free Trial </li>
                    <li>  </li>
                </ul>
                {plan_id == 1 ?(
                <button type="button" style={{backgroundColor:"rgb(255, 233, 65)",color: "rgb(2, 40, 102)"}} className="text-center btn" disabled>Active</button>
                 ) :<>
                 {1 <= plan_id ? 
                 <a onClick={()=>alertSubmit(1)} style={{backgroundColor:"rgb(2,40,102)",color: "#ffffff"}}  className="btn btn-outline-secondary mb-3">Order now</a>
                 :<a target="_parent" href= {"https://"+(shop)+"/admin/apps/"+appurl+"/billing/1"} style={{backgroundColor:"rgb(2,40,102)",color: "#ffffff"}}  className="btn btn-outline-secondary mb-3">Order now</a>
                 }
               </>
               }
            </div>
        </div>
       
        <div className={"card card-pricing " +
        (plan_id == 2 ? "popular shadow " : "") +
        "text-center px-3 mb-4"}>
            <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">Advance</span>
            <div className="bg-transparent card-header pt-4 border-0">
                <h1 className="h1 font-weight-normal text-primary text-center mb-0" data-pricing-value="30">$<span class="price">5.99</span><span class="h6 text-muted ml-2">/ per month</span></h1>
            </div>
            <div className="card-body pt-0" style={{padding: "0.25rem"}}>
                <ul className="list-unstyled mb-4" style={{paddingLeft:"0.5"}}>
                    <li>Up to five custom order fields</li>
                    <li>Text, Date, Textarea, Dropdown selection , checkbox and radio button field types available</li>
                    <li>Field added to the cart page</li>
                    <li>Order list with custom field view for quick review</li>
                    <li>Download 10 latest orders with custom order fields</li>
                    <li>Set the required fields</li>
                    <li style={{color:"rgb(2,40,102)",fontWeight:"bold"}}> 10 Days Free Trial </li>
                    <li>  </li>
                   
                </ul>
                {plan_id == 2 ?(
                <button type="button" style={{backgroundColor:"rgb(255, 233, 65)",color: "rgb(2, 40, 102)"}} className="text-center btn" disabled>Active</button>
                ) :
                <>
                 {2 <= plan_id ? 
                 <a onClick={()=>alertSubmit(2)} style={{backgroundColor:"rgb(2,40,102)",color: "#ffffff"}}  className="btn btn-outline-secondary mb-3">Order now</a>
                 :<a target="_parent" href= {"https://"+(shop)+"/admin/apps/"+appurl+"/billing/2"} style={{backgroundColor:"rgb(2,40,102)",color: "#ffffff"}}  className="btn btn-outline-secondary mb-3">Order now</a>
                 }
               </>
                
          }
            </div>
        </div>
        
        <div className={"card card-pricing " +
        (plan_id == 3 ? "popular shadow " : "") +
        "text-center px-3 mb-4"}>
            <span className="h6 w-60 mx-auto px-4 py-1 rounded-bottom bg-primary text-white shadow-sm">Supreme </span>
            <div className="bg-transparent card-header pt-4 border-0">
                <h1 className="h1 font-weight-normal text-primary text-center mb-0" data-pricing-value="45">$<span className="price">7.99</span><span className="h6 text-muted ml-2">/ per month</span></h1>
            </div>
            <div className="card-body pt-0" style={{padding: "0.25rem"}}>
                <ul className="list-unstyled mb-4" style={{paddingLeft:"0.5"}}>
                <li>Up to ten custom order fields</li>
                <li>Text, Date, Textarea, Dropdown selection , checkbox and radio button field types available</li>
                <li>Multi-language field translation setup available</li>
                <li>Field added to the cart page</li> 
                <li>Order list with custom field view for quick review</li>
                <li>Download all orders with custom order fields</li>
                <li>Set the required fields</li>
                    <li style={{color:"rgb(2,40,102)",fontWeight:"bold"}}> 10 Days Free Trial </li>
                  
                </ul>
                {plan_id == 3 ?(
                <button type="button" style={{fontWeight:"bold",backgroundColor:"rgb(255, 233, 65)",color: "rgb(2, 40, 102)"}} className="text-center btn" disabled>Active</button>
                ) :
                
               <>
                 {3 <= plan_id ? 
                 <a onClick={()=>alertSubmit(3)} style={{backgroundColor:"rgb(2,40,102)",color: "#ffffff"}}  className="btn btn-outline-secondary mb-3">Order now</a>
                 :<a target="_parent" href= {"https://"+(shop)+"/admin/apps/"+appurl+"/billing/3"} style={{backgroundColor:"rgb(2,40,102)",color: "#ffffff"}}  className="btn btn-outline-secondary mb-3">Order now</a>
                 }
               </>  
               
                }
                </div>
        </div>
       
    </div>
    <h5 className="text-center" style={{display:"flex",justifyContent:"center",color:"#022866",alignItems:"center",height:"100px"}}> If you have question contact &nbsp;
         
         <a className="text-center " target="_top" href={" mailto:support@arcafy.com"}> support@arcafy.com </a> </h5>
</div>
   </div>
   </div>
      
   
     
        
   
  );
}





export default Plan;


