import React, { useState, useEffect,lazy  } from 'react';

//import { connect } from 'react-redux';
import Http from '../Http';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Nav from 'react-bootstrap/Nav'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt,faCopy } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
//import { includes } from 'lodash';
const Header = lazy(() => import("../components/Header"));

function PageSetup(props) {
 
let shop=props.match.params.shop;
const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;
let string = "";
const [isActive, setisActive] = useState(true);


const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);
const [successlang, setSuccesslang] = useState(null);
 
const [statecopied, setStateCopied] = useState({
  value: '',
  copied: '',
});


const ordersurl = '/api/getorders';
const planurl = '/api/getplanurl';
const getFieldList = '/api/getfields';


var tbnnav = cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) ? cookies.get('tabkeymainmenu',{path: '/', sameSite: 'none', secure: true}) : 'metafield';


const [tabmykey, setmytabKey] = useState(tbnnav);
const [features, setFeatures] = useState([]);
const [fieldToListing, setOrderFieldListingData] = useState([]);
const getactivefields= '/api/getactivefields';
const getcartlayout ='/api/getcartlayout';
const setupdetailsurl ='/api/setupdetails';
const [scriptnote, setScript] = useState();
const [cssSetup, setCSSSetup] = useState([]);
const [color, setColor] = useState('');
const [bgcolor, setbgColor] = useState('');
const [font, setfont] = useState('');

const getplan ='/api/getplan';
const  addvisits = '/api/addvisits';

var setup =0;
var planUrl=0;
var cartLayoutUrl = 0;
useEffect(() => {

  setupdetails();

  getCartlayout();
  //getFieldListActive();
   getplanURL()
  getaddvisits();

}, []);


const getaddvisits = async () => {

  await Http.get('/authenticate/token?shop='+shop);
  var millisecondsLoading = cartLayoutUrl+setup+planUrl;

             Http.post(addvisits,  { menu: 'page setup', shop: shop,milisecond:millisecondsLoading  },{
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
  
  
// console.log(config)

  Http.post(`${getplan}`, { shop: shop},config)
  .then((response) => {
     const { data } = response;
    
    setFeatures(data)
  //   console.log(data)

  var endTime = (new Date()).getTime();
  planUrl=parseInt(endTime-startTime)
  })
  .catch(() => {
   
  });

}

const getCartlayout = async () => {
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${getcartlayout}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {
          
          const { data } = response.data;
         
          //setCSSSetup(data)
          setColor(data.color)
          setbgColor(data.bgcolor)
          setfont(data.font)
          var endTime = (new Date()).getTime();
    cartLayoutUrl=parseInt(endTime-startTime)
  })
}

const setupdetails = async () => {
  var startTime = (new Date()).getTime();

  await Http.get('/authenticate/token?shop='+shop);
  Http.post(`${setupdetailsurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {
          
        //  console.log("yes");
        var endTime = (new Date()).getTime();
    setup=parseInt(endTime-startTime) 
         
  })
}

const getFieldListActive = async () => {
  await Http.get('/authenticate/token?shop='+shop);



  Http.post(`${getactivefields}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
  .then((response) => {
          
          const { data } = response.data;

         

          data.map((todo) => {

            if(todo.field_type == 'text')
            {
            let scriptDynamic = `
            <p class="cart-attribute__field">
            <label style="width: 110px;display:inline-block" for="${todo.fieldsname}">${todo.fieldsname}</label>
            <input  style="margin-left: 60px;"  id="${todo.fieldsname.split(" ").join("_")}" type="${
              todo.field_type
            }" maxlength="100" name="attributes[${todo.fieldsname
              .split(" ")
              .join("_")}]" value="{{ cart.attributes["${todo.fieldsname
              .split(" ")
              .join("_")}"] }}">
          </p>`;
  
            string += scriptDynamic;
              }
              else{
                let scriptDynamic = `
                <p class="cart-attribute__field">
                <label style="width: 110px;display:inline-block" for="${todo.fieldsname}">${todo.fieldsname}</label>
                <input style="margin-left: 60px;" id="${todo.fieldsname.split(" ").join("_")}" type="${
                  todo.field_type
                }" name="attributes[${todo.fieldsname
                  .split(" ")
                  .join("_")}]" value="{{ cart.attributes["${todo.fieldsname
                  .split(" ")
                  .join("_")}"] }}">
              </p>`;
      
                string += scriptDynamic;
  
              }
  
  
          });
          //  setScript(string);
         // console.log(string)
          setScript("<div class='cart-fields' style='float:left;padding: 4%; font-style: "+cssSetup.font+";color: "+cssSetup.color+";background:"+cssSetup.bgcolor+"'>"+string+"</div>")
       }) 
   
  
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
            <Nav.Link className="" href={`/fieldsetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCogs} /> Field Setup</span>}</Nav.Link>
            </Nav.Item>
           
            <Nav.Item>
            <Nav.Link className="" href={`/cartlayout/${shop}`}>{<span> <FontAwesomeIcon icon={faFile} /> Cart Layout</span>}</Nav.Link>
            </Nav.Item>
            {features.plan_id == 3?<Nav.Item>
            <Nav.Link className="" href={`/showtranslation/${shop}`}>{<span> <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} /> Field Translation</span>}</Nav.Link>
            </Nav.Item>:""}
            <Nav.Item>
            <Nav.Link className="btn btn-primary btn-sm" href={`/pagesetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCode} /> Page Script</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
            <Nav.Link className="" href={`/help/${shop}`}>{<span> <FontAwesomeIcon icon={faHandsHelping} /> Help</span>}</Nav.Link>
            </Nav.Item>
            <Nav.Item className="ml-auto">
            <Nav.Link href={`/plan/${shop}`} className="">{ <span> <FontAwesomeIcon icon={faList}  /> Plans </span>}</Nav.Link>
            </Nav.Item>
            </Nav>
 

            <h4 style={{paddingTop:"15px"}}> <strong>Page Script</strong></h4> 


<div class="main-body">
       
  
        <main id="main-doc">


        <section class="main-section" id="Intro" style={{paddingTop:'40px'}}> 
            
            
           
            
            {/* <header style={{display:'block',textAlign:'left'}}>
            Create a file orderfield.liquid under snippets folder , and copy paste below code
                </header>
                <code style={{color:'black'}}>
                   {scriptnote} 
               
                <CopyToClipboard text={scriptnote}
         onCopy={() => setStateCopied({copied:121})}>
           <span> {statecopied.copied ==121 ? <span  style={{color: 'rgb(12 218 9 / 1)',float:'right'}}>Copied</span> : <a> <FontAwesomeIcon style={{float:'right'}} icon={faCopy} /></a>}</span>
         </CopyToClipboard>

         </code> */}

         <header style={{display:'block',textAlign:'left'}}>
         Copy the following code snippet from below and paste it above the {'</form>'} section on the cart template.
            </header>
                <code style={{color:'black'}}>
                 {" {% include 'orderfield' %} "}


                 <CopyToClipboard text={`{% include 'orderfield' %} `}
         onCopy={() => setStateCopied({copied:110})}>
           <span> {statecopied.copied == 110 ? <span  style={{color: 'rgb(12 218 9 / 1)',float:'right'}}>Copied</span> : <a> <FontAwesomeIcon style={{float:'right'}} icon={faCopy} /></a>}</span>
         </CopyToClipboard>


                </code>
                <header style={{display:'block',textAlign:'left',paddingTop:"15px"}}>
                Please contact <a class="text-center " target="_top" style={{color:'rgb(2 40 102)'}} href=" mailto:support@arcafy.com"> support@arcafy.com </a> if custom fields do not appear by default or you prefer not editing the code to add above script. Watch the following video on how to do edit the code
            </header>

            <iframe style={{paddingTop:"10px"}} width="560" height="315" src="https://www.youtube.com/embed/I0m9qmENhHM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

            </section> 
            
            </main>
    </div>
               
               
               
  
           
       


    </div>



  </div>
);


}



export default PageSetup;


