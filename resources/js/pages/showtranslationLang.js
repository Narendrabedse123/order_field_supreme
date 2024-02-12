import React, { useState, useEffect,lazy  } from 'react';

//import { connect } from 'react-redux';
import Http from '../Http';
//import {CopyToClipboard} from 'react-copy-to-clipboard';
import Nav from 'react-bootstrap/Nav'
import { BrowserRouter as Router, Route, Link, Switch, browserHistory, IndexRoute } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faList, faBlog,faTag,faCogs,faCode,faHandsHelping,faFileImport,faAmericanSignLanguageInterpreting,faParagraph, faReceipt, faUser, faShoppingBag,faListAlt,faCopy } from '@fortawesome/free-solid-svg-icons'
//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
//import { includes } from 'lodash';
const Header = lazy(() => import("../components/Header"));

const ShowTranslationLang = (props) => {
 
let shop=props.match.params.shop;
const appurl = process.env.MIX_REACT_APP_URL_HANDLE;
let home_url ='https://admin.shopify.com/store/'+shop.split('.',1)+'/apps/'+appurl;
let string = "";
const [isActive, setisActive] = useState(true);


const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);
const [successlang, setSuccesslang] = useState(null);
const [Langdata, setLangData] = useState([]);
const [Langfr, setfrLangData] = useState([]);


const langurl = '/api/getlangdetails';

const getplan ='/api/getplan';
const [features, setFeatures] = useState([]);

var planUrl=0;
var langData = 0;

useEffect(() => {


    getLangData();
getplanURL()
getaddvisits();


}, []);

const  addvisits = '/api/addvisits';

const getaddvisits = async () => {

    await Http.get('/authenticate/token?shop='+shop);
  
    var millisecondsLoading =planUrl+langData;
               Http.post(addvisits,  { menu: 'translation list', shop: shop,milisecond:millisecondsLoading  },{
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

    var endTime = (new Date()).getTime();
    planUrl=parseInt(endTime-startTime)
  })
  .catch(() => {
   
  });

}

const getLangData = async () => {
  var startTime = (new Date()).getTime();

    await Http.get('/authenticate/token?shop='+shop);
       Http.post(`${langurl}`, { shop: shop},{ headers: { Authorization: `Bearer ${window.sessionToken}`} })
       .then((response) => {

        const { data } = response.data;
        setLangData(data);
        var endTime = (new Date()).getTime();
       langData=parseInt(endTime-startTime)
       })
   .catch(() => {
        setisActive(true);
        setError('Sorry, ubable to fetch data');

      });
  };


  const getFrLangData = async () => {

    Http.get(`${langurl}?lang=FR&user_id=${store_id}`)
      .then((response) => {
        const { data } = response.data;
        setfrLangData(data);

      })
      .catch(() => {
        setisActive(true);
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
            <Nav.Link className="" href={`/fieldsetup/${shop}`}>{<span> <FontAwesomeIcon icon={faCogs} /> Field Setup</span>}</Nav.Link>
            </Nav.Item>
           
            <Nav.Item>
            <Nav.Link className="" href={`/cartlayout/${shop}`}>{<span> <FontAwesomeIcon icon={faFile} /> Cart Layout</span>}</Nav.Link>
            </Nav.Item>

            {features.plan_id == 3? <Nav.Item>
            <Nav.Link className="btn btn-primary btn-sm" href={`/showtranslation/${shop}`}>{<span> <FontAwesomeIcon icon={faAmericanSignLanguageInterpreting} /> Field Translation</span>}</Nav.Link>
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


            <div className="float-center" style={{ paddingTop: "13px" }}>
              <h4> <strong>Field Translation</strong></h4> </div>


            {successlang && isActive && (
              <div className="alert alert-primary alert-dismissible" role="alert">

                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={() => hideAlert()}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                {successlang}
              </div>
            )}

            <div className="table-responsive">
              
              <table className="table table-bordered table-striped table-highlight">
                <thead>
                  <th>Langauge</th>
                  <th>Code</th>
                  <th>Primary </th>
                  <th>Published </th>


                </thead>
                <tbody>
                  {Langdata.map((langd) => (

                    <tr key={langd.id}>
                      <td><Link to={`/translation/${shop}/${langd.id}/${langd.name}/${langd.Lang}`}> {langd.name} </Link></td>
                      <td>{langd.Lang}</td>
                      <td>{langd.main == 1 ? "Yes" : "No"}</td>
                      <td>{langd.published == 1 ? "Yes" : "No"}</td>
                    </tr>

                  ))}

                </tbody>
              </table>
            </div>
         
  
           
       




  </div>
);


}



export default ShowTranslationLang;


